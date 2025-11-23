const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

/**
 * Simple mock job data.
 * Replace or extend this with real data or an importer.
 */
const jobs = require('./jobs.json');

app.get('/api/counties', (req, res) => {
  const counties = Array.from(new Set(jobs.map(j => j.county))).sort();
  res.json(counties);
});

app.get('/api/jobs', (req, res) => {
  // Optional query params: q, county, page, perPage
  const q = (req.query.q || '').toLowerCase();
  const county = (req.query.county || '').toLowerCase();
  const page = parseInt(req.query.page || '1');
  const perPage = parseInt(req.query.perPage || '10');

  let filtered = jobs.filter(j => {
    if (county && j.county.toLowerCase() !== county) return false;
    if (q) {
      const hay = (j.title + ' ' + j.description + ' ' + j.company).toLowerCase();
      return hay.includes(q);
    }
    return true;
  });

  const start = (page - 1) * perPage;
  const pageSlice = filtered.slice(start, start + perPage);
  res.json(pageSlice);
});

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log("Backend running on port " + PORT));
