// backend/controllers/userController.js

import { User } from '../DB.SCHEMA/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// ✅ JWT Token Generator
const generateToken = (user) => {
  return jwt.sign(
    {
      userId: user._id,
      email: user.email,
      isAdmin: user.isAdmin || false,
    },
    process.env.JWT_SECRET || 'secret_key',
    { expiresIn: '1d' }
  );
};

// ✅ Register User
export const registerUser = async (req, res) => {
  const { name, username, email, password } = req.body;

  if (!name || !username || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      username,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      message: '✅ User Registered Successfully',
      user: {
        id: newUser._id,
        name: newUser.name,
        username: newUser.username,
        email: newUser.email,
        isAdmin: newUser.isAdmin || false,
      },
      token: generateToken(newUser),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Login User
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and Password are required" });
  }

  try {
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    res.json({
      message: '✅ Login Successful',
      user: {
        id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        isAdmin: user.isAdmin || false,
      },
      token: generateToken(user),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Get All Users (Admin)
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Update User (Admin)
export const updateUser = async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).select('-password');

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      message: '✅ User updated successfully',
      user: updatedUser
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// ✅ Delete User (Admin)
export const deleteUser = async (req, res) => {
  try {
    const deleted = await User.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: '✅ User deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Get Profile (Protected Route)
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      id: user._id,
      name: user.name,
      username: user.username,
      email: user.email,
      isAdmin: user.isAdmin
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
