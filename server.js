require('dotenv').config();
const express = require('express');
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const path = require('path');
const multer = require('multer');
const fs = require('fs');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'greenreward_secret_2025';
const WEATHER_API_KEY = process.env.WEATHER_API_KEY || '';
const ANTHROPIC_KEY = process.env.ANTHROPIC_API_KEY || '';

// ── Middleware ─────────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ── File Upload ────────────────────────────────────────────────────────────
const uploadDir = path.join(__dirname, 'public', 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, uploadDir),
  filename: (_, file, cb) => cb(null, Date.now() + '-' + file.originalname.replace(/\s/g, '_'))
});
const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } });

// ── MySQL Pool ─────────────────────────────────────────────────────────────
let db;
async function initDB() {
  db = await mysql.createPool({
    host:     process.env.DB_HOST     || 'localhost',
    port:     parseInt(process.env.DB_PORT) || 3306,
    user:     process.env.DB_USER     || 'root',
    password: process.env.DB_PASSWORD || 'newpassword',
    database: process.env.DB_NAME     || 'greenreward',
    waitForConnections: true,
    connectionLimit: 10
  });

  // Create tables
  await db.execute(`
    CREATE TABLE IF NOT EXISTS users (
      id          INT AUTO_INCREMENT PRIMARY KEY,
      name        VARCHAR(120) NOT NULL,
      email       VARCHAR(200) UNIQUE NOT NULL,
      password    VARCHAR(255) NOT NULL,
      role        ENUM('user','org') DEFAULT 'user',
      xp          INT DEFAULT 0,
      level       INT DEFAULT 1,
      streak      INT DEFAULT 0,
      last_active DATE,
      created_at  DATETIME DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);

  await db.execute(`
    CREATE TABLE IF NOT EXISTS user_plants (
      id          INT AUTO_INCREMENT PRIMARY KEY,
      user_id     INT NOT NULL,
      plant_name  VARCHAR(150) NOT NULL,
      plant_emoji VARCHAR(20) DEFAULT '🌱',
      plant_type  VARCHAR(50) DEFAULT 'custom',
      notes       TEXT,
      added_at    DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);

  await db.execute(`
    CREATE TABLE IF NOT EXISTS plant_photos (
      id          INT AUTO_INCREMENT PRIMARY KEY,
      user_id     INT NOT NULL,
      plant_id    INT,
      plant_name  VARCHAR(150),
      photo_path  VARCHAR(500),
      caption     TEXT,
      uploaded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);

  await db.execute(`
    CREATE TABLE IF NOT EXISTS donations (
      id          INT AUTO_INCREMENT PRIMARY KEY,
      user_id     INT NOT NULL,
      org_name    VARCHAR(150) NOT NULL,
      amount      DECIMAL(10,2) NOT NULL,
      donor_name  VARCHAR(120),
      donor_email VARCHAR(200),
      donated_at  DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);

  await db.execute(`
    CREATE TABLE IF NOT EXISTS water_log (
      id          INT AUTO_INCREMENT PRIMARY KEY,
      user_id     INT NOT NULL,
      plant_id    INT,
      watered_at  DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);

  await db.execute(`
    CREATE TABLE IF NOT EXISTS chat_history (
      id          INT AUTO_INCREMENT PRIMARY KEY,
      user_id     INT,
      user_msg    TEXT,
      bot_reply   TEXT,
      created_at  DATETIME DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);

  console.log('✅ MySQL connected and tables ready');
}

// ── Auth Middleware ────────────────────────────────────────────────────────
function authRequired(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Login required' });
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
}

function optionalAuth(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (token) {
    try { req.user = jwt.verify(token, JWT_SECRET); } catch {}
  }
  next();
}

// ── XP helper ─────────────────────────────────────────────────────────────
async function addXP(userId, amount) {
  await db.execute('UPDATE users SET xp = xp + ? WHERE id = ?', [amount, userId]);
}

// ═══════════════════════════════════════════════════════════════════════════
// AUTH ROUTES
// ═══════════════════════════════════════════════════════════════════════════

app.post('/api/signup', async (req, res) => {
  const { name, email, password, role } = req.body;
  if (!name || !email || !password) return res.status(400).json({ error: 'All fields required' });
  try {
    const hash = await bcrypt.hash(password, 10);
    const [result] = await db.execute(
      'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
      [name, email, hash, role || 'user']
    );
    const user = { id: result.insertId, name, email, role: role || 'user', xp: 0, level: 1 };
    const token = jwt.sign(user, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user });
  } catch (e) {
    if (e.code === 'ER_DUP_ENTRY') return res.status(400).json({ error: 'Email already registered' });
    res.status(500).json({ error: 'Server error: ' + e.message });
  }
});

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  const [rows] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
  if (!rows.length) return res.status(400).json({ error: 'User not found' });
  const u = rows[0];
  const match = await bcrypt.compare(password, u.password);
  if (!match) return res.status(400).json({ error: 'Incorrect password' });
  // Update streak
  const today = new Date().toISOString().split('T')[0];
  await db.execute('UPDATE users SET last_active = ? WHERE id = ?', [today, u.id]);
  const user = { id: u.id, name: u.name, email: u.email, role: u.role, xp: u.xp, level: u.level, streak: u.streak };
  const token = jwt.sign(user, JWT_SECRET, { expiresIn: '7d' });
  res.json({ token, user });
});

