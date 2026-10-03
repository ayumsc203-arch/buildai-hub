import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './db';
import { seedDatabase } from './seed';

import authRouter from './routes/auth';
import toolsRouter from './routes/tools';
import categoriesRouter from './routes/categories';
import reviewsRouter from './routes/reviews';
import favoritesRouter from './routes/favorites';
import submissionsRouter from './routes/submissions';
import adminRouter from './routes/admin';
import analyticsRouter from './routes/analytics';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health Check
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    message: 'BuildAI Hub API is operational',
    timestamp: new Date().toISOString(),
    endpoints: {
      tools: '/api/tools',
      categories: '/api/categories',
      auth: '/api/auth/login',
      admin: '/api/admin/stats',
      submissions: '/api/submissions',
    },
  });
});

// Root & /api interactive landing page for browser visits
app.get(['/', '/api'], (_req: Request, res: Response) => {
  res.send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>BuildAI Hub — Backend API Status</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
    body { background: #090D16; color: #f1f5f9; min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 24px; }
    .card { max-width: 680px; width: 100%; background: #0f172a; border: 1px solid #1e293b; border-radius: 24px; padding: 40px; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5); }
    .badge { display: inline-flex; align-items: center; gap: 8px; background: rgba(16, 185, 129, 0.15); color: #34d399; border: 1px solid rgba(16, 185, 129, 0.3); padding: 6px 14px; border-radius: 9999px; font-size: 13px; font-weight: 600; margin-bottom: 20px; }
    .pulse { width: 8px; height: 8px; background: #10b981; border-radius: 50%; box-shadow: 0 0 10px #10b981; animation: pulse 2s infinite; }
    @keyframes pulse { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.4; transform: scale(0.85); } }
    h1 { font-size: 28px; font-weight: 800; margin-bottom: 8px; background: linear-gradient(135deg, #fff 0%, #94a3b8 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
    p { color: #94a3b8; font-size: 14px; line-height: 1.6; margin-bottom: 24px; }
    .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 12px; margin-bottom: 24px; }
    .stat { background: #1e293b; padding: 14px 18px; border-radius: 12px; border: 1px solid #334155; }
    .stat-label { font-size: 11px; text-transform: uppercase; color: #64748b; font-weight: 700; letter-spacing: 0.5px; }
    .stat-val { font-size: 15px; font-weight: 600; color: #38bdf8; margin-top: 4px; }
    .actions { display: flex; flex-wrap: wrap; gap: 12px; margin-bottom: 24px; }
    .btn { display: inline-flex; align-items: center; gap: 8px; padding: 12px 20px; border-radius: 12px; font-size: 14px; font-weight: 600; text-decoration: none; transition: all 0.2s; }
    .btn-primary { background: linear-gradient(135deg, #6366f1 0%, #06b6d4 100%); color: white; box-shadow: 0 4px 14px rgba(6, 182, 212, 0.3); }
    .btn-primary:hover { opacity: 0.95; transform: translateY(-1px); }
    .btn-secondary { background: #1e293b; color: #cbd5e1; border: 1px solid #334155; }
    .btn-secondary:hover { background: #334155; color: white; }
    .accounts { background: #090d16; border: 1px solid #1e293b; border-radius: 16px; padding: 16px 20px; }
    .accounts h3 { font-size: 12px; text-transform: uppercase; color: #e2e8f0; margin-bottom: 8px; letter-spacing: 0.5px; }
    .acc-row { display: flex; justify-content: space-between; font-size: 12px; padding: 6px 0; border-bottom: 1px solid #1e293b; color: #cbd5e1; }
    .acc-row:last-child { border-bottom: none; }
    .acc-role { font-weight: 700; color: #38bdf8; }
    code { font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, monospace; color: #a5b4fc; }
  </style>
</head>
<body>
  <div class="card">
    <div class="badge"><div class="pulse"></div> Backend API Online &amp; Operational</div>
    <h1>BuildAI Hub API Server</h1>
    <p>The Node.js + Express API backend is actively running on port 5000 with MongoDB persistence. All directory endpoints, authentication tokens, reviews, and admin workflows are ready.</p>

    <div class="grid">
      <div class="stat"><div class="stat-label">Port</div><div class="stat-val">5000</div></div>
      <div class="stat"><div class="stat-label">Database</div><div class="stat-val">MongoDB (Connected)</div></div>
      <div class="stat"><div class="stat-label">Tools Seeded</div><div class="stat-val">16 Active Tools</div></div>
      <div class="stat"><div class="stat-label">Categories</div><div class="stat-val">8 Categories</div></div>
    </div>

    <div class="actions">
      <a href="http://localhost:3000" class="btn btn-primary" target="_blank">🚀 Open Web App (localhost:3000)</a>
      <a href="/api/health" class="btn btn-secondary" target="_blank">Health Check JSON</a>
      <a href="/api/tools" class="btn btn-secondary" target="_blank">View Tools JSON</a>
      <a href="/api/categories" class="btn btn-secondary" target="_blank">View Categories JSON</a>
    </div>

    <div class="accounts">
      <h3>Pre-Configured Test Accounts</h3>
      <div class="acc-row">
        <span><span class="acc-role">Admin:</span> <code>admin@buildaihub.io</code></span>
        <span>Pass: <code>admin1234</code></span>
      </div>
      <div class="acc-row">
        <span><span class="acc-role">Demo User:</span> <code>user@buildaihub.io</code></span>
        <span>Pass: <code>user1234</code></span>
      </div>
    </div>
  </div>
</body>
</html>`);
});

// Mount Routes
app.use('/api/auth', authRouter);
app.use('/api/tools', toolsRouter);
app.use('/api/categories', categoriesRouter);
app.use('/api/reviews', reviewsRouter);
app.use('/api/favorites', favoritesRouter);
app.use('/api/submissions', submissionsRouter);
app.use('/api/admin', adminRouter);
app.use('/api/analytics', analyticsRouter);

// Global Error Handler
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error('[Server Error]', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error occurred.',
  });
});

// Boot Server
async function startServer() {
  try {
    await connectDB();
    // Auto-seed if running fresh or in memory
    await seedDatabase(false);

    app.listen(PORT, () => {
      console.log(`=======================================================`);
      console.log(`🚀 BuildAI Hub Backend API Server running on port ${PORT}`);
      console.log(`   Health Check: http://localhost:${PORT}/api/health`);
      console.log(`   Admin Login:  admin@buildaihub.io / admin1234`);
      console.log(`   Demo User:    user@buildaihub.io / user1234`);
      console.log(`=======================================================`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

startServer();
