/**
 * Vercel Serverless Function — API Proxy
 * 
 * Semua request /api/* di-forward ke BACKEND_URL.
 * BACKEND_URL hanya ada di Vercel Environment Variables (server-side).
 * Tidak pernah expose ke browser atau repo GitHub.
 */

export default async function handler(req, res) {
  const backendUrl = process.env.BACKEND_URL;

  if (!backendUrl) {
    return res.status(500).json({ status: 'error', message: 'Backend not configured' });
  }

  // Rebuild path: /api/videos?page=1 → https://backend.com/api/videos?page=1
  const path = req.url; // includes /api/... and query string
  const targetUrl = `${backendUrl.replace(/\/$/, '')}${path}`;

  try {
    // api/[...path].js — improved header forwarding
const response = await fetch(targetUrl, {
  method: req.method,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-Forwarded-For': req.headers['x-forwarded-for'] || req.socket.remoteAddress,
    'User-Agent': req.headers['user-agent'] || 'HentaiBros-Proxy/1.0',
     },
    });

    const data = await response.json();
    res.status(response.status).json(data);
  } catch (err) {
    res.status(502).json({ status: 'error', message: 'Backend unreachable' });
  }
}
