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
      match: [
        /^[a-zA-Z0-9.-]+\.(ac\.in|edu|edu\.in)$/i,
        'Please provide a valid academic domain (e.g. nitdgp.ac.in)',
      ],
      required: [true, 'Domain is required'],
      unique: true,
      lowercase: true,
    },
    location: {
      type: String,
      default: 'India',
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
