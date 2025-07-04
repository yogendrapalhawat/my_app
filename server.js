// backend/server.js OR backend/index.js

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js'; // ✅ DB connection function
import userRoutes from './routes/userRoutes.js';
import eventRoutes from './routes/eventRoutes.js';

dotenv.config(); // ✅ Load environment variables from .env
connectDB();      // ✅ Connect to MongoDB

const app = express();

// ✅ Middlewares
app.use(cors());
app.use(express.json()); // To parse incoming JSON requests

// ✅ API Routes
app.use('/api/users', userRoutes);   // Login, Register, Profile, etc.
app.use('/api/events', eventRoutes); // Create, Register, Leave, MyEvents, etc.

// ✅ Health Check Route
app.get('/', (req, res) => {
  res.send('🎓 One Portal API is Running...');
});

// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
