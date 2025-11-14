const fs = require('fs').promises;
const path = require('path');

const DATA_FILE = path.join(__dirname, 'data.json');
const MODEL_FILE = path.join(__dirname, 'model.json');

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

async function main() {
  try {
    const txt = await fs.readFile(DATA_FILE, 'utf8');
    const data = JSON.parse(txt || '[]');
    const text = data.map(d => `${d.user} ${d.bot}`).join(' ');
    const model = buildMarkov(text, 2);
    await fs.writeFile(MODEL_FILE, JSON.stringify(model, null, 2), 'utf8');
    console.log('Trained model. Keys:', Object.keys(model).length);
  } catch (e) {
    console.error('Train failed:', e.message);
  }
}

main();
