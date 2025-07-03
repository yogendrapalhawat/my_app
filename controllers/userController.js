// backend/controllers/userController.js

import { User } from '../DB.SCHEMA/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// ✅ Generate JWT Token Helper
const generateToken = (user) => {
  return jwt.sign(
    {
      userId: user._id,
      email: user.email,
      isAdmin: user.isAdmin, // ✅ This must match the DB
    },
    process.env.JWT_SECRET || 'secret',
    { expiresIn: '1d' }
  );
};

// ✅ Register User
export const registerUser = async (req, res) => {
  const { name, username, email, password } = req.body;

  try {
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      username,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      message: 'User Registered',
      user: {
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin || false,
      },
      token: generateToken(user),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Login User
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    res.json({
      message: 'Login successful',
      user: {
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin || false,
      },
      token: generateToken(user), // ✅ Use helper
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Get All Users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Update User
export const updateUser = async (req, res) => {
  try {
    const updated = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: 'User not found' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// ✅ Delete User
export const deleteUser = async (req, res) => {
  try {
    const deleted = await User.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
