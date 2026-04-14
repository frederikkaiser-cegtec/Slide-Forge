import { chromium, type Browser, type Page } from 'playwright';
import { createServer as createViteServer, type ViteDevServer } from 'vite';
import path from 'path';

export interface RenderResult {
  buffer: Buffer;
  mimeType: string;
  width: number;
  height: number;
}

export class RenderService {
  private browser: Browser | null = null;
  private page: Page | null = null;
  private viteServer: ViteDevServer | null = null;
  private vitePort: number = 0;
  private initPromise: Promise<void> | null = null;
  private projectDir: string;

  constructor(projectDir: string) {
    this.projectDir = projectDir;
  }

  isReady(): boolean {
    return this.browser !== null && this.page !== null;
  }

  private async init() {
    const isProd = process.env.NODE_ENV === 'production';

    if (!isProd) {
      console.log('[RenderService] Starting Vite dev server...');
      this.viteServer = await createViteServer({
        root: this.projectDir,
        server: { port: 0, strictPort: false },
        logLevel: 'warn',
      });
      await this.viteServer.listen();

      const address = this.viteServer.httpServer?.address();
      if (address && typeof address === 'object') {
        this.vitePort = address.port;
      }
      console.log(`[RenderService] Vite running on port ${this.vitePort}`);
    } else {
      // In production, Express serves the static build
      this.vitePort = parseInt(process.env.PORT ?? '3000', 10);
    }

    console.log('[RenderService] Launching Chromium...');
    const execPath = process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH;
    this.browser = await chromium.launch({
      headless: true,
      ...(execPath ? { executablePath: execPath } : {}),
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
    });

    this.page = await this.browser.newPage();
    await this.page.setViewportSize({ width: 1920, height: 1920 });

    const url = `http://localhost:${this.vitePort}/Slide-Forge/?mcp=1`;
    console.log(`[RenderService] Navigating to ${url}`);
    await this.page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });

    // Wait for bridge to be ready
    await this.page.waitForFunction(
      () => window.__SF_BRIDGE__?.isReady(),
      { timeout: 15000 },
    );
    console.log('[RenderService] Bridge ready');
  }

  async ensureReady(): Promise<void> {
    if (this.isReady()) return;
    if (!this.initPromise) {
      this.initPromise = this.init();
    }
    await this.initPromise;
  }

  async renderGraphic(options: {
    template: string;
    data?: Record<string, unknown>;
    format?: string;
    output?: 'png' | 'jpeg';
  }): Promise<RenderResult> {
    await this.ensureReady();
    const page = this.page!;

    const { template, data, format, output = 'png' } = options;

    // Set graphic type
    await page.evaluate((type) => window.__SF_BRIDGE__.setGraphicType(type), template);
    await page.waitForTimeout(100);

    // Set format if specified
    if (format) {
      await page.evaluate((fid) => window.__SF_BRIDGE__.setFormat(fid), format);
      await page.waitForTimeout(100);
    }

    // Set data (merge with defaults)
    if (data) {
      await page.evaluate(
        ({ type, userData }) => {
          const defaults = window.__SF_BRIDGE__.getTemplateDefaults(type);
          const merged = { ...(defaults?.data as object), ...userData };
          window.__SF_BRIDGE__.setGraphicData(type, merged);
        },
        { type: template, userData: data },
      );
    } else {
      // Use defaults
      await page.evaluate((type) => {
        const defaults = window.__SF_BRIDGE__.getTemplateDefaults(type);
        if (defaults) window.__SF_BRIDGE__.setGraphicData(type, defaults.data);
      }, template);
    }

    // Wait for render
    await page.waitForTimeout(500);

    // Get dimensions from the element
    const dims = await page.evaluate(() => {
      const el = window.__SF_BRIDGE__.getGraphicElement();
      if (!el) return { width: 1200, height: 630 };
      return { width: el.offsetWidth, height: el.offsetHeight };
    });

    // Reset transform for clean screenshot
    await page.evaluate(() => {
      const el = document.getElementById('sf-graphic-root');
      if (el) el.style.transform = 'none';
    });
    await page.waitForTimeout(100);

    // Screenshot the graphic element
    const el = await page.$('#sf-graphic-root');
    if (!el) throw new Error('Graphic element not found');

    const buffer = await el.screenshot({
      type: output === 'jpeg' ? 'jpeg' : 'png',
      ...(output === 'jpeg' ? { quality: 92 } : {}),
    });

    return {
      buffer: Buffer.from(buffer),
      mimeType: output === 'jpeg' ? 'image/jpeg' : 'image/png',
      width: dims.width,
      height: dims.height,
    };
  }

  async getTemplates(): Promise<{ id: string; label: string; defaultFormat: string; defaultData: unknown }[]> {
    await this.ensureReady();
    return this.page!.evaluate(() => window.__SF_BRIDGE__.getAvailableTypes());
  }

  async getFormats(): Promise<{ id: string; label: string; width: number; height: number }[]> {
    await this.ensureReady();
    return this.page!.evaluate(() => window.__SF_BRIDGE__.getFormats());
  }

  async getThemes() {
    await this.ensureReady();
    return this.page!.evaluate(() => window.__SF_BRIDGE__.getThemes());
  }

  async getTemplateDefaults(templateId: string) {
    await this.ensureReady();
    return this.page!.evaluate((id) => window.__SF_BRIDGE__.getTemplateDefaults(id), templateId);
  }

  async shutdown() {
    console.log('[RenderService] Shutting down...');
    if (this.page) await this.page.close().catch(() => {});
    if (this.browser) await this.browser.close().catch(() => {});
    if (this.viteServer) await this.viteServer.close().catch(() => {});
    this.page = null;
    this.browser = null;
    this.viteServer = null;
    this.initPromise = null;
  }
}
