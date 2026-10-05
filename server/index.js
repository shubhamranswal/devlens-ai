import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { analyzeRouter } from './routes/analyze.js';
import { aiRouter } from './routes/ai.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// API Routes
app.use('/api', analyzeRouter);
app.use('/api/ai', aiRouter);

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'DevLens AI Analyzer',
    version: '1.0.0-mvp',
    timestamp: new Date().toISOString()
  });
});

// Serve static frontend files in production if dist exists
const distPath = path.join(__dirname, '../dist');
app.use(express.static(distPath));

app.use((req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`[DevLens AI] Server running on http://localhost:${PORT}`);
});
