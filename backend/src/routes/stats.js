const express = require('express');
const config = require('../config');
const store = require('../store/feedingsStore');

const router = express.Router();

// Helpers de fechas en zona local del servidor.
function startOfDay(d = new Date()) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}
function startOfWeek(d = new Date()) {
  const x = startOfDay(d);
  // Lunes como inicio de semana
  const day = (x.getDay() + 6) % 7;
  x.setDate(x.getDate() - day);
  return x;
}
function startOfMonth(d = new Date()) {
  const x = startOfDay(d);
  x.setDate(1);
  return x;
}

function periodSince(period) {
  const now = new Date();
  switch (period) {
    case 'week':
      return startOfWeek(now).toISOString();
    case 'month':
      return startOfMonth(now).toISOString();
    case 'day':
    default:
      return startOfDay(now).toISOString();
  }
}

// GET /api/stats?period=day|week|month
// Devuelve por animal: total kg servidos, numero de veces alimentado,
// ultimo servicio y desglose por dia (solo para week/month).
router.get('/', (req, res) => {
  const period = ['day', 'week', 'month'].includes(req.query.period)
    ? req.query.period
    : 'day';
  const since = periodSince(period);

  const feedings = store.getFeedings({ since });

  const byAnimal = {};
  for (const a of config.animals) {
    byAnimal[a] = {
      animal: a,
      label: config.animalLabels[a],
      totalAmount: 0,
      feedCount: 0,
      lastFedAt: null,
    };
  }

  const dailyBreakdown = {}; // animal -> { 'YYYY-MM-DD': { amount, count } }

  for (const f of feedings) {
    const a = f.animal;
    if (!byAnimal[a]) continue;
    byAnimal[a].totalAmount += Number(f.amount) || 0;
    byAnimal[a].feedCount += 1;
    if (
      !byAnimal[a].lastFedAt ||
      new Date(f.createdAt) > new Date(byAnimal[a].lastFedAt)
    ) {
      byAnimal[a].lastFedAt = f.createdAt;
    }

    const dayKey = new Date(f.createdAt).toISOString().slice(0, 10);
    if (!dailyBreakdown[a]) dailyBreakdown[a] = {};
    if (!dailyBreakdown[a][dayKey]) {
      dailyBreakdown[a][dayKey] = { amount: 0, count: 0 };
    }
    dailyBreakdown[a][dayKey].amount += Number(f.amount) || 0;
    dailyBreakdown[a][dayKey].count += 1;
  }

  // Redondeos amigables para el cliente
  for (const a of config.animals) {
    byAnimal[a].totalAmount = Math.round(byAnimal[a].totalAmount * 100) / 100;
  }

  res.json({
    period,
    since,
    generatedAt: new Date().toISOString(),
    animals: Object.values(byAnimal),
    dailyBreakdown,
  });
});

module.exports = router;
