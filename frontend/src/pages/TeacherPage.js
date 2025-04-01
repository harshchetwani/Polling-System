import React, { useState, useEffect } from 'react';
import { createPoll } from '../utils/api';
import socket from '../utils/socket';

const TeacherPage = () => {
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '']);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const username = 'Teacher';

  useEffect(() => {
    socket.on('receiveMessage', (message) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => socket.off('receiveMessage');
  }, []);

  const handleCreatePoll = async () => {
    try {
      const response = await createPoll({ question, options });
      alert('Poll Created!');
      socket.emit('createPoll', response.data);
    } catch (error) {
      console.error(error.message);
    }
  };

  const sendMessage = () => {
    if (newMessage.trim()) {
      socket.emit('sendMessage', { username, message: newMessage });
      setNewMessage('');
    }
  };

  return (
    <div>
      <h1>Teacher Dashboard</h1>
      <input value={question} onChange={(e) => setQuestion(e.target.value)} placeholder="Enter Question" />
      {options.map((opt, index) => (
        <input
          key={index}
          value={opt}
          onChange={(e) => {
            const newOptions = [...options];
            newOptions[index] = e.target.value;
            setOptions(newOptions);
          }}
          placeholder={`Option ${index + 1}`}
        />
      ))}
      <button onClick={() => setOptions([...options, ''])}>Add Option</button>
      <button onClick={handleCreatePoll}>Create Poll</button>

      <h2>Chat Room</h2>
      <div style={{ border: '1px solid #ccc', height: '300px', overflowY: 'auto' }}>
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

export default TeacherPage;