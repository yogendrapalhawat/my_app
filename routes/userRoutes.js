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

/**
 * 📌 Base Route: /api/users
 *
 * ✅ Public:
 * - POST   /register        → Register new user
 * - POST   /login           → Login user
 *
 * ✅ Protected (Auth):
 * - GET    /profile         → Get logged-in user's profile
 *
 * ✅ Admin Only:
 * - GET    /                → Get all users
 * - DELETE /:id             → Delete a user
 * - PUT    /make-admin/:id  → Promote user to admin
 *
 * ✅ General:
 * - PUT    /:id             → Update any user info (if authorized)
 */

// ✅ Register User
router.post('/register', registerUser);

// ✅ Login User
router.post('/login', loginUser);

// ✅ Get Current User Profile
router.get('/profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found ❌' });
    res.status(200).json(user);
  } catch (error) {
    console.error('Profile Fetch Error:', error);
    res.status(500).json({ message: 'Error fetching user profile' });
  }
});

// ✅ Get All Users (Admin)
router.get('/', protect, adminOnly, getAllUsers);

// ✅ Delete User (Admin)
router.delete('/:id', protect, adminOnly, deleteUser);

// ✅ Update User (Self or Admin)
router.put('/:id', protect, updateUser);

// ✅ Promote User to Admin (Admin-only logic can be added if needed)
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
