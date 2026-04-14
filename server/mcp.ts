/**
 * MCP Server for SlideForge — Streamable HTTP transport.
 * Mount on Express via /mcp endpoint.
 */

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import { z } from 'zod';
import type { Express, Request, Response } from 'express';
import type { RenderService } from './renderService';
import { randomUUID } from 'crypto';

export function mountMcp(app: Express, renderService: RenderService) {
  // Store active transports by session
  const transports = new Map<string, StreamableHTTPServerTransport>();

  function createServer(): McpServer {
    const mcp = new McpServer(
      { name: 'slide-forge', version: '1.0.0' },
      { capabilities: { tools: {} } },
    );

    // ── list_templates ─────────────────────────────────────────
    mcp.tool(
      'list_templates',
      'List all available graphic templates with their IDs, labels, and default formats',
      {},
      async () => {
        const templates = await renderService.getTemplates();
        return {
          content: [{ type: 'text', text: JSON.stringify(templates, null, 2) }],
        };
      },
    );

    // ── get_template_defaults ──────────────────────────────────
    mcp.tool(
      'get_template_defaults',
      'Get default data and format for a specific template',
      { template_id: z.string().describe('Template ID (e.g. "linkedin-post", "case-study")') },
      async ({ template_id }) => {
        const defaults = await renderService.getTemplateDefaults(template_id);
        if (!defaults) {
          return {
            content: [{ type: 'text', text: `Template "${template_id}" not found` }],
            isError: true,
          };
        }
        return {
          content: [{ type: 'text', text: JSON.stringify(defaults, null, 2) }],
        };
      },
    );

    // ── create_graphic ─────────────────────────────────────────
    mcp.tool(
      'create_graphic',
      'Create a graphic from a template. Returns base64-encoded PNG/JPG image.',
      {
        template: z.string().describe('Template ID (e.g. "linkedin-post", "case-study", "funnel")'),
        data: z.record(z.unknown()).optional().describe('Template data to override defaults'),
        format: z.string().optional().describe('Format ID (e.g. "1:1", "16:9", "9:16", "linkedin", "og")'),
        output: z.enum(['png', 'jpeg']).optional().describe('Image format (default: png)'),
      },
      async ({ template, data, format, output }) => {
        try {
          const result = await renderService.renderGraphic({
            template,
            data,
            format,
            output: output ?? 'png',
          });

          return {
            content: [
              {
                type: 'image',
                data: result.buffer.toString('base64'),
                mimeType: result.mimeType,
              },
              {
                type: 'text',
                text: `Rendered ${template} graphic (${result.width}x${result.height}, ${result.mimeType})`,
              },
            ],
          };
        } catch (err) {
          return {
            content: [{ type: 'text', text: `Render error: ${err}` }],
            isError: true,
          };
        }
      },
    );

    // ── list_formats ───────────────────────────────────────────
    mcp.tool(
      'list_formats',
      'List all available format presets with dimensions',
      {},
      async () => {
        const formats = await renderService.getFormats();
        return {
          content: [{ type: 'text', text: JSON.stringify(formats, null, 2) }],
        };
      },
    );

    // ── list_themes ────────────────────────────────────────────
    mcp.tool(
      'list_themes',
      'List all available themes with color palettes',
      {},
      async () => {
        const themes = await renderService.getThemes();
        return {
          content: [{ type: 'text', text: JSON.stringify(themes, null, 2) }],
        };
      },
    );

    return mcp;
  }

  // POST /mcp — main MCP endpoint (initialize + messages)
  app.post('/mcp', async (req: Request, res: Response) => {
    const sessionId = req.headers['mcp-session-id'] as string | undefined;

    if (sessionId && transports.has(sessionId)) {
      // Existing session
      const transport = transports.get(sessionId)!;
      await transport.handleRequest(req, res, req.body);
    } else {
      // New session
      const transport = new StreamableHTTPServerTransport({
        sessionIdGenerator: () => randomUUID(),
      });

      transport.onclose = () => {
        const sid = [...transports.entries()].find(([, t]) => t === transport)?.[0];
        if (sid) transports.delete(sid);
      };

      const server = createServer();
      await server.connect(transport);

      // Handle request will set the session ID in response headers
      await transport.handleRequest(req, res, req.body);

      // Store transport by session ID from response
      const newSessionId = res.getHeader('mcp-session-id') as string;
      if (newSessionId) {
        transports.set(newSessionId, transport);
      }
    }
  });

  // GET /mcp — SSE stream for server-to-client notifications
  app.get('/mcp', async (req: Request, res: Response) => {
    const sessionId = req.headers['mcp-session-id'] as string | undefined;
    if (!sessionId || !transports.has(sessionId)) {
      res.status(400).json({ error: 'Missing or invalid session ID' });
      return;
    }
    const transport = transports.get(sessionId)!;
    await transport.handleRequest(req, res);
  });

  // DELETE /mcp — close session
  app.delete('/mcp', async (req: Request, res: Response) => {
    const sessionId = req.headers['mcp-session-id'] as string | undefined;
    if (sessionId && transports.has(sessionId)) {
      const transport = transports.get(sessionId)!;
      await transport.handleRequest(req, res);
      transports.delete(sessionId);
    } else {
      res.status(404).json({ error: 'Session not found' });
    }
  });

  console.log('[MCP] Mounted at /mcp (Streamable HTTP transport)');
}
