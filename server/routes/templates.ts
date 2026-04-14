import { Router } from 'express';
import type { RenderService } from '../renderService';

export function templateRoutes(renderService: RenderService) {
  const router = Router();

  // List all templates
  router.get('/templates', async (_req, res) => {
    try {
      const templates = await renderService.getTemplates();
      res.json({ templates });
    } catch (err) {
      res.status(500).json({ error: 'Failed to list templates', detail: String(err) });
    }
  });

  // Get single template with defaults
  router.get('/templates/:id', async (req, res) => {
    try {
      const defaults = await renderService.getTemplateDefaults(req.params.id);
      if (!defaults) {
        res.status(404).json({ error: `Template "${req.params.id}" not found` });
        return;
      }
      res.json({
        id: req.params.id,
        ...defaults,
      });
    } catch (err) {
      res.status(500).json({ error: 'Failed to get template', detail: String(err) });
    }
  });

  // List all formats
  router.get('/formats', async (_req, res) => {
    try {
      const formats = await renderService.getFormats();
      res.json({ formats });
    } catch (err) {
      res.status(500).json({ error: 'Failed to list formats', detail: String(err) });
    }
  });

  // List all themes
  router.get('/themes', async (_req, res) => {
    try {
      const themes = await renderService.getThemes();
      res.json({ themes });
    } catch (err) {
      res.status(500).json({ error: 'Failed to list themes', detail: String(err) });
    }
  });

  return router;
}
