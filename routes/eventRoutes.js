// backend/routes/eventRoutes.js
import express from 'express';
import {
  createEvent,
  getAllEvents,
  updateEvent,
  deleteEvent,
  registerToEvent
} from '../controllers/eventController.js';
import { protect } from '../middlewares/authMiddleware.js';


const router = express.Router();

// Create Event (protected)
router.post('/create', protect, createEvent);

// Read All Events (public)
router.get('/', getAllEvents);

// Update Event (protected)
router.put('/:id', protect, updateEvent);

// Delete Event (protected)
router.delete('/:id', protect, deleteEvent);

// Register to Event (protected)
router.post('/:id/register', protect, registerToEvent);

export default router;
