// backend/DB.SCHEMA/College.js

import mongoose from 'mongoose';

const collegeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'College name is required'],
      trim: true,
    },
    domain: {
      type: String,
      required: [true, 'Domain is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^[a-zA-Z0-9.-]+\.(ac\.in|edu|edu\.in)$/i,
        'Please provide a valid academic domain (e.g. nitdgp.ac.in)',
      ],
    },
    location: {
      type: String,
      default: 'India',
      trim: true,
    },
    verified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export const College = mongoose.model('College', collegeSchema);
