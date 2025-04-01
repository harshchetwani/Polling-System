import React, { useState, useEffect } from 'react';
import { getPolls, submitAnswer } from '../utils/api';
import socket from '../utils/socket';

const StudentPage = () => {
  const [polls, setPolls] = useState([]);
  const [selectedPoll, setSelectedPoll] = useState(null);
  const [selectedOption, setSelectedOption] = useState('');
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [username, setUsername] = useState(localStorage.getItem('username') || '');

  useEffect(() => {
    if (!username) {
      const inputName = prompt('Enter your name:');
      localStorage.setItem('username', inputName);
      setUsername(inputName);
    }

    const fetchPolls = async () => {
      const response = await getPolls();
      setPolls(response.data);
    };
    fetchPolls();

    socket.on('newPoll', (poll) => {
      setPolls((prev) => [...prev, poll]);
    });

    socket.on('receiveMessage', (message) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      socket.off('newPoll');
      socket.off('receiveMessage');
    };
  }, [username]);

  const handleSubmit = async () => {
    if (!selectedPoll || !selectedOption) return alert('Please select a poll and an option');
    await submitAnswer({ pollId: selectedPoll._id, option: selectedOption });
    alert('Answer submitted!');
  };

  const sendMessage = () => {
    if (newMessage.trim()) {
      socket.emit('sendMessage', { username, message: newMessage });
      setNewMessage('');
    }
  };

  return (
    <div>
      <h1>Student Dashboard</h1>
      {polls.map((poll) => (
        <button key={poll._id} onClick={() => setSelectedPoll(poll)}>{poll.question}</button>
      ))}
      {selectedPoll && (
        <div>
          <h2>{selectedPoll.question}</h2>
          {selectedPoll.options.map((opt) => (
            <button key={opt.text} onClick={() => setSelectedOption(opt.text)}>{opt.text}</button>
          ))}
          <button onClick={handleSubmit}>Submit Answer</button>
        </div>
      )}

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

export default StudentPage;