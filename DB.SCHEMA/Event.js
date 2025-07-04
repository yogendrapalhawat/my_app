// backend/DB.SCHEMA/Event.js

import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema(
  {
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
    tags: {
      type: [String],
      required: [true, 'At least one tag is required'],
      enum: ['Hackathon', 'AI', 'Sports', 'Workshop', 'Debate', 'Coding'],
    },
    eventType: {
      type: String,
      required: true,
      enum: ['Virtual', 'In-Person', 'Hybrid'],
    },
    location: {
      type: String,
      trim: true,
      default: '',
    },
    startDate: {
      type: Date,
      required: [true, 'Start date is required'],
    },
    endDate: {
      type: Date,
      required: [true, 'End date is required'],
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    college: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'College',
      required: [true, 'College reference is required'],
    },
    maxParticipants: {
      type: Number,
      required: [true, 'Max participants is required'],
      min: [1, 'At least 1 participant is required'],
    },
    registeredUsers: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    }],
    eventStatus: {
      type: String,
      enum: ['Upcoming', 'Ongoing', 'Past'],
      default: 'Upcoming',
    },
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

// 🔍 Indexes for filters & performance
eventSchema.index({ tags: 1, location: 1, college: 1, startDate: -1 });
eventSchema.index({ title: 'text' });
eventSchema.index({ createdAt: -1, _id: -1 });

// 🆔 Virtual field
eventSchema.virtual('eventId').get(function () {
  return this._id.toHexString();
});

// ❗ Validate location if required by event type
eventSchema.pre('validate', function (next) {
  if (
    (this.eventType === 'In-Person' || this.eventType === 'Hybrid') &&
    (!this.location || this.location.trim() === '')
  ) {
    this.invalidate('location', 'Location is required for In-Person or Hybrid events.');
  }
  next();
});

// ✅ Method to check if event is full
eventSchema.methods.isFull = function () {
  return this.registeredUsers.length >= this.maxParticipants;
};

// 🕒 Auto-set eventStatus based on date
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

export const Event = mongoose.model('Event', eventSchema);
