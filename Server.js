const express = require('express');
const axios = require('axios');
const NodeCache = require('node-cache');
const app = express();
const cache = new NodeCache({ stdTTL: 300 }); // 5 min
const PORT = process.env.PORT || 4000;

app.use(express.json());

app.get('/api/alpha', async (req, res) => {
  const { symbol, functionType = 'TIME_SERIES_DAILY_ADJUSTED', outputsize = 'compact' } = req.query;
  const key = process.env.REACT_APP_ALPHA_VANTAGE_KEY;
  if (!key) return res.status(400).json({ error: 'AlphaVantage key manquante' });
  const cacheKey = `alpha:${symbol}:${functionType}:${outputsize}`;
  const cached = cache.get(cacheKey);
  if (cached) return res.json(cached);
  try {
    const url = `https://www.alphavantage.co/query?function=${functionType}&symbol=${encodeURIComponent(symbol)}&outputsize=${outputsize}&apikey=${key}`;
    const r = await axios.get(url, { timeout: 15000 });
    cache.set(cacheKey, r.data);
    res.json(r.data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => console.log(`Proxy server running on http://localhost:${PORT}`));
