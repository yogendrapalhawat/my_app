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
import { adminOnly } from '../middlewares/adminMiddleware.js';

const router = express.Router();

/**
 * 📌 Base Route: /api/events
 *
 * ✅ Routes:
 * - POST   /api/events/              → Create new event
 * - GET    /api/events/              → Get all events
 * - GET    /api/events/my            → Get events joined by user
 * - POST   /api/events/:id/register  → Register to event
 * - POST   /api/events/:id/leave     → Leave event
 * - PUT    /api/events/:id           → Update event
 * - DELETE /api/events/:id           → Delete event
 */

// ✅ Create Event (any logged-in user)
router.post('/', protect, createEvent);
// router.post('/', protect, adminOnly, createEvent); // 👉 Enable this if only admin can create

// ✅ Get All Events (Public)
router.get('/', getAllEvents);

// ✅ Get Events joined by current user
router.get('/my', protect, getMyEvents);

// ✅ Register to an Event
router.post('/:id/register', protect, registerToEvent);

// ✅ Leave an Event
router.post('/:id/leave', protect, leaveEvent);

// ✅ Update Event (Logged-in user OR admin)
router.put('/:id', protect, updateEvent);
// router.put('/:id', protect, adminOnly, updateEvent); // 👉 Enable if only admin can update

// ✅ Delete Event (Logged-in user OR admin)
router.delete('/:id', protect, deleteEvent);
// router.delete('/:id', protect, adminOnly, deleteEvent); // 👉 Enable if only admin can delete

export default router;
