/**
 * Vercel Serverless Function — API Proxy
 * 
 * Semua request /api/* di-forward ke BACKEND_URL.
 * BACKEND_URL hanya ada di Vercel Environment Variables (server-side).
 * Tidak pernah expose ke browser atau repo GitHub.
 */

// Fix 1: Pin function ke region Singapore (dekat Indonesia)
export const config = {
  regions: ['sin1'],
};

export default async function handler(req, res) {
  const backendUrl = process.env.BACKEND_URL;

  if (!backendUrl) {
    return res.status(500).json({ status: 'error', message: 'Backend not configured' });
  }

  // Rebuild path: /api/videos?page=1 → https://backend.com/api/videos?page=1
  const path = req.url; // includes /api/... and query string
  const targetUrl = `${backendUrl.replace(/\/$/, '')}${path}`;

  try {
    const response = await fetch(targetUrl, {
      method: req.method,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        // Fix 2: Forward headers dari client ke backend
        'X-Forwarded-For': req.headers['x-forwarded-for'] || req.socket?.remoteAddress || '',
        'User-Agent': req.headers['user-agent'] || 'HentaiBros-Proxy/1.0',
      },
    });

    const data = await response.json();

    // Fix 3: Set cache headers agar Vercel edge cache response
    res.setHeader('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=300');
    res.status(response.status).json(data);
  } catch (err) {
    res.status(502).json({ status: 'error', message: 'Backend unreachable' });
  }
}