app.get('/api/me', authRequired, async (req, res) => {
  const [rows] = await db.execute(
    'SELECT id, name, email, role, xp, level, streak, created_at FROM users WHERE id = ?',
    [req.user.id]
  );
  if (!rows.length) return res.status(404).json({ error: 'Not found' });
  res.json(rows[0]);
});

// ═══════════════════════════════════════════════════════════════════════════
// LEADERBOARD (public)
// ═══════════════════════════════════════════════════════════════════════════

app.get('/api/leaderboard', async (req, res) => {
  const [rows] = await db.execute('SELECT name, xp, level FROM users ORDER BY xp DESC LIMIT 10');
  res.json(rows);
});

// ═══════════════════════════════════════════════════════════════════════════
// USER PLANTS
// ═══════════════════════════════════════════════════════════════════════════

app.get('/api/my-plants', authRequired, async (req, res) => {
  const [rows] = await db.execute(
    'SELECT * FROM user_plants WHERE user_id = ? ORDER BY added_at DESC',
    [req.user.id]
  );
  res.json(rows);
});

app.post('/api/my-plants', authRequired, async (req, res) => {
  const { plant_name, plant_emoji, plant_type, notes } = req.body;
  if (!plant_name) return res.status(400).json({ error: 'Plant name required' });
  const [result] = await db.execute(
    'INSERT INTO user_plants (user_id, plant_name, plant_emoji, plant_type, notes) VALUES (?, ?, ?, ?, ?)',
    [req.user.id, plant_name, plant_emoji || '🌱', plant_type || 'custom', notes || '']
  );
  await addXP(req.user.id, 100);
  res.json({ id: result.insertId, plant_name, plant_emoji, message: '+100 XP earned!' });
});

app.delete('/api/my-plants/:id', authRequired, async (req, res) => {
  await db.execute('DELETE FROM user_plants WHERE id = ? AND user_id = ?', [req.params.id, req.user.id]);
  res.json({ success: true });
});

// ═══════════════════════════════════════════════════════════════════════════
// WATER LOG
// ═══════════════════════════════════════════════════════════════════════════

app.post('/api/water/:plantId', authRequired, async (req, res) => {
  await db.execute('INSERT INTO water_log (user_id, plant_id) VALUES (?, ?)', [req.user.id, req.params.plantId]);
  await addXP(req.user.id, 10);
  res.json({ success: true, message: '+10 XP for watering!' });
});

// ═══════════════════════════════════════════════════════════════════════════
// PHOTO UPLOAD
// ═══════════════════════════════════════════════════════════════════════════

