import mongoose from 'mongoose';

const projectPostingSchema = new mongoose.Schema(
  {
    // 📌 Basic Details
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

    // 👤 Who posted this project
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    // 🧑‍💻 Required Roles for Project
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
          min: [1, 'At least 1 person required for the role'],
        },
      },
    ],

    // 📥 Applicants applying to join
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

    // 📅 Availability schedule
    availability: [
      {
        day: {
          type: String,
          enum: [
            'Monday',
            'Tuesday',
            'Wednesday',
            'Thursday',
            'Friday',
            'Saturday',
            'Sunday',
          ],
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

    // ✅ Finalized Team Members
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

    // 🔐 Project Status
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

//
// 🔍 Indexes for fast querying
//
projectPostingSchema.index({ title: 'text' });
projectPostingSchema.index({ createdAt: -1, _id: -1 });

//
// 🆔 Virtual field
//
projectPostingSchema.virtual('projectId').get(function () {
  return this._id.toHexString();
});

//
// ✅ Method: Check if all roles are filled
//
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

//
// 🧠 Pre-save Hook: Auto-close if full
//
projectPostingSchema.pre('save', function (next) {
  if (this.isFull()) {
    this.status = 'Closed';
  }
  next();
});

//
// ✅ Final export
//
export const ProjectPosting = mongoose.model('ProjectPosting', projectPostingSchema);
