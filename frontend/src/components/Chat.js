import React, { useState, useEffect } from 'react';
import socket from '../utils/socket';
import { getChatHistory } from '../utils/api';

const Chat = ({ username }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  // Fetch chat history
  useEffect(() => {
    const fetchMessages = async () => {
      const response = await getChatHistory();
      setMessages(response.data);
    };
    fetchMessages();

    // Listen for real-time messages
    socket.on('receiveMessage', (message) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => socket.off('receiveMessage');
  }, []);

  const sendMessage = () => {
    if (newMessage.trim()) {
      socket.emit('sendMessage', { username, message: newMessage });
      setNewMessage('');
    }
  };

  return (
    <div>
      <h2>Chat Room</h2>
      <div style={{ border: '1px solid #ccc', height: '300px', overflowY: 'auto', marginBottom: '10px' }}>
        {messages.map((msg, index) => (
          <p key={index}><strong>{msg.username}:</strong> {msg.message}</p>
        ))}
      </div>
      <input
        type="text"
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        placeholder="Type your message..."
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
};

export default Chat;