app.post('/api/upload-photo', authRequired, upload.single('photo'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  const photoPath = '/uploads/' + req.file.filename;
  await db.execute(
    'INSERT INTO plant_photos (user_id, plant_name, photo_path, caption) VALUES (?, ?, ?, ?)',
    [req.user.id, req.body.plant_name || 'My Plant', photoPath, req.body.caption || '']
  );
  await addXP(req.user.id, 30);
  res.json({ photo_path: photoPath, message: '+30 XP for uploading!' });
});

app.get('/api/my-photos', authRequired, async (req, res) => {
  const [rows] = await db.execute(
    'SELECT * FROM plant_photos WHERE user_id = ? ORDER BY uploaded_at DESC',
    [req.user.id]
  );
  res.json(rows);
});

// ═══════════════════════════════════════════════════════════════════════════
// DONATIONS
// ═══════════════════════════════════════════════════════════════════════════

app.post('/api/donate', authRequired, async (req, res) => {
  const { org_name, amount, donor_name, donor_email } = req.body;
  if (!org_name || !amount) return res.status(400).json({ error: 'Org and amount required' });
  const [result] = await db.execute(
    'INSERT INTO donations (user_id, org_name, amount, donor_name, donor_email) VALUES (?, ?, ?, ?, ?)',
    [req.user.id, org_name, amount, donor_name, donor_email]
  );
  await addXP(req.user.id, 50);
  res.json({ id: result.insertId, message: '+50 XP for donating!' });
});

app.get('/api/my-donations', authRequired, async (req, res) => {
  const [rows] = await db.execute(
    'SELECT * FROM donations WHERE user_id = ? ORDER BY donated_at DESC',
    [req.user.id]
  );
  res.json(rows);
});

// ═══════════════════════════════════════════════════════════════════════════
// STATS
// ═══════════════════════════════════════════════════════════════════════════

app.get('/api/stats', authRequired, async (req, res) => {
  const uid = req.user.id;
  const [[user]] = await db.execute('SELECT xp, level, streak FROM users WHERE id = ?', [uid]);
  const [[p]] = await db.execute('SELECT COUNT(*) as c FROM user_plants WHERE user_id = ?', [uid]);
  const [[ph]] = await db.execute('SELECT COUNT(*) as c FROM plant_photos WHERE user_id = ?', [uid]);
  const [[d]] = await db.execute('SELECT COALESCE(SUM(amount),0) as total FROM donations WHERE user_id = ?', [uid]);
  res.json({ xp: user?.xp || 0, level: user?.level || 1, streak: user?.streak || 0, trees: p?.c || 0, photos: ph?.c || 0, donated: d?.total || 0 });
});

// ═══════════════════════════════════════════════════════════════════════════
// LIVE WEATHER — OpenWeatherMap
// ═══════════════════════════════════════════════════════════════════════════

