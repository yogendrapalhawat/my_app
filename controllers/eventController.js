// backend/controllers/eventController.js

import { Event } from '../DB.SCHEMA/Event.js';

// ✅ Add method on Event schema to check if full
if (!Event.schema.methods.isFull) {
  Event.schema.methods.isFull = function () {
    return this.registeredUsers.length >= this.maxParticipants;
  };
}

// ✅ Create Event
export const createEvent = async (req, res) => {
  try {
    const {
      title,
      description,
      tag,
      status,
      startDate,
      endDate,
      location,
      organizer,
      registrationLink,
      maxParticipants
    } = req.body;

    // 🔍 Field validation
    if (
      !title || !description || !tag || !status || !startDate ||
      !endDate || !location || !organizer || !registrationLink || !maxParticipants
    ) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const event = await Event.create({
      title,
      description,
      tag,
      status,
      startDate,
      endDate,
      location,
      organizer,
      registrationLink,
      maxParticipants,
      createdBy: req.user.userId
    });

    res.status(201).json({ message: '✅ Event Created Successfully', event });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// ✅ Read All Events
export const getAllEvents = async (req, res) => {
  try {
    const events = await Event.find()
      .populate('registeredUsers', 'name email')
      .populate('createdBy', 'name email');

    res.status(200).json(events);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Update Event
export const updateEvent = async (req, res) => {
  try {
    const updated = await Event.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: 'Event not found' });

    res.json({ message: '✅ Event updated', updated });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// ✅ Delete Event
export const deleteEvent = async (req, res) => {
  try {
    const deleted = await Event.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Event not found' });

    res.json({ message: '✅ Event deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Register to Event
export const registerToEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });

    if (event.registeredUsers.includes(req.user.userId)) {
      return res.status(400).json({ message: "You are already registered for this event" });
    }

    if (event.isFull()) {
      return res.status(400).json({ message: "This event is full" });
    }

    event.registeredUsers.push(req.user.userId);
    await event.save();

    res.json({ message: "✅ Registered successfully", event });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ My Joined Events
export const getMyEvents = async (req, res) => {
  try {
    const events = await Event.find({ registeredUsers: req.user.userId });
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Leave Event
export const leaveEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });

    const wasRegistered = event.registeredUsers.includes(req.user.userId);
    if (!wasRegistered) {
      return res.status(400).json({ message: "You are not registered for this event" });
    }

    // Remove user from registeredUsers
    event.registeredUsers = event.registeredUsers.filter(
      id => id.toString() !== req.user.userId
    );

    await event.save();
    res.json({ message: "✅ You have left the event", event });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
