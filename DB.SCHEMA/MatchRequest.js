// backend/DB.SCHEMA/MatchRequest.js

import mongoose from 'mongoose';

const matchRequestSchema = new mongoose.Schema(
  {
    // 👤 Creator of the match request
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    // 📅 Event this match is related to
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
      required: true,
    },

    // 👥 Maximum team size
    maxTeamSize: {
      type: Number,
      required: true,
      min: [1, 'Team must have at least one member'],
    },

    // 🎯 Roles needed (Frontend, Designer, etc.)
    lookingForRoles: [
      {
        type: String,
        trim: true,
      },
    ],

    // 💡 Preferred skills
    skills: [
      {
        type: String,
        trim: true,
      },
    ],

    // 📝 Applicants to the request
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

    // ✅ Final selected users
    selectedUsers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],

    // 📌 Request Status
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

//
// 🆔 Virtual: requestId
//
matchRequestSchema.virtual('requestId').get(function () {
  return this._id.toHexString();
});

//
// ✅ Method: Check if team is full
//
matchRequestSchema.methods.isTeamFull = function () {
  return this.selectedUsers.length >= this.maxTeamSize;
};

//
// 🔄 Hook: Auto-update status if full
//
matchRequestSchema.pre('save', function (next) {
  if (this.isTeamFull()) {
    this.status = 'Matched';
  }
  next();
});

//
// ✅ Final model export
//
export const MatchRequest = mongoose.model('MatchRequest', matchRequestSchema);
