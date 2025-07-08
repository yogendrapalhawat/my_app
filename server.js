// backend/server.js

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';

import userRoutes from './routes/userRoutes.js';
import eventRoutes from './routes/eventRoutes.js';

// ✅ Load env variables
dotenv.config();

// ✅ Connect to MongoDB
connectDB();

const app = express();

// ✅ CORS Fix: Allow local + deployed frontend & handle preflight
const allowedOrigins = [
  'http://localhost:3000',
  'https://frontend2-phi-sepia.vercel.app'
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('CORS Not Allowed'));
      }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true
  })
);

// ✅ Handle preflight requests
app.options('*', cors());

// ✅ Middleware
app.use(express.json());

// ✅ Routes
app.use('/api/users', userRoutes);
app.use('/api/events', eventRoutes);

// ✅ Test route
app.get('/', (req, res) => {
  res.send('🎓 One Portal API is Running...');
});

// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
