import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { apiRouter } from './server/routes';

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use((req, res, next) => {
    if (req.body !== undefined && req.body !== null) {
      if (typeof req.body === 'string') {
        try {
          req.body = JSON.parse(req.body);
        } catch (_) {}
      }
      (req as any)._body = true;
      return next();
    }
    express.json({ limit: '10mb' })(req, res, next);
  });
  app.use(express.urlencoded({ extended: true }));

  // Mount API router
  app.use('/api', apiRouter);

  // Vite middleware setup
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[ECONOS Engine] Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('[ECONOS Engine] Failed to start server:', err);
  process.exit(1);
});
