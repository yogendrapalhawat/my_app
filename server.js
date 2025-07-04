// backend/server.js

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';

import userRoutes from './routes/userRoutes.js';
import eventRoutes from './routes/eventRoutes.js';

// ✅ Load .env variables
dotenv.config();

// ✅ Connect to MongoDB
connectDB();

const app = express();

// ✅ CORS Config (allows localhost + Vercel frontend)
app.use(
  cors({
    origin: [
      'http://localhost:3000',
      'https://frontend2-phi-sepia.vercel.app'
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
  })
);

// ✅ Parse incoming JSON
app.use(express.json());

// ✅ Routes
app.use('/api/users', userRoutes);   // Register, Login, Profile, etc.
app.use('/api/events', eventRoutes); // Create, Join, Leave, List events

// ✅ Health Check Route
app.get('/', (req, res) => {
  res.send('🎓 One Portal API is Running...');
});

// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
