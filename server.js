// server.js
import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import mongoose from 'mongoose';
import cors from 'cors';
import chatRoutes from './routes/chatRoutes.js'; // Assuming chat routes exist
import pollRoutes from './routes/pollRoutes.js'; // Import the new poll routes

const app = express();
const server = http.createServer(app);

// Socket.io configuration
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000', // Frontend URL
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'], // Ensure headers are allowed
  },
});

// Middleware for CORS and JSON parsing
app.use(cors()); // CORS middleware should be applied first
app.use(express.json()); // Middleware for parsing JSON requests

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/pollingDB', {})
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Attach io to global so it can be accessed in controller
global.io = io; 

// Poll routes (for creating, submitting answers, getting polls)
app.use('/api/polls', pollRoutes);

// Socket.IO Events for Chat
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('sendMessage', async (data) => {
    const { username, message } = data;

    // Save message to database
    //const chatMessage = new Chat({ username, message });
    await chatMessage.save();

    // Broadcast message to all clients
    io.emit('receiveMessage', chatMessage);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Chat routes (make sure chatRoutes and Chat model exist)
app.use('/api/chat', chatRoutes);

// Start the server
server.listen(5000, () => {
  console.log('Server running on http://localhost:5000');
});

export { io };
