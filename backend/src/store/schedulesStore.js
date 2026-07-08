// Almacena los horarios programados por animal.
const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const DATA_FILE = path.join(DATA_DIR, 'schedules.json');

function ensureFile() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify({ schedules: [] }, null, 2), 'utf-8');
  }
}

function readAll() {
  ensureFile();
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (e) {
    return { schedules: [] };
  }
}

function writeAll(data) {
  ensureFile();
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

function getAll() {
  return readAll().schedules;
}

function getForAnimal(animal) {
  return getAll().find((s) => s.animal === animal) || null;
}

function setForAnimal(animal, times, amount) {
  const data = readAll();
  const idx = data.schedules.findIndex((s) => s.animal === animal);
  const entry = { animal, times, amount };
  if (idx >= 0) {
    data.schedules[idx] = entry;
  } else {
    data.schedules.push(entry);
  }
  writeAll(data);
  return entry;
}

function deleteForAnimal(animal) {
  const data = readAll();
  data.schedules = data.schedules.filter((s) => s.animal !== animal);
  writeAll(data);
}

module.exports = { getAll, getForAnimal, setForAnimal, deleteForAnimal };
