import type { Request, Response, NextFunction } from 'express';

const getApiKeys = (): Set<string> => {
  const raw = process.env.SLIDEFORGE_API_KEYS ?? '';
  return new Set(raw.split(',').map((k) => k.trim()).filter(Boolean));
};

export function apiKeyAuth(req: Request, res: Response, next: NextFunction) {
  const keys = getApiKeys();

  // No keys configured = auth disabled (dev mode)
  if (keys.size === 0) return next();

  const provided = req.header('X-API-Key') ?? req.query.api_key as string;
  if (!provided || !keys.has(provided)) {
    res.status(401).json({ error: 'Invalid or missing API key' });
    return;
  }

  next();
}
