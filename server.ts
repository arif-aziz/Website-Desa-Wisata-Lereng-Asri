import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';
import express from 'express';
import type { Request, Response, NextFunction } from 'express';
import { DEFAULT_SITE_DATA } from './src/data/defaultSiteData.ts';
import type { SiteData } from './src/types/tourism.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = Number(process.env.PORT || 3000);
const DATA_DIR = path.resolve(__dirname, 'data');
const DATA_FILE = path.join(DATA_DIR, 'site-data.json');

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'lerengasri2026';
const SESSION_SECRET =
  process.env.ADMIN_SESSION_SECRET ||
  crypto.createHash('sha256').update(`lereng-asri-secret-${ADMIN_PASSWORD}`).digest('hex');

const PASSWORD_SALT = 'lereng-asri-static-salt-v1';
const STORED_PASSWORD_HASH = crypto.scryptSync(ADMIN_PASSWORD, PASSWORD_SALT, 64);

function verifyPassword(input: string): boolean {
  const candidate = crypto.scryptSync(input, PASSWORD_SALT, 64);
  if (candidate.length !== STORED_PASSWORD_HASH.length) {
    return false;
  }
  return crypto.timingSafeEqual(candidate, STORED_PASSWORD_HASH);
}

function createAdminToken(): string {
  const payload = Buffer.from(
    JSON.stringify({
      role: 'admin',
      exp: Date.now() + 24 * 60 * 60 * 1000,
    })
  ).toString('base64url');
  const signature = crypto
    .createHmac('sha256', SESSION_SECRET)
    .update(payload)
    .digest('base64url');
  return `${payload}.${signature}`;
}

function verifyAdminToken(token: string): boolean {
  const parts = token.split('.');
  if (parts.length !== 2) return false;
  const [payload, sig] = parts;
  if (!payload || !sig) return false;
  const expectedSig = crypto
    .createHmac('sha256', SESSION_SECRET)
    .update(payload)
    .digest('base64url');
  const sigBuf = Buffer.from(sig);
  const expectedBuf = Buffer.from(expectedSig);
  if (sigBuf.length !== expectedBuf.length) return false;
  if (!crypto.timingSafeEqual(sigBuf, expectedBuf)) return false;
  try {
    const decoded = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8')) as {
      role?: string;
      exp?: number;
    };
    return decoded.role === 'admin' && typeof decoded.exp === 'number' && decoded.exp > Date.now();
  } catch {
    return false;
  }
}

async function readSiteData(): Promise<SiteData> {
  try {
    const raw = await fs.readFile(DATA_FILE, 'utf8');
    const parsed = JSON.parse(raw) as SiteData;
    if (parsed && parsed.profile && Array.isArray(parsed.destinations) && Array.isArray(parsed.packages)) {
      return parsed;
    }
  } catch {
    // Initialize file on first read if absent
  }
  await writeSiteData(DEFAULT_SITE_DATA);
  return DEFAULT_SITE_DATA;
}

async function writeSiteData(data: SiteData): Promise<SiteData> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  const stamped: SiteData = {
    ...data,
    updatedAt: new Date().toISOString(),
  };
  await fs.writeFile(DATA_FILE, JSON.stringify(stamped, null, 2), 'utf8');
  return stamped;
}

function requireAdminAuth(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : '';
  if (!token || !verifyAdminToken(token)) {
    res.status(401).json({ error: 'Sesi pengelola tidak valid atau sudah berakhir.' });
    return;
  }
  next();
}

async function startServer(): Promise<void> {
  const app = express();
  app.use(express.json({ limit: '2mb' }));

  app.get('/api/health', (_req: Request, res: Response) => {
    res.json({ ok: true });
  });

  app.get('/api/site-data', async (_req: Request, res: Response) => {
    try {
      const data = await readSiteData();
      res.json(data);
    } catch {
      res.status(500).json({ error: 'Gagal memuat data desa wisata.' });
    }
  });

  app.post('/api/admin/login', (req: Request, res: Response) => {
    const password = typeof req.body?.password === 'string' ? req.body.password : '';
    if (!password) {
      res.status(400).json({ error: 'Kata sandi wajib diisi.' });
      return;
    }
    if (!verifyPassword(password)) {
      res.status(401).json({ error: 'Kata sandi pengelola tidak sesuai.' });
      return;
    }
    res.json({ token: createAdminToken() });
  });

  app.get('/api/admin/verify', requireAdminAuth, (_req: Request, res: Response) => {
    res.json({ authenticated: true });
  });

  app.put('/api/admin/site-data', requireAdminAuth, async (req: Request, res: Response) => {
    const payload = req.body as Partial<SiteData>;
    if (
      !payload ||
      !payload.profile ||
      !Array.isArray(payload.destinations) ||
      !Array.isArray(payload.packages) ||
      !Array.isArray(payload.gallery) ||
      !Array.isArray(payload.faqs)
    ) {
      res.status(400).json({ error: 'Format data konten tidak lengkap.' });
      return;
    }
    try {
      const saved = await writeSiteData(payload as SiteData);
      res.json(saved);
    } catch {
      res.status(500).json({ error: 'Gagal menyimpan perubahan konten.' });
    }
  });

  app.post('/api/admin/reset', requireAdminAuth, async (_req: Request, res: Response) => {
    try {
      const reset = await writeSiteData(DEFAULT_SITE_DATA);
      res.json(reset);
    } catch {
      res.status(500).json({ error: 'Gagal mereset data konten.' });
    }
  });

  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distDir = path.resolve(__dirname, 'dist');
    app.use(express.static(distDir));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distDir, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server Desa Wisata Lereng Asri aktif di http://localhost:${PORT}`);
  });
}

startServer();
