// routes/userRoutes.js
const express = require('express');
const { registerUser, getAllUsers, deleteUser, getUserById } = require('../controllers/userController');

const router = express.Router();

// User routes
router.post('/register', registerUser);
router.get('/', getAllUsers);
router.get('/:userId', getUserById);
router.delete('/:userId', deleteUser);

module.exports = router;
