const http = require('http');
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const config = require('./config');
const feedingsRouter = require('./routes/feedings');
const statsRouter = require('./routes/stats');
const schedulesRouter = require('./routes/schedules');
const scheduler = require('./services/scheduler');
const dispatcher = require('./services/dispatcher');

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.get('/', (req, res) => {
  res.json({
    name: 'Granja API',
    version: '1.0.0',
    endpoints: {
      'POST /api/feed/:animal': 'Registra una alimentacion (body: { amount? })',
      'GET /api/feedings': 'Lista de alimentaciones (?animal=&since=)',
      'GET /api/stats': 'Estadisticas agregadas (?period=day|week|month)',
      'GET /api/schedules': 'Lista de horarios automaticos',
      'PUT /api/schedules/:animal': 'Define horarios (body: { times: ["HH:MM"], amount? })',
      'DELETE /api/schedules/:animal': 'Borra el horario de un animal',
      'DELETE /api/feedings': 'Resetea el historial',
      'WS /ws?deviceId=...&animal=...': 'Stream de eventos para ESP32',
    },
    animals: config.animals,
    connectedDevices: dispatcher.clientCount(),
  });
});

app.get('/api/health', (req, res) => {
  res.json({
    ok: true,
    time: new Date().toISOString(),
    wsClients: dispatcher.clientCount(),
  });
});

app.use('/api/feed', feedingsRouter);
app.use('/api/feedings', feedingsRouter);
app.use('/api/stats', statsRouter);
app.use('/api/schedules', schedulesRouter);

// 404
app.use((req, res) => {
  res.status(404).json({ error: 'Not found', path: req.path });
});

// Manejador de errores
app.use((err, req, res, _next) => {
  // eslint-disable-next-line no-console
  console.error('[error]', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Creamos un server HTTP y le pegamos el WebSocket dispatcher.
const server = http.createServer(app);
dispatcher.attach(server);

server.listen(config.port, () => {
  // eslint-disable-next-line no-console
  console.log(`[granja-api] http + ws en http://localhost:${config.port}`);
  // Arranca el despachador de horarios automaticos.
  scheduler.start();
});
