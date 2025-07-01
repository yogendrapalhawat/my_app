// backend/routes/eventRoutes.js
import express from 'express';
import {
  createEvent,
  getAllEvents,
  registerToEvent,
  leaveEvent,
  getMyEvents,
  updateEvent,
  deleteEvent
} from '../controllers/eventController.js';

import { protect } from '../middlewares/authMiddleware.js';
import { isAdmin } from '../middlewares/adminMiddleware.js'; // (Optional, if you want to restrict event creation/deletion to admins)

const router = express.Router();

// ✅ Create a new event (optionally admin only)
router.post('/', protect, createEvent); // You can add isAdmin here if needed

// ✅ Get all events (Public)
router.get('/', getAllEvents);

// ✅ Get events joined by the logged-in user
router.get('/my', protect, getMyEvents);

// ✅ Register a user to an event
router.post('/:id/register', protect, registerToEvent);

// ✅ Leave an event
router.post('/:id/leave', protect, leaveEvent);

// ✅ Update an event
router.put('/:id', protect, updateEvent); // You can also use isAdmin if you want

// ✅ Delete an event
router.delete('/:id', protect, deleteEvent); // You can also use isAdmin if needed

export default router;
