// backend/DB.SCHEMA/User.js
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },

    username: {
      type: String,
      required: [true, 'Username is required'],
      unique: true,
      trim: true,
      lowercase: true,
      minlength: [3, 'Username must be at least 3 characters'],
      maxlength: [20, 'Username must be at most 20 characters'],
      match: [
        /^[a-z0-9_]+$/,
        'Username can only contain lowercase letters, numbers, and underscores',
      ],
    },

    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^[^\s@]+@[a-zA-Z0-9.-]+\.(ac\.in|edu|edu\.in)$/i,
        'Only academic (.ac.in, .edu, .edu.in) emails are allowed',
      ],
    },

    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [8, 'Password must be at least 8 characters'],
      select: false, // Hide password in find()
    },

    role: {
      type: String,
      enum: ['Student', 'Club'],
      default: 'Student',
    },

    isAdmin: {
      type: Boolean,
      default: false,
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
      match: [
        /^https:\/\/(www\.)?github\.com\/[A-Za-z0-9_-]+$/,
        'Must be a valid GitHub profile link',
      ],
    },

    interests: [String],
    skills: [String],

    participatedEvents: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event',
      },
    ],

    hostedEvents: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event',
      },
    ],
  },
  {
    timestamps: true,
  }
);

// ✅ Indexes
userSchema.index({ username: 1 });
userSchema.index({ email: 1 });

// ✅ Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next(); // skip if unchanged
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

export const User = mongoose.model('User', userSchema);
