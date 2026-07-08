// Servicio de cron: revisa cada minuto si algun horario coincide con la
// hora actual y registra una alimentacion automatica para ese animal.
const cron = require('node-cron');
const { nanoid } = require('nanoid');
const schedulesStore = require('../store/schedulesStore');
const feedingsStore = require('../store/feedingsStore');
const config = require('../config');
const dispatcher = require('./dispatcher');

// Para no disparar dos veces en el mismo minuto si el tick se solapa.
const lastTriggered = {};

function currentHHMM(d = new Date()) {
  const hh = String(d.getHours()).padStart(2, '0');
  const mm = String(d.getMinutes()).padStart(2, '0');
  return `${hh}:${mm}`;
}

function tick() {
  const now = new Date();
  const t = currentHHMM(now);

  for (const sched of schedulesStore.getAll()) {
    if (!sched.times || !sched.times.includes(t)) continue;
    if (lastTriggered[sched.animal] === t) continue;

    const amount = sched.amount ?? config.defaultFeedAmounts[sched.animal];
    const entry = {
      id: nanoid(8),
      animal: sched.animal,
      amount,
      createdAt: now.toISOString(),
      scheduled: true, // bandera: alimentacion automatica
    };
    feedingsStore.addFeeding(entry);
    dispatcher.broadcastFeeding(sched.animal, {
      id: entry.id,
      amount: entry.amount,
      scheduled: true,
    });
    lastTriggered[sched.animal] = t;
    // eslint-disable-next-line no-console
    console.log(`[scheduler] auto-feed ${sched.animal} ${amount}kg @ ${t}`);
  }

  // Limpia marcadores que ya no coinciden con la hora actual.
  for (const k of Object.keys(lastTriggered)) {
    if (lastTriggered[k] !== t) delete lastTriggered[k];
  }
}

function start() {
  // Cada minuto. En produccion se ajustaria al uso horario del usuario.
  cron.schedule('* * * * *', tick, { scheduled: true });
  // eslint-disable-next-line no-console
  console.log('[scheduler] activo (revisando cada minuto)');
}

module.exports = { start, tick, currentHHMM };
