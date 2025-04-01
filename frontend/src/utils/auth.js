// utils/auth.js
import jwt from 'jsonwebtoken';

export const generateToken = (userId, role) => {
  return jwt.sign({ userId, role }, 'secretKey', { expiresIn: '1h' });
};
