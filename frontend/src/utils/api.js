import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Poll API Calls
export const createPoll = (data) => axios.post(`${API_URL}/polls`, data);
export const submitAnswer = (data) => axios.post(`${API_URL}/polls/submit`, data);
export const getPolls = () => axios.get(`${API_URL}/polls`);
export const getPollResults = (pollId) => axios.get(`${API_URL}/polls/${pollId}/results`);

// User API Calls
export const registerUser = (data) => axios.post(`${API_URL}/users/register`, data);
export const getUsers = () => axios.get(`${API_URL}/users`);
export const getUserById = (userId) => axios.get(`${API_URL}/users/${userId}`);
export const deleteUser = (userId) => axios.delete(`${API_URL}/users/${userId}`);

export const getChatHistory = () => axios.get(`${API_URL}/chat`);