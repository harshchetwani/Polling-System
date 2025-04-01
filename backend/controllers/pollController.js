// controllers/pollController.js
import Poll from '../models/poll.js'; // Ensure you import the Poll model

// Create a new poll
const createPoll = async (req, res) => {
  const { question, options } = req.body;

  if (!question || !options || options.length < 2) {
    return res.status(400).json({ message: 'Question and at least two options are required' });
  }

  try {
    const poll = new Poll({
      question,
      options: options.map(option => ({ text: option, votes: 0 }))
    });
    await poll.save();

    // Emit poll to all connected clients
    global.io.emit('newPoll', poll);

    res.status(201).json({ message: 'Poll created successfully', poll });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// Submit an answer
const submitAnswer = async (req, res) => {
  const { pollId, optionId } = req.body;

  try {
    const poll = await Poll.findById(pollId);

    if (!poll) {
      return res.status(404).json({ message: 'Poll not found' });
    }

    const selectedOption = poll.options.id(optionId); // Using Mongoose's subdocument finder

    if (!selectedOption) {
      return res.status(400).json({ message: 'Invalid option selected' });
    }

    selectedOption.votes += 1;
    await poll.save();

    global.io.emit('pollUpdate', poll);
    res.status(200).json({ message: 'Answer submitted successfully', poll });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// Get all polls
const getAllPolls = async (req, res) => {
  try {
    const polls = await Poll.find();
    res.status(200).json(polls);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// Get poll results
const getPollResults = async (req, res) => {
  const { pollId } = req.params;

  try {
    const poll = await Poll.findById(pollId);
    if (!poll) {
      return res.status(404).json({ message: 'Poll not found' });
    }

    res.status(200).json(poll);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

export { createPoll, submitAnswer, getAllPolls, getPollResults };
