import { io } from 'socket.io-client';

const socket = io('http://localhost:5000'); // Ensure backend is running on port 5000
socket.on('connect', () => console.log('Connected to socket server'));

export default socket;
