// backend/server.js

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';

import userRoutes from './routes/userRoutes.js';
import eventRoutes from './routes/eventRoutes.js';

// ✅ Load environment variables
dotenv.config();

// ✅ Connect to MongoDB
connectDB();

const app = express();

// ✅ CORS Configuration
app.use(
  cors({
    origin: [
      'http://localhost:3000',                          // Local React frontend
      'https://frontend2-phi-sepia.vercel.app'          // Deployed frontend
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true                                   // Allow cookies if used
  })
);

// ✅ Handle Preflight (OPTIONS) Requests for all routes
app.options('*', cors());

// ✅ Middleware to parse incoming JSON
app.use(express.json());

// ✅ API Routes
app.use('/api/users', userRoutes);    // Login, Register, Profile
app.use('/api/events', eventRoutes);  // Create, Join, Leave events

// ✅ Health Check Route
app.get('/', (req, res) => {
  res.send('🎓 One Portal API is Running...');
});

// ✅ Start the Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
