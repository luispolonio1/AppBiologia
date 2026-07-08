const express = require('express');
const { nanoid } = require('nanoid');
const config = require('../config');
const store = require('../store/feedingsStore');
const dispatcher = require('../services/dispatcher');

const router = express.Router();

// POST /api/feed/:animal  body: { amount?: number }
// Registra una alimentacion para el animal indicado.
router.post('/:animal', (req, res) => {
  const { animal } = req.params;
  if (!config.animals.includes(animal)) {
    return res.status(400).json({
      error: 'Animal no soportado',
      allowed: config.animals,
    });
  }

  const rawAmount = req.body?.amount;
  let amount = Number(rawAmount);
  if (!Number.isFinite(amount) || amount <= 0) {
    amount = config.defaultFeedAmounts[animal];
  }
  if (amount > config.maxFeedAmount) {
    return res.status(400).json({
      error: `La cantidad excede el maximo permitido (${config.maxFeedAmount} kg)`,
    });
  }

  const entry = {
    id: nanoid(8),
    animal,
    amount, // kg
    createdAt: new Date().toISOString(),
  };
  store.addFeeding(entry);
  // Notifica a los ESP32 suscritos a este animal.
  dispatcher.broadcastFeeding(animal, { id: entry.id, amount: entry.amount });
  res.status(201).json(entry);
});

// GET /api/feedings?animal=&since=ISO
router.get('/', (req, res) => {
  const { animal, since } = req.query;
  const list = store.getFeedings({ animal, since });
  res.json({ count: list.length, items: list });
});

// DELETE /api/feedings  (util para tests / reset)
router.delete('/', (req, res) => {
  store.clearAll();
  res.json({ ok: true });
});

module.exports = router;
