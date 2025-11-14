const messagesEl = document.getElementById('messages');
const inputEl = document.getElementById('input');
const sendBtn = document.getElementById('send');
const trainBtn = document.getElementById('train');

function appendMessage(who, text) {
  const div = document.createElement('div');
  div.className = 'msg ' + (who === 'user' ? 'user' : 'bot');
  div.textContent = (who === 'user' ? 'Anda: ' : 'Bot: ') + text;
  messagesEl.appendChild(div);
  messagesEl.scrollTop = messagesEl.scrollHeight;
}

async function sendMessage() {
  const msg = inputEl.value.trim();
  if (!msg) return;
  appendMessage('user', msg);
  inputEl.value = '';
  console.debug('Mengirim pesan:', msg);
  try {
    const r = await fetch('/api/chat', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: msg })
    });
    const j = await r.json();
    console.debug('Balasan diterima:', j);
    appendMessage('bot', j.reply || '(tidak ada balasan)');
  } catch (e) {
    console.error('Error kirim:', e);
    appendMessage('bot', 'Terjadi kesalahan (cek konsol)');
  }
}

async function trainModel() {
  try {
    const r = await fetch('/api/train', { method: 'POST' });
    const j = await r.json();
    console.debug('Train result:', j);
    appendMessage('bot', 'Pelatihan selesai. Kunci model: ' + (j.keys || j.status));
  } catch (e) {
    console.error('Train error', e);
    appendMessage('bot', 'Pelatihan gagal (cek konsol)');
  }
}

sendBtn.addEventListener('click', sendMessage);
inputEl.addEventListener('keydown', (e) => { if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) sendMessage(); });
trainBtn.addEventListener('click', trainModel);

// Debug: load conversation history to console
fetch('/api/conversations').then(r => r.json()).then(arr => {
  console.debug('Conversation history', arr);
  arr.slice(-50).forEach(c => { appendMessage('user', c.user); appendMessage('bot', c.bot); });
}).catch(e => console.debug('No history', e));
