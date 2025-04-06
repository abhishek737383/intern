import express from 'express';
import chatEngine from '../utils/chatEngine.js';

const router = express.Router();

// POST endpoint: /api/chatbot/ask
router.post('/ask', async (req, res) => {
  try {
    const { question } = req.body;
    if (!question || typeof question !== 'string') {
      return res.status(400).json({ error: 'Invalid question format' });
    }

    const response = await chatEngine.processQuestion(question);
    res.json({ response });
  } catch (error) {
    console.error('Chat route error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
