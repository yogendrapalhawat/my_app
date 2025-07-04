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

// ✅ Public: Register
router.post('/register', registerUser);

// ✅ Public: Login
router.post('/login', loginUser);

// ✅ Protected: Get Logged-in User Profile
router.get('/profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user profile' });
  }
});

// ✅ Admin Only: Get All Users
router.get('/', protect, adminOnly, getAllUsers);

// ✅ Admin Only: Delete User
router.delete('/:id', protect, adminOnly, deleteUser);

// ✅ Optional: Update any user (could also protect this as admin-only if needed)
router.put('/:id', protect, updateUser);

export default router;
