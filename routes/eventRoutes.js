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
import { adminOnly } from '../middlewares/adminMiddleware.js'; // ✅ For admin-only protection (optional)

const router = express.Router();

// ✅ Create a new event (currently for all logged-in users)
router.post('/', protect, createEvent); 
// If you want to allow only admins to create: router.post('/', protect, adminOnly, createEvent);

// ✅ Get all events (Public)
router.get('/', getAllEvents);

// ✅ Get events joined by the logged-in user
router.get('/my', protect, getMyEvents);

// ✅ Register a user to an event
router.post('/:id/register', protect, registerToEvent);

// ✅ Leave an event
router.post('/:id/leave', protect, leaveEvent);

// ✅ Update an event
router.put('/:id', protect, updateEvent); 
// To make update admin-only: router.put('/:id', protect, adminOnly, updateEvent);

// ✅ Delete an event
router.delete('/:id', protect, deleteEvent); 
// To make delete admin-only: router.delete('/:id', protect, adminOnly, deleteEvent);

export default router;
