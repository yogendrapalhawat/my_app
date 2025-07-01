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
import { User } from '../DB.SCHEMA/User.js'; // 👈 Add this line to fetch user from DB

const router = express.Router();

// ✅ Register User
router.post('/register', registerUser);

// ✅ Login User
router.post('/login', loginUser);

// ✅ Get All Users (public)
router.get('/', getAllUsers);

// ✅ Get Logged-in User Profile (Protected Route)
router.get('/profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ user }); // 👈 returning full user object
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user profile' });
  }
});

// ✅ Update User by ID
router.put('/:id', updateUser);

// ✅ Delete User by ID
router.delete('/:id', deleteUser);

export default router;
