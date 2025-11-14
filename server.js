const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const cors = require('cors');

const app = express();
const DATA_FILE = path.join(__dirname, 'data.json');
const MODEL_FILE = path.join(__dirname, 'model.json');

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

async function readJSON(filePath, fallback) {
  try {
    const txt = await fs.readFile(filePath, 'utf8');
    return JSON.parse(txt || 'null') || fallback;
  } catch (e) {
    return fallback;
  }
}

async function writeJSON(filePath, data) {
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8');
}

app.post('/api/chat', async (req, res) => {
  const { message } = req.body;
  if (!message) return res.status(400).json({ error: 'message required' });

  const model = await readJSON(MODEL_FILE, {});
  const reply = generateReply(message, model) || (`Saya masih belajar. Anda mengatakan: ${message}`);

  // Save conversation
  const now = new Date().toISOString();
  const conv = { timestamp: now, user: message, bot: reply };
  const data = await readJSON(DATA_FILE, []);
  data.push(conv);
  await writeJSON(DATA_FILE, data);

  res.json({ reply });
});

app.post('/api/train', async (req, res) => {
  try {
    const data = await readJSON(DATA_FILE, []);
    const text = data.map(d => `${d.user} ${d.bot}`).join(' ');
    const model = buildMarkov(text, 2);
    await writeJSON(MODEL_FILE, model);
    res.json({ status: 'trained', keys: Object.keys(model).length });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message });
  }
});

app.get('/api/conversations', async (req, res) => {
  const data = await readJSON(DATA_FILE, []);
  res.json(data);
});

function tokenize(s) {
  return String(s || '').split(/\s+/).filter(Boolean);
}

function buildMarkov(text, order = 2) {
  const tokens = tokenize(text).map(t => t.replace(/[^\w\p{P}\s]/gu, ''));
  const model = {};
  for (let i = 0; i + order < tokens.length; i++) {
    const key = tokens.slice(i, i + order).join(' ').toLowerCase();
    const next = tokens[i + order];
    if (!model[key]) model[key] = [];
    model[key].push(next);
  }
  return model;
}

function generateReply(seed, model, order = 2, max = 30) {
  if (!model || Object.keys(model).length === 0) return null;
  const seedTokens = tokenize(seed).slice(-order).map(t => t.toLowerCase());
  let key = seedTokens.join(' ');
  if (!model[key]) {
    const keys = Object.keys(model);
    key = keys[Math.floor(Math.random() * keys.length)];
  }
  const out = key.split(' ');
  for (let i = 0; i < max; i++) {
    const options = model[key];
    if (!options || !options.length) break;
    const next = options[Math.floor(Math.random() * options.length)];
    out.push(next);
    const tail = out.slice(-order).join(' ');
    key = tail;
  }
  return out.join(' ');
}

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running at http://localhost:${port}`));
