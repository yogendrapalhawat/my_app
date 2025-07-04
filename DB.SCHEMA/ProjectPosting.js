// backend/DB.SCHEMA/ProjectPosting.js

import mongoose from 'mongoose';

const projectPostingSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    requiredRoles: [
      {
        role: { type: String, required: true },
        description: { type: String, trim: true },
        count: { type: Number, required: true, min: 1 },
      },
    ],

    applicants: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        message: { type: String },
        appliedAt: { type: Date, default: Date.now },
      },
    ],

    availability: [
      {
        day: {
          type: String,
          enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
          required: true,
        },
        time: {
          type: String,
          required: true,
          match: /^([01]\d|2[0-3]):([0-5]\d)-([01]\d|2[0-3]):([0-5]\d)$/, // HH:MM-HH:MM format
        },
      },
    ],

    selectedUsers: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
          required: true,
        },
        role: {
          type: String,
          required: true,
          trim: true,
        },
      },
    ],

    status: {
      type: String,
      enum: ['Open', 'Closed'],
      default: 'Open',
    },
  },
  { timestamps: true }
);

// 📌 Indexes for fast searching and sorting
projectPostingSchema.index({ title: 'text' });
projectPostingSchema.index({ createdAt: -1, _id: -1 });

// 🔁 Virtual field for frontend
projectPostingSchema.virtual('projectId').get(function () {
  return this._id.toHexString();
});
projectPostingSchema.set('toJSON', { virtuals: true });
projectPostingSchema.set('toObject', { virtuals: true });

// ✅ Method: Check if all roles are filled
projectPostingSchema.methods.isFull = function () {
  const roleCounts = {};
  for (const member of this.selectedUsers || []) {
    if (!member.role) continue;
    roleCounts[member.role] = (roleCounts[member.role] || 0) + 1;
  }

  for (const req of this.requiredRoles) {
    const currentCount = roleCounts[req.role] || 0;
    if (currentCount < req.count) return false;
  }

  return true;
};

// 🧠 Auto close if all roles filled
projectPostingSchema.pre('save', function (next) {
  if (this.isFull()) {
    this.status = 'Closed';
  }
  next();
});

export const ProjectPosting = mongoose.model('ProjectPosting', projectPostingSchema);
