const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const BACKEND_URL = process.env.BACKEND_URL;

// Security headers
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  next();
});

// API proxy
app.use('/api', async (req, res) => {
  if (!BACKEND_URL) {
    return res.status(500).json({ status: 'error', message: 'Backend not configured' });
  }

  const targetUrl = `${BACKEND_URL.replace(/\/$/, '')}/api${req.url}`;

  try {
    const response = await fetch(targetUrl, {
      method: req.method,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-Forwarded-For': req.headers['x-forwarded-for'] || req.socket?.remoteAddress || '',
        'User-Agent': req.headers['user-agent'] || 'HentaiBros-Proxy/1.0',
      },
    });

    const data = await response.json();

    if (response.ok) {
      res.setHeader('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=300');
    } else {
      res.setHeader('Cache-Control', 'no-store');
    }

    res.status(response.status).json(data);
  } catch (err) {
    res.status(502).json({ status: 'error', message: 'Backend unreachable' });
  }
});

// Static files with cache
app.use('/static', express.static(path.join(__dirname, 'build/static'), {
  maxAge: '1y',
  immutable: true,
}));

app.get('/sw.js', (req, res) => {
  res.setHeader('Cache-Control', 'public, max-age=0, must-revalidate');
  res.setHeader('Service-Worker-Allowed', '/');
  res.sendFile(path.join(__dirname, 'build/sw.js'));
});

// SPA fallback
app.use(express.static(path.join(__dirname, 'build')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build/index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
