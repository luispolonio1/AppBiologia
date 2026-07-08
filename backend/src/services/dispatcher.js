// Servidor WebSocket pegado al mismo puerto HTTP que Express.
// Los ESP32 se conectan a /ws?deviceId=...&animal=...
// y reciben un push cada vez que se registra una alimentacion
// (manual o por horario automatico).
const { WebSocketServer } = require('ws');
const url = require('url');

let wss = null;

function attach(server) {
  wss = new WebSocketServer({ server, path: '/ws' });

  wss.on('connection', (socket, req) => {
    const { query } = url.parse(req.url, true);
    const deviceId = (query.deviceId || 'unknown').toString();
    const animal = (query.animal || 'all').toString();
    socket.deviceId = deviceId;
    socket.animal = animal;

    // eslint-disable-next-line no-console
    console.log(`[ws] conectado deviceId=${deviceId} animal=${animal}`);

    socket.send(
      JSON.stringify({ type: 'hello', deviceId, animal, time: new Date().toISOString() })
    );

    socket.on('close', () => {
      // eslint-disable-next-line no-console
      console.log(`[ws] desconectado deviceId=${deviceId}`);
    });

    socket.on('error', (err) => {
      // eslint-disable-next-line no-console
      console.warn(`[ws] error deviceId=${deviceId}: ${err.message}`);
    });
  });

  // eslint-disable-next-line no-console
  console.log('[ws] dispatcher listo en ws://localhost:3000/ws');
}

// Notifica a todos los ESP32 suscritos a este animal.
// Si el cliente se suscribio con animal=all, recibe todo.
function broadcastFeeding(animal, payload) {
  if (!wss) return;
  const msg = JSON.stringify({
    type: 'feed',
    animal,
    amount: payload.amount,
    id: payload.id,
    scheduled: !!payload.scheduled,
    at: new Date().toISOString(),
  });
  let sent = 0;
  for (const client of wss.clients) {
    if (client.readyState !== 1) continue;
    if (client.animal === 'all' || client.animal === animal) {
      client.send(msg);
      sent++;
    }
  }
  // eslint-disable-next-line no-console
  console.log(`[ws] broadcast feed ${animal} ${payload.amount}kg -> ${sent} cliente(s)`);
}

// Util para debugging / healthcheck
function clientCount() {
  if (!wss) return 0;
  return [...wss.clients].filter((c) => c.readyState === 1).length;
}

module.exports = { attach, broadcastFeeding, clientCount };
