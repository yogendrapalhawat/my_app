// backend/DB.SCHEMA/Event.js

import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema(
  {
    // 📝 Title & Description
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
    },

    // 🏷️ Tags
    tags: {
      type: [String],
      required: [true, 'At least one tag is required'],
      enum: ['Hackathon', 'AI', 'Sports', 'Workshop', 'Debate', 'Coding'],
    },

    // 🌐 Event Type
    eventType: {
      type: String,
      required: true,
      enum: ['Virtual', 'In-Person', 'Hybrid'],
    },

    // 📍 Location (Required for some types)
    location: {
      type: String,
      trim: true,
      default: '',
    },

    // 📆 Event Dates
    startDate: {
      type: Date,
      required: [true, 'Start date is required'],
    },
    endDate: {
      type: Date,
      required: [true, 'End date is required'],
    },

    // 👤 Event Creator
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    // 🏫 College
    college: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'College',
      required: [true, 'College reference is required'],
    },

    // 👥 Max participants & Registered users
    maxParticipants: {
      type: Number,
      required: [true, 'Max participants is required'],
      min: [1, 'At least 1 participant is required'],
    },
    registeredUsers: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    }],

    // 📊 Event status
    eventStatus: {
      type: String,
      enum: ['Upcoming', 'Ongoing', 'Past'],
      default: 'Upcoming',
    },

    // 🔗 Optional external registration link
    registrationLink: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

//
// ✅ Indexes for faster queries
//
eventSchema.index({ tags: 1, location: 1, college: 1, startDate: -1 });
eventSchema.index({ title: 'text' });
eventSchema.index({ createdAt: -1, _id: -1 });

//
// ✅ Virtual field (for easier client use)
//
eventSchema.virtual('eventId').get(function () {
  return this._id.toHexString();
});

//
// ❗ Location validation based on eventType
//
eventSchema.pre('validate', function (next) {
  if (
    (this.eventType === 'In-Person' || this.eventType === 'Hybrid') &&
    (!this.location || this.location.trim() === '')
  ) {
    this.invalidate('location', 'Location is required for In-Person or Hybrid events.');
  }
  next();
});

//
// ✅ Method: check if event is full
//
eventSchema.methods.isFull = function () {
  return this.registeredUsers.length >= this.maxParticipants;
};

//
// 🕒 Auto-status based on current time
//
eventSchema.pre('save', function (next) {
  const now = new Date();

  if (now < this.startDate) {
    this.eventStatus = 'Upcoming';
  } else if (now >= this.startDate && now <= this.endDate) {
    this.eventStatus = 'Ongoing';
  } else {
    this.eventStatus = 'Past';
  }

  next();
});

//
// ✅ Final Model
//
export const Event = mongoose.model('Event', eventSchema);
