import express from 'express';
import Chat from '../models/Chat.js';
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const chats = await Chat.find().sort({ timestamp: 1 });
    res.status(200).json(chats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
