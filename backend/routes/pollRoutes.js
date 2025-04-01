// routes/pollRoutes.js
import express from 'express';
import { createPoll, submitAnswer, getAllPolls, getPollResults } from '../backend/controllers/pollController.js';

const router = express.Router();

// Poll routes
router.post('/', createPoll);
router.post('/submit', submitAnswer);
router.get('/', getAllPolls);
router.get('/:pollId/results', getPollResults);

export default router;
