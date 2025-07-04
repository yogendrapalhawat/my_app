// backend/DB.SCHEMA/MatchRequest.js

import mongoose from 'mongoose';

const matchRequestSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
      required: true,
    },
    maxTeamSize: {
      type: Number,
      required: true,
      min: [1, 'Team must have at least one member'],
    },
    lookingForRoles: [
      {
        type: String,
        trim: true,
      },
    ],
    skills: [
      {
        type: String,
        trim: true,
      },
    ],
    applicants: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
          required: true,
        },
        role: {
          type: String,
          trim: true,
        },
        description: {
          type: String,
          trim: true,
        },
        appliedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    selectedUsers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    status: {
      type: String,
      enum: ['Pending', 'Matched'],
      default: 'Pending',
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// 🆔 Virtual: requestId
matchRequestSchema.virtual('requestId').get(function () {
  return this._id.toHexString();
});

// ✅ Method: Check if team is full
matchRequestSchema.methods.isTeamFull = function () {
  return this.selectedUsers.length >= this.maxTeamSize;
};

// 🛠 Hook: Auto-update status if full
matchRequestSchema.pre('save', function (next) {
  if (this.isTeamFull()) {
    this.status = 'Matched';
  }
  next();
});

export const MatchRequest = mongoose.model('MatchRequest', matchRequestSchema);
