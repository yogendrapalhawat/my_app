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

// ✅ CORS Configuration for Netlify & localhost
const corsOptions = {
  origin: ['http://localhost:3000', 'https://scintillating-pie-e7e24e.netlify.app'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

// ✅ Apply middlewares
app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // Handle preflight
app.use(express.json()); // Parse incoming JSON

// ✅ Routes
app.use('/api/users', userRoutes);
app.use('/api/events', eventRoutes);

// ✅ Root Route
app.get('/', (req, res) => {
  res.send('🎓 One Portal API is Running...');
});

// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
