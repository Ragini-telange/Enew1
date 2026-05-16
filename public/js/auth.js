// ============================================
// GreenReward v5 — auth.js
// Handles: session, theme, language, toast, nav
// ============================================

const API = 'http://localhost:3000/api';

// ── Session ────────────────────────────────
function getToken() { return localStorage.getItem('gr_token'); }
function getUser()  { const u = localStorage.getItem('gr_user'); return u ? JSON.parse(u) : null; }
function setSession(token, user) { localStorage.setItem('gr_token', token); localStorage.setItem('gr_user', JSON.stringify(user)); }
function clearSession() { localStorage.removeItem('gr_token'); localStorage.removeItem('gr_user'); }
function isLoggedIn() { return !!getToken(); }
function logout() { clearSession(); location.href = 'index.html'; }

// ── API Helper ─────────────────────────────
async function apiRequest(method, endpoint, body = null, requireAuth = false) {
  const headers = { 'Content-Type': 'application/json' };
  if (requireAuth) {
    const t = getToken();
    if (!t) { location.href = 'login.html'; return null; }
    headers['Authorization'] = 'Bearer ' + t;
  }
  try {
    const res = await fetch(API + endpoint, { method, headers, body: body ? JSON.stringify(body) : null });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Request failed');
    return data;
  } catch (e) {
    console.error('API:', e.message);
    throw e;
  }
}

// ── THEME — with smooth page-to-page transition ──
const ThemeManager = {
  // Called ONCE at very top of <head> to prevent flash
  initEarly() {
    const saved = localStorage.getItem('gr_theme') || 'light';
    document.documentElement.setAttribute('data-theme', saved);
  },
  init() {
    const saved = localStorage.getItem('gr_theme') || 'light';
    this._apply(saved, false); // no transition on first load
    // After paint, enable transitions
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        document.documentElement.classList.add('theme-ready');
      });
    });
  },
  toggle() {
    const cur = document.documentElement.getAttribute('data-theme') || 'light';
    this._apply(cur === 'dark' ? 'light' : 'dark', true);
  },
  _apply(theme, animate) {
    if (!animate) {
      document.documentElement.classList.remove('theme-ready');
    }
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('gr_theme', theme);
    document.querySelectorAll('.theme-toggle').forEach(b => {
      b.textContent = theme === 'dark' ? '☀️' : '🌙';
    });
    // Update lang selector style on light-page navbars
    const sel = document.getElementById('lang-selector');
    if (sel) sel.setAttribute('data-theme-input', theme);
    if (!animate) {
      setTimeout(() => document.documentElement.classList.add('theme-ready'), 50);
    }
  }
};

// ── LANGUAGE ───────────────────────────────
// (uses LangManager from lang.js)

// ── NAVBAR ─────────────────────────────────
function updateNavbar() {
  const user = getUser();
  const na = document.getElementById('nav-auth');
  const nu = document.getElementById('nav-user');
  const nn = document.getElementById('nav-user-name');
  if (user && na && nu) {
    na.classList.add('hidden');
    nu.classList.remove('hidden');
    if (nn) nn.textContent = user.name;
  } else if (na && nu) {
    na.classList.remove('hidden');
    nu.classList.add('hidden');
  }
}

// ── TOAST ──────────────────────────────────
function showToast(msg, type = 'success') {
  let t = document.getElementById('toast');
  if (!t) { t = document.createElement('div'); t.id = 'toast'; document.body.appendChild(t); }
  t.textContent = msg;
  t.className = type === 'error' ? 'error' : '';
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 3200);
}

// ── MOBILE NAV ─────────────────────────────
function toggleMobile() {
  let m = document.getElementById('mobile-nav');
  if (!m) {
    m = document.createElement('div'); m.id = 'mobile-nav'; m.className = 'mobile-nav';
    const user = getUser();
    m.innerHTML = `
      <a href="index.html" class="nav-link">Home</a>
      <a href="plants.html" class="nav-link">Plants</a>
      <a href="weather.html" class="nav-link">Weather</a>
      <a href="donation.html" class="nav-link">Donate</a>
      <a href="game.html" class="nav-link">Game</a>
      <a href="dashboard.html" class="nav-link">My Garden</a>
      <div class="mobile-nav-footer">
        ${user
          ? `<span style="color:rgba(255,255,255,0.7);font-size:0.85rem">👤 ${user.name}</span>
             <button class="btn-ghost" onclick="logout()" style="color:rgba(255,255,255,0.5)">Logout</button>`
          : `<a href="login.html" class="btn-secondary" style="color:rgba(255,255,255,0.75);border-color:rgba(255,255,255,0.25)">Login</a>
             <a href="signup.html" class="btn-primary">Join Free</a>`
        }
      </div>`;
    document.body.appendChild(m);
  }
  m.classList.toggle('open');
}

// ── SCROLL ─────────────────────────────────
window.addEventListener('scroll', () => {
  const n = document.getElementById('navbar');
  if (n) n.classList.toggle('scrolled', window.scrollY > 40);
});

// ── INIT ───────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  ThemeManager.init();
  updateNavbar();
  if (typeof LangManager !== 'undefined') LangManager.init();
});
