import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import wspRoutes from './routes/wsp.routes.js';
import finraRoutes from './routes/finra.routes.js';
import { startPollScheduler } from './services/pollScheduler.service.js';

const app = express();
const PORT = parseInt(process.env.PORT ?? '4000', 10);

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(cors({
  origin: [
    process.env.CLIENT_URL ?? 'http://localhost:3000',
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    // Allow GitHub Pages to call the local backend
    'https://wenge130.github.io',
  ],
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// ─── Health Check ─────────────────────────────────────────────────────────────
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'DMP OS Backend',
    version: '1.0.0-poc',
    timestamp: new Date().toISOString(),
  });
});

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use('/api/wsp', wspRoutes);
app.use('/api/finra', finraRoutes);

// ─── 404 Handler ─────────────────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// ─── Error Handler ────────────────────────────────────────────────────────────
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('[Server Error]', err);
  res.status(500).json({ error: err.message ?? 'Internal server error' });
});

// ─── Start ────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🚀 DMP OS Backend running on http://localhost:${PORT}`);
  console.log(`   Health: http://localhost:${PORT}/api/health`);
  console.log(`   WSP API: http://localhost:${PORT}/api/wsp`);
  console.log(`   FINRA API: http://localhost:${PORT}/api/finra\n`);

  // Start FINRA polling scheduler
  startPollScheduler();
});

export default app;
