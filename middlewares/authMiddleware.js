import jwt from 'jsonwebtoken';
import { User } from '../DB.SCHEMA/User.js';

// 🔐 Middleware to protect routes using JWT
export const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  // ✅ Check if token exists and starts with 'Bearer '
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];

    try {
      // 🔍 Verify JWT token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // 🧑‍💻 Find user by ID from token (exclude password)
      const user = await User.findById(decoded.userId).select('-password');

      if (!user) return res.status(404).json({ message: 'User not found' });

      // 🧾 Add user object to request
      req.user = user;
      next(); // move to next middleware or controller
    } catch (err) {
      return res.status(401).json({ message: 'Invalid token' });
    }
  } else {
    return res.status(401).json({ message: 'Token not provided' });
  }
};
