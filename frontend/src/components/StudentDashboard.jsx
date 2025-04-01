import React, { useState, useEffect } from 'react';
import { getPolls, submitAnswer } from '../utils/api';
import socket from '../utils/socket';
//import axios from 'axios';

const StudentDashboard = () => {
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
    <div className="min-h-screen bg-gradient-to-r from-indigo-500 to-blue-600 text-white">
      <div className="max-w-4xl mx-auto p-8">
        {/* Header */}
        <header className="text-center mb-8">
          <h1 className="text-3xl font-bold">Student Dashboard</h1>
          <p className="text-xl">Welcome, {username}</p>
        </header>

        {/* Polls Section */}
        <section className="bg-white text-black p-6 rounded-lg shadow-lg mb-6">
          <h2 className="text-2xl font-semibold mb-4">Available Polls</h2>
          <div className="space-y-4">
            {polls.map((poll) => (
              <button
                key={poll._id}
                onClick={() => setSelectedPoll(poll)}
                className="w-full p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
              >
                {poll.question}
              </button>
            ))}
          </div>
        </section>

        {/* Poll Answering Section */}
        {selectedPoll && (
          <section className="bg-white text-black p-6 rounded-lg shadow-lg mb-6">
            <h2 className="text-2xl font-semibold mb-4">{selectedPoll.question}</h2>
            <div className="space-y-4">
              {selectedPoll.options.map((opt, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedOption(opt.text)}
                  className={`w-full p-3 border rounded-lg ${
                    selectedOption === opt.text ? 'bg-blue-600 text-white' : 'bg-gray-200 text-black'
                  }`}
                >
                  {opt.text}
                </button>
              ))}
            </div>
            <button
              onClick={handleSubmit}
              className="mt-4 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg"
            >
              Submit Answer
            </button>
          </section>
        )}

        {/* Chat Room Section */}
        <section className="bg-white text-black p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold mb-4">Chat Room</h2>
          <div style={{ border: '1px solid #ccc', height: '300px', overflowY: 'auto' }}>
            {messages.map((msg, index) => (
              <p key={index}><strong>{msg.username}:</strong> {msg.message}</p>
            ))}
          </div>
          <div className="flex mt-4">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              className="w-full p-3 border rounded-lg"
            />
            <button
              onClick={sendMessage}
              className="ml-4 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
            >
              Send
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default StudentDashboard;