app.get('/api/weather', async (req, res) => {
  const city = req.query.city || 'Solapur';
  if (!WEATHER_API_KEY || WEATHER_API_KEY === 'your_openweathermap_api_key_here') {
    // Return mock data if no API key
    return res.json({
      city: city,
      temp: 31,
      feels_like: 34,
      humidity: 42,
      description: 'Partly Cloudy',
      wind: 14,
      uv: 7,
      rain_chance: 10,
      icon: '⛅',
      mock: true
    });
  }
  try {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${WEATHER_API_KEY}&units=metric`;
    const resp = await fetch(url);
    if (!resp.ok) return res.status(400).json({ error: 'City not found. Try a different city name.' });
    const data = await resp.json();
    const icon = getWeatherIcon(data.weather[0].main);
    res.json({
      city: data.name + ', ' + data.sys.country,
      temp: Math.round(data.main.temp),
      feels_like: Math.round(data.main.feels_like),
      humidity: data.main.humidity,
      description: data.weather[0].description,
      wind: Math.round(data.wind.speed * 3.6), // m/s to km/h
      icon,
      rain_chance: data.rain ? 80 : 10,
      mock: false
    });
  } catch (e) {
    res.status(500).json({ error: 'Weather service error: ' + e.message });
  }
});

function getWeatherIcon(main) {
  const map = { Clear:'☀️', Clouds:'⛅', Rain:'🌧️', Drizzle:'🌦️', Thunderstorm:'⛈️', Snow:'❄️', Mist:'🌫️', Fog:'🌫️', Haze:'🌫️' };
  return map[main] || '🌡️';
}

// ═══════════════════════════════════════════════════════════════════════════
// AI CHATBOT — Anthropic Claude (with rule-based fallback)
// ═══════════════════════════════════════════════════════════════════════════

app.post('/api/chat', optionalAuth, async (req, res) => {
  const { message, history = [] } = req.body;
  if (!message) return res.status(400).json({ error: 'Message required' });

  // Save chat to DB if user logged in
  if (req.user) {
    try {
      await db.execute('INSERT INTO chat_history (user_id, user_msg) VALUES (?, ?)', [req.user.id, message]);
    } catch {}
  }

  // Use Anthropic API if key is set
if (false) {    try {
      const messages = [
        ...history.slice(-6).map(h => ({
          role: h.role,
          content: h.content
        })),
        { role: 'user', content: message }
      ];

      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': ANTHROPIC_KEY,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: 'claude-3-haiku-20240307',
          max_tokens: 600,
          system: `You are Vriksha Mitra, a friendly expert plant care and gardening assistant for GreenReward — an Indian web app that rewards users for planting and caring for trees. 

You help users with:
- Plant care tips (watering, sunlight, soil, fertilizing, pruning)
- Plant identification and information
- Weather and seasonal gardening advice for Indian climate
- Plant diseases and pest control using organic methods
- Ayurvedic and medicinal plants (tulsi, neem, ashwagandha, giloy etc.)
- Indoor plant recommendations for apartments
- GreenReward app features (XP, rewards, donations, uploading photos)

Always give practical, specific advice. Mention Indian context (cities, seasons, climate). Keep answers concise and friendly. If asked in Hindi or Marathi, respond in that language. If unsure about something, say so honestly.`,
          messages
        })
      });
      const data = await response.json();
      const reply = data.content?.[0]?.text || 'I could not process that. Please try again.';

      if (req.user) {
        try {
          await db.execute(
            'UPDATE chat_history SET bot_reply = ? WHERE user_id = ? ORDER BY id DESC LIMIT 1',
            [reply, req.user.id]
          );
        } catch {}
      }

      return res.json({ reply, ai: true });
    } catch (e) {
      console.error('Anthropic API error:', e.message);
      // Fall through to rule-based
    }
  }

  // Rule-based fallback
  const reply = getRuleBasedReply(message);
  res.json({ reply, ai: false });
});

function getRuleBasedReply(msg) {
  const u = msg.toLowerCase();
  if (u.match(/hello|hi|hey|नमस्ते|नमस्कार/)) return 'Hello! 🌿 I\'m Vriksha Mitra. Ask me about any plant, care tips, or weather advice!';
  if (u.match(/water|watering|पानी|पाणी/)) return '💧 Water at the base, early morning or evening. Check 2cm deep — if moist, skip. Overwatering kills more plants than underwatering! Most plants need water every 2-3 days in summer, less in winter.';
  if (u.match(/neem|नीम|निंब/)) return '🌳 Neem (Azadirachta indica): Full sun, low water once established. Very drought tolerant. Neem oil (5ml/L water) is an excellent organic pesticide. Medicinal benefits: antifungal, antibacterial. Grows fast in India\'s climate.';
  if (u.match(/tulsi|तुलसी|तुळस/)) return '🌿 Tulsi (Holy Basil): Needs full sun and regular watering. Pinch flower buds to get more leaves. Great immunity booster — make kadha with ginger. Sacred plant, easy to grow in pots on balconies.';
  if (u.match(/aloe|एलोवेरा|कोरफड/)) return '🌵 Aloe Vera: Water only once every 2-3 weeks. Indirect sunlight. Never let it sit in water. Gel inside leaves is excellent for burns, skin, and hair. Extremely low maintenance.';
  if (u.match(/monsoon|rain|पावसाळ|बारिश/)) return '🌧️ Monsoon gardening tips: Best time to plant most trees! Reduce manual watering. Watch for fungal diseases — improve air circulation. Avoid overhead watering. Apply copper-based fungicide if you see leaf spots.';
  if (u.match(/summer|heat|गर्मी|उन्हाळ/)) return '☀️ Summer care: Water twice daily in peak heat. Use mulch to retain moisture. Provide afternoon shade for sensitive plants. Aloe Vera, Neem, Marigold thrive in heat. Avoid fertilizing in extreme heat.';
  if (u.match(/indoor|घर|room|office/)) return '🪴 Best indoor plants: Snake Plant (low light, night oxygen), Pothos (very easy), Peace Lily (shade-loving), Aloe Vera (low water), Spider Plant (air purifier). All do well in Indian homes.';
  if (u.match(/pest|insect|bug|कीड/)) return '🐛 Organic pest control: Spray neem oil (5ml per liter water) every 2 weeks. Check leaf undersides weekly. Use yellow sticky traps for whiteflies. Marigolds repel pests naturally when planted nearby.';
  if (u.match(/fertiliz|compost|खाद|manure/)) return '🌱 Fertilizing tips: Use vermicompost or kitchen compost every 4-6 weeks during growing season (March-September). Banana peel water is great for potassium. Used tea leaves add nitrogen. Avoid chemical fertilizers for edible plants.';
  if (u.match(/soil|माती|मिट्टी/)) return '🪱 Best soil mix for pots: Cocopeat 40% + Garden soil 30% + Compost/Vermicompost 30%. Always use pots with drainage holes. Never use pure garden clay — it becomes waterlogged.';
  if (u.match(/reward|xp|point|पुरस्कार|बक्षीस/)) return '🏆 Earn XP on GreenReward: Water plants (+10 XP), Upload growth photos (+30 XP), Add new plants (+100 XP), Donate to NGOs (+50 XP). Reach 1000 XP to unlock real gifts!';
  if (u.match(/weather|मौसम|हवामान/)) return '🌤️ For live weather, go to the Weather page and type your city name. You\'ll see temperature, humidity, UV index, and plant care tips specific to today\'s weather!';
  if (u.match(/thank|धन्यवाद|आभार/)) return '🌿 Happy gardening! Every tree makes India greener. Keep growing! 🌱';
  if (u.match(/giloy|गिलोय|गुळवेल/)) return '🍀 Giloy (Amrit of Ayurveda): Climbing plant, grows on support. Partial shade, moderate water. Incredible immunity booster — used during COVID. Boil stems in water to make immunity kadha.';
  if (u.match(/rose|गुलाब/)) return '🌹 Rose care: Full sun (6+ hours), water at base (not on leaves), well-drained soil. Prune in winter. Feed with banana peel compost. Check for aphids under new leaves weekly.';
  if (u.match(/mango|आम|आंबा/)) return '🥭 Mango tree: Full sun, water deeply but infrequently. Prune after fruiting season. Best to plant in June-July monsoon. Give potassium-rich fertilizer before flowering (Dec-Jan).';
  return '🌿 I can help with plant care, watering schedules, pest control, Indian seasonal tips, and GreenReward features! Try asking: "How to care for Tulsi?" or "What to plant in monsoon?" or "How to get more XP?"';
}

// ═══════════════════════════════════════════════════════════════════════════
// CATCH-ALL
// ═══════════════════════════════════════════════════════════════════════════

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ═══════════════════════════════════════════════════════════════════════════
// START
// ═══════════════════════════════════════════════════════════════════════════

initDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`\n🌿 GreenReward v5 running at http://localhost:${PORT}`);
      console.log(`📊 MySQL: ${process.env.DB_HOST || 'localhost'}/${process.env.DB_NAME || 'greenreward'}`);
      console.log(`🌤  Weather API: ${WEATHER_API_KEY ? 'Connected' : 'Using mock data (add key to .env)'}`);
      console.log(`🤖 AI Chatbot: ${ANTHROPIC_KEY ? 'Anthropic Claude' : 'Rule-based (add key to .env)'}\n`);
    });
  })
  .catch(err => {
    console.error('❌ Failed to connect to MySQL:', err.message);
    console.error('\n👉 Make sure MySQL is running and your .env file has correct DB credentials\n');
    process.exit(1);
  });
