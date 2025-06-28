// backend/app.js
import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';

import userRoutes from './routes/userRoutes.js';
import eventRoutes from './routes/eventRoutes.js';



dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect('mongodb://127.0.0.1:27017/my-app')
  .then(() => console.log('MongoDB Connected'))
  .catch((err) => console.error('MongoDB Error:', err));

// Routes
app.use('/api/users', userRoutes);
app.use('/api/events', eventRoutes);

// Server Listen
app.listen(5000, () => {
  console.log('Server running on http://localhost:5000');
});
mongoose.connect(process.env.MONGO_URI)
