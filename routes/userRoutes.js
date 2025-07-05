// backend/routes/userRoutes.js

import express from 'express';
import {
  registerUser,
  loginUser,
  getAllUsers,
  updateUser,
  deleteUser
} from '../controllers/userController.js';

import { protect } from '../middlewares/authMiddleware.js';
import { adminOnly } from '../middlewares/adminMiddleware.js';
import { User } from '../DB.SCHEMA/User.js';

const router = express.Router();

// ✅ Register (Public)
router.post('/register', registerUser);

// ✅ Login (Public)
router.post('/login', loginUser);

// ✅ Get Current User Profile (Protected)
router.get('/profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found ❌' });
    res.status(200).json(user); // send plain user object (not { user: ... })
  } catch (error) {
    console.error('Profile Fetch Error:', error);
    res.status(500).json({ message: 'Error fetching user profile' });
  }
});

// ✅ Admin Only: Get All Users
router.get('/', protect, adminOnly, getAllUsers);

// ✅ Admin Only: Delete Any User
router.delete('/:id', protect, adminOnly, deleteUser);

// ✅ Update User Info
router.put('/:id', protect, updateUser);

// ✅ ➕ NEW: Promote user to admin via Postman
router.put('/make-admin/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isAdmin: true },
      { new: true }
    );
    if (!user) return res.status(404).json({ message: 'User not found ❌' });

    res.status(200).json({ message: '✅ User promoted to admin', user });
  } catch (error) {
    console.error('Make Admin Error:', error);
    res.status(500).json({ message: 'Failed to promote user to admin ❌' });
  }
});

export default router;
