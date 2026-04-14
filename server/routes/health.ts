import { Router } from 'express';
import type { RenderService } from '../renderService';

export function healthRoutes(renderService: RenderService) {
  const router = Router();

  router.get('/health', (_req, res) => {
    res.json({
      status: 'ok',
      chromium: renderService.isReady() ? 'ready' : 'not_initialized',
      uptime: process.uptime(),
    });
  });

  return router;
}
