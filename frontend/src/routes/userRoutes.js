// routes/userRoutes.js
import express from 'express';
import User from '../models/User.js';
import { generateToken } from '../utils/auth.js';
import bcrypt from 'bcryptjs';
import { protect, teacherOnly } from '../middleware/auth.js';

const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  const { name, email, password, role } = req.body;
  const user = await User.create({ name, email, password, role });
  const token = generateToken(user._id, user.role);
  res.json({ token, user });
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

  const token = generateToken(user._id, user.role);
  res.json({ token, user });
});

// Protected Example (Teacher Only)
router.get('/teacher-data', protect, teacherOnly, (req, res) => {
  res.json({ message: 'Welcome, Teacher!' });
});

export default router;
