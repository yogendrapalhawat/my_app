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
import { adminOnly } from '../middlewares/adminMiddleware.js';

const router = express.Router();

/* 
📌 Base Route: /api/events
   Examples:
   - POST   /api/events/           => Create event
   - GET    /api/events/           => Get all events
   - POST   /api/events/:id/register => Register user to event
   - GET    /api/events/my         => Events user joined
*/

// ✅ Create Event (any logged-in user can create; or make admin-only if needed)
router.post('/', protect, createEvent);
// router.post('/', protect, adminOnly, createEvent); // optional

// ✅ Get All Events (Public)
router.get('/', getAllEvents);

// ✅ Get Events Joined by Current User
router.get('/my', protect, getMyEvents);

// ✅ Register User to an Event
router.post('/:id/register', protect, registerToEvent);

// ✅ Leave Event
router.post('/:id/leave', protect, leaveEvent);

// ✅ Update Event (by creator or admin)
router.put('/:id', protect, updateEvent);
// router.put('/:id', protect, adminOnly, updateEvent); // optional

// ✅ Delete Event (by creator or admin)
router.delete('/:id', protect, deleteEvent);
// router.delete('/:id', protect, adminOnly, deleteEvent); // optional

export default router;
