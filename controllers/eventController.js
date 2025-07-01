97215+45.// backend/controllers/eventController.js
import { Event } from '../DB.SCHEMA/Event.js';

// Create Event
export const createEvent = async (req, res) => {
  try {
    const event = await Event.create(req.body);
    res.status(201).json({ message: 'Event Created', event });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Read All Events
export const getAllEvents = async (req, res) => {
  try {
    const events = await Event.find();
    res.status(200).json(events);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update Event
export const updateEvent = async (req, res) => {
  try {
    const updated = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: 'Event not found' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete Event
export const deleteEvent = async (req, res) => {
  try {
    const deleted = await Event.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Event not found' });
    res.json({ message: 'Event deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Register a user to an event
export const registerToEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });

    // Check if already registered
    if (event.registeredUsers.includes(req.user.userId)) {
      return res.status(400).json({ message: "Already registered for this event" });
    }

    // Check if full
    if (event.isFull()) {
      return res.status(400).json({ message: "Event is full" });
    }

    // Register user
    event.registeredUsers.push(req.user.userId);
    await event.save();

    res.json({ message: "Registration successful", event });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
