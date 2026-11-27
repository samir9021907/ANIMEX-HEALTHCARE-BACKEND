import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import { ENV } from './config/env.config';
import { connectDatabase } from './config/db';
import { initNeonDatabase } from './models/db.init';
import { corsMiddleware } from './middlewares/cors.middleware';
import { errorMiddleware } from './middlewares/error.middleware';
import apiRoutes from './routes/index.routes';

dotenv.config();

export const app = express();

// ─── Middleware ─────────────────────────────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(corsMiddleware);

// ─── Health Check Route ───────────────────────────────────────────────────────
app.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'OK',
    message: 'ANIMEX Animal Health Care API Engine Active',
    database: 'Neon PostgreSQL (Connected)',
    timestamp: new Date().toISOString(),
  });
});

// ─── Root Route ───────────────────────────────────────────────────────────────
app.get('/', (req: Request, res: Response) => {
  res.json({
    name: 'ANIMEX ANIMAL HEALTH CARE PRIVATE LIMITED REST API',
    version: '1.0.0',
    documentation: '/api',
    health: '/health',
  });
});

// ─── API Routes ──────────────────────────────────────────────────────────────
app.use('/api', apiRoutes);

// ─── Global Error Handler ────────────────────────────────────────────────────
app.use(errorMiddleware);

// ─── Start Server ────────────────────────────────────────────────────────────
export const startServer = async () => {
  try {
    console.log(`====================================================`);
    console.log(`  ANIMEX ANIMAL HEALTH CARE PRIVATE LIMITED SERVER   `);
    console.log(`====================================================`);

    // 1. Connect to Neon Cloud Database
    const isDbConnected = await connectDatabase();

    // 2. Initialize tables & seed data in Neon
    if (isDbConnected) {
      await initNeonDatabase();
    }

    // 3. Listen on configured PORT & HOST
    app.listen(ENV.PORT, ENV.HOST, () => {
      console.log(`🚀 REST API running at: http://${ENV.HOST}:${ENV.PORT}/api`);
      console.log(`💚 Health Check endpoint: http://${ENV.HOST}:${ENV.PORT}/health`);
      console.log(`====================================================`);
    });
  } catch (error: any) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

if (process.env.NODE_ENV !== 'test') {
  startServer();
}

export default app;
