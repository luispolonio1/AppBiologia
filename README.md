# AppBiologia — Gestión de Granja

App de ejemplo para llevar el control de alimentación de una granja pequeña
(cerdos, pollos y vacas). El proyecto está dividido en dos carpetas
independientes:

```
AppBiologia/
├── backend/   # API REST en Express
└── frontend/  # App móvil con Expo + React Native + NativeWind
```

## Funcionalidad

- **Estadísticas** — Total de comida servida hoy, número de veces que se
  alimentó a cada animal y hora del último servicio. Selector de periodo
  (Hoy / Semana / Mes).
- **Alimentar** — Tres botones grandes (Cerdos, Pollos, Vacas) que registran
  una toma de comida contra el backend. Cantidades por defecto:
  Cerdos 5 kg, Pollos 1.5 kg, Vacas 10 kg (configurables en el body).

## Backend

```bash
cd backend
npm install
npm start         # http://localhost:3000
```

Endpoints principales:

| Método | Ruta                       | Descripción                                   |
| ------ | -------------------------- | --------------------------------------------- |
| GET    | `/`                        | Info de la API y endpoints disponibles        |
| GET    | `/api/health`              | Health check                                  |
| POST   | `/api/feed/:animal`        | Registra alimentación. Body: `{ amount? }`    |
| GET    | `/api/feedings`            | Lista de alimentaciones (`?animal=&since=`)   |
| GET    | `/api/stats?period=…`      | `day` / `week` / `month` (por defecto `day`)  |
| DELETE | `/api/feedings`            | Resetea el historial (útil para pruebas)      |

Animales soportados: `cerdos`, `pollos`, `vacas`.

Los datos se persisten en `backend/data/feedings.json`. Para resetear a
estado limpio basta con `DELETE /api/feedings` o borrar ese archivo.

## Frontend

```bash
cd frontend
npm install
npm start         # arranca Metro y abre Expo Go
```

> Si vas a probar en un dispositivo físico, edita
> `frontend/app.json > extra.apiUrl` con la IP de tu PC (por ejemplo
> `http://192.168.1.20:3000`). En emulador Android usa `http://10.0.2.2:3000`.

### Stack

- Expo SDK 52 + React Native 0.76
- NativeWind 4 + TailwindCSS 3
- React Navigation (bottom tabs)
- Sin TypeScript (JS plano) para mantener el ejemplo ligero

### Estructura

```
frontend/
├── App.js                    # NavigationContainer + bottom tabs
├── app.json                  # Configuración Expo
├── babel.config.js           # NativeWind + Worklets
├── metro.config.js           # Metro + NativeWind
├── tailwind.config.js        # Paleta brand / earth / ink
├── global.css                # Directivas Tailwind
├── assets/                   # Imágenes locales (animales + icono)
└── src/
    ├── api/client.js         # Cliente HTTP
    ├── components/           # StatCard, FeedButton, Header
    ├── constants/            # colors.js, animals.js
    └── screens/              # StatsScreen, FeedScreen
```

## Diseño

La paleta y la composición se inspiran en las referencias visuales
adjuntas: verde lima (`#9ACD2C`) como acento principal, blanco como
superficie, tarjetas con esquinas redondeadas y sombras suaves. La
pantalla de Estadísticas tiene un resumen del periodo en un card verde
grande y una tarjeta por animal. La pantalla de Alimentar muestra los
tres animales como botones tipo "chip" con foto, etiqueta y cantidad
por defecto.

## Pruebas rápidas

Con el backend corriendo:

```bash
curl -X POST http://localhost:3000/api/feed/cerdos -H "Content-Type: application/json" -d '{}'
curl -X POST http://localhost:3000/api/feed/pollos -H "Content-Type: application/json" -d '{"amount":2}'
curl -X POST http://localhost:3000/api/feed/vacas  -H "Content-Type: application/json" -d '{}'
curl http://localhost:3000/api/stats
```
