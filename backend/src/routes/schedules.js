const express = require('express');
const config = require('../config');
const store = require('../store/schedulesStore');

const router = express.Router();

function validateTimes(times) {
  if (!Array.isArray(times)) return 'times debe ser un array';
  if (times.length > 10) return 'maximo 10 horarios por animal';
  for (const t of times) {
    if (typeof t !== 'string' || !/^\d{2}:\d{2}$/.test(t)) {
      return `horario invalido: ${t}`;
    }
    const [h, m] = t.split(':').map(Number);
    if (h < 0 || h > 23 || m < 0 || m > 59) {
      return `horario fuera de rango: ${t}`;
    }
  }
  return null;
}

// GET /api/schedules
router.get('/', (req, res) => {
  res.json({ schedules: store.getAll() });
});

// GET /api/schedules/:animal
router.get('/:animal', (req, res) => {
  const { animal } = req.params;
  if (!config.animals.includes(animal)) {
    return res.status(400).json({ error: 'Animal no soportado' });
  }
  const sched = store.getForAnimal(animal);
  res.json(
    sched || {
      animal,
      times: [],
      amount: config.defaultFeedAmounts[animal],
    }
  );
});

// PUT /api/schedules/:animal
// body: { times: ['08:00', '18:00'], amount?: number }
router.put('/:animal', (req, res) => {
  const { animal } = req.params;
  if (!config.animals.includes(animal)) {
    return res.status(400).json({ error: 'Animal no soportado' });
  }

  const err = validateTimes(req.body?.times);
  if (err) return res.status(400).json({ error: err });

  const amount = Number(req.body?.amount) || config.defaultFeedAmounts[animal];
  if (!Number.isFinite(amount) || amount <= 0) {
    return res.status(400).json({ error: 'Cantidad invalida' });
  }
  if (amount > config.maxFeedAmount) {
    return res.status(400).json({ error: 'Cantidad excede el maximo' });
  }

  const entry = store.setForAnimal(animal, req.body.times, amount);
  res.json(entry);
});

// DELETE /api/schedules/:animal
router.delete('/:animal', (req, res) => {
  const { animal } = req.params;
  if (!config.animals.includes(animal)) {
    return res.status(400).json({ error: 'Animal no soportado' });
  }
  store.deleteForAnimal(animal);
  res.json({ ok: true });
});

module.exports = router;
