import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import axios from 'axios';

const socket = io('http://localhost:5000');

const TeacherDashboard = () => {
  // Poll creation state
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '']);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Chat room state
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const username = 'Teacher';

  useEffect(() => {
    // Socket event for receiving messages
    socket.on('receiveMessage', (message) => {
      setMessages((prev) => [...prev, message]);
    });

    // Cleanup socket connection on unmount
    return () => socket.off('receiveMessage');
  }, []);

  const handleCreatePoll = async () => {
    if (question.trim() === '' || options.some(option => option.trim() === '')) {
      setError('Please fill out all fields!');
      return;
    }
    
    try {
      setLoading(true);
      const res = await axios.post('http://localhost:5000/api/polls/create', { question, options });
      socket.emit('createPoll', res.data);
      setQuestion('');
      setOptions(['', '']);
      setError('');
    } catch (error) {
      setError('Failed to create poll, please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchResults = async () => {
    try {
      setLoading(true);
      const res = await axios.get('http://localhost:5000/api/polls/results');
      setResults(res.data);
    } catch (error) {
      setError('Failed to fetch results, please try again.');
    } finally {
      setLoading(false);
    }
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
        <header className="text-center mb-8">
          <h1 className="text-3xl font-bold">Teacher Dashboard</h1>
        </header>

        {/* Poll Creation Section */}
        <section className="bg-white text-black p-6 rounded-lg shadow-lg mb-6">
          <h2 className="text-2xl font-semibold mb-4">Create a Poll</h2>
          <div className="space-y-4">
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Enter the question"
              className="w-full p-3 border rounded-lg"
            />
            <div className="space-y-2">
              {options.map((option, index) => (
                <input
                  key={index}
                  type="text"
                  value={option}
                  onChange={(e) => {
                    const newOptions = [...options];
                    newOptions[index] = e.target.value;
                    setOptions(newOptions);
                  }}
                  placeholder={`Option ${index + 1}`}
                  className="w-full p-3 border rounded-lg"
                />
              ))}
            </div>
            <div className="flex space-x-4">
              <button
                onClick={handleCreatePoll}
                disabled={loading}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg text-white transition duration-300"
              >
                {loading ? 'Creating...' : 'Create Poll'}
              </button>
              <button
                onClick={fetchResults}
                disabled={loading}
                className="px-6 py-3 bg-green-600 hover:bg-green-700 rounded-lg text-white transition duration-300"
              >
                {loading ? 'Fetching...' : 'View Results'}
              </button>
            </div>
            {error && <p className="text-red-500 mt-4">{error}</p>}
          </div>
        </section>

        {/* Poll Results Section */}
        <section className="bg-white text-black p-6 rounded-lg shadow-lg mb-6">
          <h2 className="text-2xl font-semibold mb-4">Poll Results</h2>
          {results.length === 0 ? (
            <p>No results available yet. Create a poll to see the results.</p>
          ) : (
            <ul className="space-y-4">
              {results.map((poll) => (
                <li key={poll._id} className="bg-gray-100 p-4 rounded-lg shadow-md">
                  <h3 className="text-xl font-semibold">{poll.question}</h3>
                  <div className="mt-2">
                    {poll.options.map((option, index) => (
                      <p key={index} className="text-lg">
                        {option}: {poll.responses[index]} votes
                      </p>
                    ))}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Chat Room Section */}
        <section className="bg-white text-black p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold mb-4">Chat Room</h2>
          <div style={{ border: '1px solid #ccc', height: '300px', overflowY: 'auto' }}>
            {messages.map((msg, index) => (
              <p key={index}><strong>{msg.username}:</strong> {msg.message}</p>
            ))}
          </div>
          <div className="flex space-x-4 mt-4">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              className="w-full p-3 border rounded-lg"
            />
            <button onClick={sendMessage} className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg text-white transition duration-300">
              Send
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default TeacherDashboard;
