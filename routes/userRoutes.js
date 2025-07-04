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

/**
 * 📌 Base Route: /api/users
 * 
 * ✅ Routes:
 * - POST   /api/users/register → Register user
 * - POST   /api/users/login    → Login user
 * - GET    /api/users/profile  → Get logged-in user's profile
 * - GET    /api/users/         → Admin: Get all users
 * - DELETE /api/users/:id      → Admin: Delete user
 * - PUT    /api/users/:id      → Admin/User: Update user
 */

// ✅ Register (Public)
router.post('/register', registerUser);

// ✅ Login (Public)
router.post('/login', loginUser);

// ✅ Get Current User Profile (Protected)
router.get('/profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found ❌' });
    }

    res.status(200).json({ user });
  } catch (error) {
    console.error('Profile Fetch Error:', error);
    res.status(500).json({ message: 'Error fetching user profile' });
  }
});

// ✅ Admin Only: Get All Users
router.get('/', protect, adminOnly, getAllUsers);

// ✅ Admin Only: Delete Any User
router.delete('/:id', protect, adminOnly, deleteUser);

// ✅ Update User Info (Optional: Can be made adminOnly)
router.put('/:id', protect, updateUser);
// router.put('/:id', protect, adminOnly, updateUser); // 👉 Enable for admin-only updates

export default router;
