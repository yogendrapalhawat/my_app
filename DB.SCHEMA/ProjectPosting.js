// backend/DB.SCHEMA/ProjectPosting.js

import mongoose from 'mongoose';

const projectPostingSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Project title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Project description is required'],
      trim: true,
    },
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    requiredRoles: [
      {
        role: {
          type: String,
          required: [true, 'Role is required'],
          trim: true,
        },
        description: {
          type: String,
          trim: true,
        },
        count: {
          type: Number,
          required: [true, 'Count is required'],
          min: [1, 'Minimum 1 member required per role'],
        },
      },
    ],

    applicants: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
          required: true,
        },
        message: {
          type: String,
          trim: true,
        },
        appliedAt: {
          type: Date,
          default: Date.now,
        },
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
          match: [
            /^([01]\d|2[0-3]):([0-5]\d)-([01]\d|2[0-3]):([0-5]\d)$/,
            'Time must be in HH:MM-HH:MM format',
          ],
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
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// 📌 Indexes for search & performance
projectPostingSchema.index({ title: 'text' });
projectPostingSchema.index({ createdAt: -1, _id: -1 });

// 🆔 Virtual: projectId
projectPostingSchema.virtual('projectId').get(function () {
  return this._id.toHexString();
});

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

// 🧠 Hook: Auto-close project if full
projectPostingSchema.pre('save', function (next) {
  if (this.isFull()) {
    this.status = 'Closed';
  }
  next();
});

export const ProjectPosting = mongoose.model('ProjectPosting', projectPostingSchema);
