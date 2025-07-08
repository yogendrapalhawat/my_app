import { Event } from '../DB.SCHEMA/Event.js';
import { User } from '../DB.SCHEMA/User.js'; // ✅ NEW: For updating participatedEvents

// ✅ Add method on Event schema to check if full
if (!Event.schema.methods.isFull) {
  Event.schema.methods.isFull = function () {
    return this.registeredUsers.length >= this.maxParticipants;
  };
}

// ✅ Create Event — 🔥 Updated to use `tags`, `eventType`, etc. properly
export const createEvent = async (req, res) => {
  try {
    const {
      title,
      description,
      tags,
      eventType,
      location,
      startDate,
      endDate,
      college,
      registrationLink,
      maxParticipants,
      eventStatus
    } = req.body;

    // 🔍 Validation
    if (
      !title || !description || !tags || !eventType || !location || !startDate ||
      !endDate || !college || !registrationLink || !maxParticipants || !eventStatus
    ) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const event = await Event.create({
      title,
      description,
      tags,
      eventType,
      location,
      startDate,
      endDate,
      college,
      registrationLink,
      maxParticipants,
      eventStatus,
      createdBy: req.user.userId
    });

    res.status(201).json({ message: '✅ Event Created Successfully', event });
  } catch (err) {
    console.error('❌ Event creation error:', err);
    res.status(400).json({ error: err.message });
  }
};

// ✅ Get All Events (with populated creators & users)
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
    const updated = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });

    if (!updated) {
      return res.status(404).json({ message: 'Event not found' });
    }

    res.json({ message: '✅ Event updated successfully', updated });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// ✅ Delete Event
export const deleteEvent = async (req, res) => {
  try {
    const deleted = await Event.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Event not found' });
    }

    res.json({ message: '✅ Event deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Register for Event — 🔥 Updates User's `participatedEvents`
export const registerToEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    const alreadyRegistered = event.registeredUsers.includes(req.user.userId);
    if (alreadyRegistered) {
      return res.status(400).json({ message: 'Already registered' });
    }

    if (event.isFull()) {
      return res.status(400).json({ message: 'Event is full' });
    }

    event.registeredUsers.push(req.user.userId);
    await event.save();

    // ✅ Also update user schema
    const user = await User.findById(req.user.userId);
    if (!user.participatedEvents.includes(event._id)) {
      user.participatedEvents.push(event._id);
      await user.save();
    }

    res.json({ message: '✅ Registered successfully', event });
  } catch (err) {
    console.error('❌ Registration Error:', err);
    res.status(500).json({ error: err.message });
  }
};

// ✅ Get Events User Has Joined
export const getMyEvents = async (req, res) => {
  try {
    const events = await Event.find({ registeredUsers: req.user.userId });
    res.status(200).json(events);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Leave Event — 🔥 Also removes from User's `participatedEvents`
export const leaveEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    const wasRegistered = event.registeredUsers.includes(req.user.userId);
    if (!wasRegistered) {
      return res.status(400).json({ message: 'Not registered in this event' });
    }

    // 🔄 Remove user from event
    event.registeredUsers = event.registeredUsers.filter(
      id => id.toString() !== req.user.userId
    );
    await event.save();

    // 🔄 Remove event from user
    const user = await User.findById(req.user.userId);
    user.participatedEvents = user.participatedEvents.filter(
      eid => eid.toString() !== event._id.toString()
    );
    await user.save();

    res.json({ message: '✅ You have left the event', event });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
