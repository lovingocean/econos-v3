import express from 'express';
import dotenv from 'dotenv';
import { apiRouter } from './routes';

dotenv.config();

const app = express();

// Top-level CORS & Security Headers for Vercel Serverless
app.use((req, res, next) => {
  const origin = req.headers.origin as string;
  res.setHeader('Access-Control-Allow-Origin', origin || '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-organization-id, x-user-id, stripe-signature, x-webhook-signature');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  next();
});

// Safe Body Parser for Serverless: If req.body has already been parsed by Vercel's runtime helper, mark _body to avoid double stream consumption and BadRequestError
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

// Path normalizer for Vercel Serverless Function rewrites
app.use((req, res, next) => {
  try {
    let targetUrl = req.url || '/';

    // 1. Check if rewrite forwarded path in query parameter ?path=...
    const qIndex = targetUrl.indexOf('?');
    if (qIndex !== -1) {
      const search = targetUrl.slice(qIndex + 1);
      const params = new URLSearchParams(search);
      const pathParam = params.get('path');
      if (pathParam) {
        params.delete('path');
        const remainingQuery = params.toString();
        const cleanPath = pathParam.startsWith('/') ? pathParam : `/${pathParam}`;
        targetUrl = remainingQuery ? `${cleanPath}?${remainingQuery}` : cleanPath;
      }
    }

    // 2. Check if x-matched-path is provided without index.js rewrite artifacts
    const matchedPath = req.headers['x-matched-path'] as string;
    if (matchedPath && !matchedPath.includes('index.js')) {
      targetUrl = matchedPath;
    }

    // 3. Strip leading /api/index.js or /index.js prefix
    targetUrl = targetUrl.replace(/^\/api\/index\.js/, '').replace(/^\/index\.js/, '');
    
    // Ensure standard leading slash
    if (!targetUrl.startsWith('/')) {
      targetUrl = `/${targetUrl}`;
    }

    req.url = targetUrl;
  } catch (err) {
    console.warn('URL normalization notice in serverless handler:', err);
  }
  next();
});

// In Vercel serverless functions, requests to /api/* are dispatched here.
// Mounting on both /api and root ensures both path patterns resolve accurately.
app.use('/api', apiRouter);
app.use('/', apiRouter);

// Catch-all 404 Handler
app.use((req, res) => {
  if (!res.headersSent) {
    res.status(404).json({
      error: 'Not Found',
      message: `Cannot ${req.method} ${req.url}`,
      timestamp: new Date().toISOString()
    });
  }
});

// Global Serverless Error Handler
app.use((err: any, req: any, res: any, next: any) => {
  console.error('Unhandled serverless execution error:', err);
  if (!res.headersSent) {
    res.status(500).json({
      error: 'Internal Server Error',
      message: err?.message || 'Unknown serverless execution error',
      timestamp: new Date().toISOString()
    });
  }
});

// Global process protections for Serverless runtime stability
process.on('unhandledRejection', (reason, promise) => {
  console.warn('Unhandled Rejection in Serverless Runtime:', reason);
});

process.on('uncaughtException', (err) => {
  console.warn('Uncaught Exception in Serverless Runtime:', err);
});

// Export both standard Express app and explicit (req, res) handler function for Vercel
export { app };
export default function handler(req: any, res: any) {
  try {
    return app(req, res);
  } catch (err: any) {
    console.error('Fatal synchronous invocation error in serverless handler:', err);
    if (!res.headersSent) {
      res.status(500).json({
        error: 'Internal Server Error',
        message: err?.message || 'Serverless invocation error',
        timestamp: new Date().toISOString()
      });
    }
  }
}

