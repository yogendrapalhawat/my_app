import express from 'express';
import {
  createEvent,
  getAllEvents,
  registerEvent,
  leaveEvent,
  getMyEvents,
  updateEvent,
  deleteEvent
} from '../controllers/eventController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/', protect, createEvent);
router.get('/', getAllEvents);
router.get('/my', protect, getMyEvents);                  // ✅ My events for user
router.post('/:id/register', protect, registerEvent);
router.post('/:id/leave', protect, leaveEvent);           // ✅ Leave event
router.put('/:id', protect, updateEvent);
router.delete('/:id', protect, deleteEvent);

export default router;
