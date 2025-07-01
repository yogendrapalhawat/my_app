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

const router = express.Router();

// ✅ Create a new event
router.post('/', protect, createEvent);

// ✅ Get all events
router.get('/', getAllEvents);

// ✅ Get events joined by logged-in user
router.get('/my', protect, getMyEvents);

// ✅ Register for an event
router.post('/:id/register', protect, registerToEvent);

// ✅ Leave an event
router.post('/:id/leave', protect, leaveEvent);

// ✅ Update an event
router.put('/:id', protect, updateEvent);

// ✅ Delete an event
router.delete('/:id', protect, deleteEvent);

export default router;
