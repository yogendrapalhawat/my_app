// backend/routes/userRoutes.js
import express from 'express';
import {
  registerUser,
  loginUser,
  getAllUsers,
  updateUser,
  deleteUser
} from '../controllers/userController.js';

const router = express.Router();

// Register
router.post('/register', registerUser);

// Login
router.post('/login', loginUser);

// Get all users
router.get('/', getAllUsers);

// Update user by ID
router.put('/:id', updateUser);

// Delete user by ID
router.delete('/:id', deleteUser);

export default router;
