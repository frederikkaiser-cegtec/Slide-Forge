import { Router } from 'express';
import type { RenderService } from '../renderService';

export function graphicRoutes(renderService: RenderService) {
  const router = Router();

  router.post('/graphics', async (req, res) => {
    try {
      const { template, data, format, output } = req.body;

      if (!template || typeof template !== 'string') {
        res.status(400).json({ error: 'Missing required field: template (string)' });
        return;
      }

      const imageType = output === 'jpeg' || output === 'jpg' ? 'jpeg' : 'png';

      const result = await renderService.renderGraphic({
        template,
        data,
        format,
        output: imageType,
      });

      // Return as JSON with base64 if requested
      if (req.query.response === 'json') {
        res.json({
          base64: result.buffer.toString('base64'),
          mimeType: result.mimeType,
          width: result.width,
          height: result.height,
        });
        return;
      }

      // Return as image
      res.set('Content-Type', result.mimeType);
      res.set('Content-Length', String(result.buffer.length));
      res.set('X-Image-Width', String(result.width));
      res.set('X-Image-Height', String(result.height));
      res.send(result.buffer);
    } catch (err) {
      console.error('[graphics] Render error:', err);
      res.status(500).json({ error: 'Failed to render graphic', detail: String(err) });
    }
  });

  return router;
}
