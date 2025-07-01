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

const router = express.Router();

// ✅ Register User
router.post('/register', registerUser);

// ✅ Login User
router.post('/login', loginUser);

// ✅ Get All Users (Public or make it protected later)
router.get('/', getAllUsers);

// ✅ Get Logged-in User Profile (Protected Route)
router.get('/profile', protect, (req, res) => {
  res.json({
    user: {
      _id: req.user._id,
      name: req.user.name,
      email: req.user.email
    }
  });
});

// ✅ Update User by ID
router.put('/:id', updateUser);

// ✅ Delete User by ID
router.delete('/:id', deleteUser);

export default router;
