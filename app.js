// backend/app.js

import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';

import userRoutes from './routes/userRoutes.js';
import eventRoutes from './routes/eventRoutes.js';

dotenv.config(); // ✅ Load .env

const app = express();
app.use(cors());
app.use(express.json());

// ✅ ONLY ONE MongoDB connection (Atlas)
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Atlas Connected'))
  .catch((err) => console.error('❌ MongoDB Error:', err));

// Routes
app.use('/api/users', userRoutes);
app.use('/api/events', eventRoutes);

// Server Listen
app.listen(5000, () => {
  console.log('🚀 Server running on http://localhost:5000');
});
