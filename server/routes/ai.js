import express from 'express';
import { aiProvider } from '../ai/provider.js';

export const aiRouter = express.Router();

aiRouter.post('/summary', async (req, res) => {
  try {
    const { analysis } = req.body;
    if (!analysis) {
      return res.status(400).json({ error: 'Analysis data is required for summary generation.' });
    }

    const summary = await aiProvider.generateArchitectureSummary(analysis);
    return res.json(summary);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

aiRouter.post('/ask', async (req, res) => {
  try {
    const { question, analysis } = req.body;
    if (!question || !analysis) {
      return res.status(400).json({ error: 'Both question and analysis context are required.' });
    }

    const answer = await aiProvider.answerQuestion(question, analysis);
    return res.json(answer);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});
