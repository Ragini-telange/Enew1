// ============================================
// GreenReward v5 — AI Chatbot
// Uses /api/chat (Anthropic if key set, else rule-based)
// ============================================

let chatHistory = [];
let chatOpen = false;

function toggleChat() {
  chatOpen = !chatOpen;
  const panel = document.getElementById('chatbot-panel');
  if (!panel) return;
  panel.classList.toggle('open', chatOpen);
  if (chatOpen && document.getElementById('chat-msgs').children.length === 0) {
    const lang = typeof LangManager !== 'undefined' ? LangManager.current : 'en';
    const greet = lang === 'hi'
      ? 'नमस्ते! 🌿 मैं वृक्ष मित्र हूं। पौधों, मौसम, या GreenReward के बारे में कुछ भी पूछें!'
      : lang === 'mr'
      ? 'नमस्कार! 🌿 मी वृक्ष मित्र आहे। कोणत्याही झाड, हवामान किंवा GreenReward बद्दल विचारा!'
      : 'Hello! 🌿 I\'m Vriksha Mitra, your plant & gardening assistant. Ask me anything about plants, weather, or GreenReward!';
    addMsg('bot', greet);
  }
}

function addMsg(type, text) {
  const box = document.getElementById('chat-msgs');
  if (!box) return;
  const div = document.createElement('div');
  div.className = 'msg ' + type;
  div.textContent = text;
  box.appendChild(div);
  box.scrollTop = box.scrollHeight;
  return div;
}

async function chatSend() {
  const inp = document.getElementById('chat-in');
  const sendBtn = document.querySelector('.chat-send-btn');
  if (!inp) return;
  const msg = inp.value.trim();
  if (!msg) return;

  addMsg('user', msg);
  inp.value = '';
  chatHistory.push({ role: 'user', content: msg });

  // Show typing indicator
  const typing = addMsg('bot', '...');
  typing.classList.add('typing');
  if (sendBtn) sendBtn.disabled = true;

  try {
    const token = typeof getToken === 'function' ? getToken() : null;
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = 'Bearer ' + token;

    const res = await fetch('/api/chat', {
      method: 'POST',
      headers,
      body: JSON.stringify({ message: msg, history: chatHistory.slice(-6) })
    });
    const data = await res.json();
    const reply = data.reply || 'Sorry, I could not process that.';

    // Remove typing, add real reply
    typing.remove();
    addMsg('bot', reply);
    chatHistory.push({ role: 'assistant', content: reply });

    // Update AI badge
    const badge = document.querySelector('.chat-ai-badge');
    if (badge) badge.textContent = data.ai ? '✨ AI' : '🌿 Smart';
  } catch (e) {
    typing.remove();
    addMsg('bot', 'Sorry, could not connect. Please check if the server is running.');
  }

  if (sendBtn) sendBtn.disabled = false;
  // Keep last 10 messages in history
  if (chatHistory.length > 10) chatHistory = chatHistory.slice(-10);
}
