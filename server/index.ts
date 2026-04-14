import express from 'express';
import path from 'path';
import { RenderService } from './renderService';
import { apiKeyAuth } from './auth';
import { healthRoutes } from './routes/health';
import { templateRoutes } from './routes/templates';
import { graphicRoutes } from './routes/graphics';
import { diagramRoutes } from './routes/diagrams';
import { mountMcp } from './mcp';

const PORT = parseInt(process.env.PORT ?? '3000', 10);
const PROJECT_DIR = path.resolve(import.meta.dirname, '..');

const app = express();
const renderService = new RenderService(PROJECT_DIR);

// Middleware
app.use(express.json({ limit: '10mb' }));

// CORS for API access
app.use('/api', (_req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, X-API-Key');
  if (_req.method === 'OPTIONS') { res.sendStatus(204); return; }
  next();
});

// API routes (auth required)
app.use('/api/v1', apiKeyAuth, healthRoutes(renderService));
app.use('/api/v1', apiKeyAuth, templateRoutes(renderService));
app.use('/api/v1', apiKeyAuth, graphicRoutes(renderService));
app.use('/api/v1', apiKeyAuth, diagramRoutes());

// MCP Server (Streamable HTTP)
mountMcp(app, renderService);

// Serve SPA static files in production
if (process.env.NODE_ENV === 'production') {
  const distDir = path.join(PROJECT_DIR, 'dist');
  app.use('/Slide-Forge', express.static(distDir));
  // SPA fallback
  app.get('/Slide-Forge/*', (_req, res) => {
    res.sendFile(path.join(distDir, 'index.html'));
  });
  // Redirect root to SPA
  app.get('/', (_req, res) => res.redirect('/Slide-Forge/'));
}

// Start server
app.listen(PORT, () => {
  console.log(`[SlideForge Server] Running on http://localhost:${PORT}`);
  console.log(`[SlideForge Server] API:  http://localhost:${PORT}/api/v1/health`);
  console.log(`[SlideForge Server] Web:  http://localhost:${PORT}/Slide-Forge/`);

  if (process.env.SLIDEFORGE_API_KEYS) {
    const count = process.env.SLIDEFORGE_API_KEYS.split(',').filter(Boolean).length;
    console.log(`[SlideForge Server] Auth: ${count} API key(s) configured`);
  } else {
    console.log('[SlideForge Server] Auth: DISABLED (no SLIDEFORGE_API_KEYS set)');
  }
});

// Graceful shutdown
for (const sig of ['SIGTERM', 'SIGINT'] as const) {
  process.on(sig, async () => {
    console.log(`\n[SlideForge Server] ${sig} received, shutting down...`);
    await renderService.shutdown();
    process.exit(0);
  });
}

export { app, renderService };
