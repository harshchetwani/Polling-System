import React, { useEffect, useState } from 'react';
import socket from '../utils/socket';
import { getPollResults } from '../utils/api';

const PollResults = ({ pollId }) => {
  const [poll, setPoll] = useState(null);

  useEffect(() => {
    // Fetch Initial Results
    const fetchResults = async () => {
      const response = await getPollResults(pollId);
      setPoll(response.data);
    };
    fetchResults();

    // Listen for Poll Updates
    socket.on('pollUpdate', (updatedPoll) => {
      if (updatedPoll._id === pollId) {
        setPoll(updatedPoll);
      }
    });

    return () => {
      socket.off('pollUpdate');
    };
  }, [pollId]);

  if (!poll) return <p>Loading...</p>;

  return (
    <div>
      <h2>{poll.question}</h2>
      {poll.options.map((opt) => (
        <p key={opt.text}>{opt.text}: {opt.votes} votes</p>
      ))}
    </div>
  );
};

export default PollResults;
