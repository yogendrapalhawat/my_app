// backend/DB.SCHEMA/User.js

import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    minlength: 3,
    maxlength: 20,
    match: /^[a-z0-9_]+$/, // only lowercase letters, numbers, underscores
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    match: /^[^\s@]+@[a-zA-Z0-9.-]+\.(ac\.in|edu|edu\.in)$/i, // college emails only
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    select: false, // do not send password in query results
  },
  role: {
    type: String,
    enum: ['Student', 'Club'],
    default: 'Student',
  },
  isAdmin: {
    type: Boolean,
    default: false, // ✅ included as per your original code
  },
  college: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'College',
  },
  resumeLink: {
    type: String,
    trim: true,
  },
  githubProfile: {
    type: String,
    trim: true,
    match: /^https:\/\/(www\.)?github\.com\/[A-Za-z0-9_-]+$/,
  },
  interests: [
    {
      type: String,
      trim: true,
    }
  ],
  skills: [
    {
      type: String,
      trim: true,
    }
  ],
  participatedEvents: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
    }
  ],
  hostedEvents: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
    }
  ],
}, {
  timestamps: true
});

export const User = mongoose.model('User', userSchema);
