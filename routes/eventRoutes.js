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
import { adminOnly } from '../middlewares/adminMiddleware.js'; // Optional: restrict some routes to admins

const router = express.Router();

/* 
📌 All routes under /api/events 
  Example: POST /api/events/:id/register
*/

// ✅ Create new event (any logged-in user can create)
router.post('/', protect, createEvent); 
// To restrict to admins: router.post('/', protect, adminOnly, createEvent);

// ✅ Get all events
router.get('/', getAllEvents);  // Public or protected — currently public

// ✅ Get events joined by the logged-in user
router.get('/my', protect, getMyEvents);

// ✅ Register a user to an event
router.post('/:id/register', protect, registerToEvent);

// ✅ Leave an event
router.post('/:id/leave', protect, leaveEvent);

// ✅ Update an event
router.put('/:id', protect, updateEvent); 
// If you want: router.put('/:id', protect, adminOnly, updateEvent);

// ✅ Delete an event
router.delete('/:id', protect, deleteEvent); 
// If admin-only: router.delete('/:id', protect, adminOnly, deleteEvent);

export default router;
