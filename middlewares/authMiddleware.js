// backend/middlewares/authMiddleware.js

import jwt from 'jsonwebtoken';
import { User } from '../DB.SCHEMA/User.js';

/**
 * 🔐 Middleware: Protect routes using JWT token
 * Add this to any route to ensure user is authenticated
 * 
 * ✅ Example:
 *    router.get('/dashboard', protect, controller)
 */
export const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];

    try {
      // 🔍 Decode & verify the token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // 🔐 Find user from database (excluding password)
      const user = await User.findById(decoded.userId).select('-password');

      if (!user) {
        return res.status(404).json({ message: 'User not found ❌' });
      }

      // ✅ Attach user info to req object
      req.user = user;
      next();
    } catch (err) {
      console.error('❌ JWT Verification Error:', err);
      return res.status(401).json({ message: 'Invalid or expired token' });
    }
  } else {
    return res.status(401).json({ message: 'Authorization token not provided' });
  }
};
