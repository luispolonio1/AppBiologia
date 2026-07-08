// Almacenamiento simple en archivo JSON. Suficiente para una app de
// demostracion; si crece, se sustituye por SQLite/Postgres sin tocar rutas.
const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const DATA_FILE = path.join(DATA_DIR, 'feedings.json');

function ensureFile() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify({ feedings: [] }, null, 2), 'utf-8');
  }
}

function readAll() {
  ensureFile();
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (e) {
    return { feedings: [] };
  }
}

function writeAll(data) {
  ensureFile();
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

function addFeeding(entry) {
  const data = readAll();
  data.feedings.push(entry);
  writeAll(data);
  return entry;
}

function getFeedings(filter = {}) {
  const data = readAll();
  let list = data.feedings;
  if (filter.animal) list = list.filter((f) => f.animal === filter.animal);
  if (filter.since) {
    const since = new Date(filter.since).getTime();
    list = list.filter((f) => new Date(f.createdAt).getTime() >= since);
  }
  // Mas recientes primero
  return [...list].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

function clearAll() {
  writeAll({ feedings: [] });
}

module.exports = { readAll, writeAll, addFeeding, getFeedings, clearAll };
