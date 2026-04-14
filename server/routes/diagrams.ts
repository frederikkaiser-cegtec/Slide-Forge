import { Router } from 'express';
import { diagramTemplates } from '../../src/templates/diagrams';
import { getTheme } from '../../src/themes';
import { generateDiagramHTML } from '../../src/export/htmlExporter';
import { autoLayoutDiagram } from '../../src/utils/diagramLayout';
import { generateId } from '../../src/utils/id';
import type { Diagram } from '../../src/types/diagram';

export function diagramRoutes() {
  const router = Router();

  // List diagram templates
  router.get('/diagrams/templates', (_req, res) => {
    res.json({
      templates: diagramTemplates.map((t) => ({
        id: t.id,
        name: t.name,
        description: t.description,
        diagramType: t.diagramType,
      })),
    });
  });

  // Create diagram (HTML/SVG export — no browser needed)
  router.post('/diagrams', (req, res) => {
    try {
      const { template: templateId, title, theme: themeId, nodes, edges, autoLayout, minify, embed } = req.body;

      let diagram: Diagram;

      if (templateId) {
        const tpl = diagramTemplates.find((t) => t.id === templateId);
        if (!tpl) {
          res.status(404).json({ error: `Diagram template "${templateId}" not found` });
          return;
        }
        const theme = getTheme(themeId ?? 'cegtec');
        const data = tpl.create(theme.colors);
        diagram = {
          ...data,
          id: generateId(),
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };
        if (title) diagram.title = title;
      } else if (nodes && edges) {
        diagram = {
          id: generateId(),
          title: title ?? 'Diagram',
          diagramType: 'flowchart',
          nodes,
          edges,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };
      } else {
        res.status(400).json({ error: 'Provide either "template" or "nodes" + "edges"' });
        return;
      }

      if (autoLayout !== false) {
        const laid = autoLayoutDiagram(diagram.nodes, diagram.edges, diagram.diagramType);
        diagram.nodes = laid.nodes;
        diagram.edges = laid.edges;
      }

      const html = generateDiagramHTML(diagram, {
        minify: !!minify,
        standalone: !embed,
      });

      // Return as HTML or JSON
      if (req.query.response === 'json') {
        res.json({
          html,
          nodeCount: diagram.nodes.length,
          edgeCount: diagram.edges.length,
        });
        return;
      }

      res.set('Content-Type', 'text/html');
      res.send(html);
    } catch (err) {
      console.error('[diagrams] Error:', err);
      res.status(500).json({ error: 'Failed to create diagram', detail: String(err) });
    }
  });

  return router;
}
