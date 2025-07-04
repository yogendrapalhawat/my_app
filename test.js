// test.js
// 🚀 Seed Script: Inserts dummy data for College, User, Event, MatchRequest, and Project

import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

// ✅ Import Schemas
import { User } from './DB.SCHEMA/User.js';
import { College } from './DB.SCHEMA/College.js';
import { Event } from './DB.SCHEMA/Event.js';
import { MatchRequest } from './DB.SCHEMA/MatchRequest.js';
import { ProjectPosting } from './DB.SCHEMA/ProjectPosting.js';

// ✅ Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

async function seedData() {
  try {
    // 🏫 Create College
    const college = await College.create({
      name: 'IIT Bombay',
      domain: 'iitb.ac.in',
      location: 'Mumbai',
      verified: true
    });

    // 👤 Create User
    const student = await User.create({
      name: 'Keshav Kumar',
      username: 'keashav_k',
      email: 'keshav@iitb.ac.in',
      password: 'securePass1234', // Plaintext for now
      role: 'Student',
      college: college._id,
      resumeLink: 'https://drive.google.com/resume',
      githubProfile: 'https://github.com/keshav123',
      interests: ['AI', 'Hackathons'],
      skills: ['Python', 'React']
    });

    // 📅 Create Event
    const event = await Event.create({
      title: 'IITB Debate 2025',
      description: 'Debate challenge',
      tags: ['Debate'],
      eventType: 'Virtual',
      startDate: new Date('2025-07-05'),
      endDate: new Date('2025-07-08'),
      createdBy: student._id,
      college: college._id,
      maxParticipants: 100,
      registeredUsers: [student._id],
      registrationLink: 'https://example.com/register'
    });

    // 🤝 Create Match Request
    const match = await MatchRequest.create({
      user: student._id,
      event: event._id,
      maxTeamSize: 4,
      lookingForRoles: ['Debatee'],
      skills: ['Fluent English', 'Good Knowledge']
    });

    // 💻 Create Project Posting
    const project = await ProjectPosting.create({
      title: 'AI Chatbot for App',
      description: 'Looking for fullstack developers to build chatbot',
      postedBy: student._id,
      requiredRoles: [
        { role: 'Frontend', description: 'UI in React', count: 1 },
        { role: 'Backend', description: 'Node.js & MongoDB', count: 1 }
      ],
      availability: [
        { day: 'Monday', time: '10:00-12:00' },
        { day: 'Wednesday', time: '14:00-16:00' }
      ]
    });

    console.log('🎉 Dummy data inserted successfully!');
  } catch (err) {
    console.error('❌ Error inserting data:', err.message);
  } finally {
    await mongoose.disconnect(); // ✅ modern disconnect (no callback)
    console.log('🔌 MongoDB disconnected');
  }
}

seedData();
