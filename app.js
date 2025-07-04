// backend/app.js

import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';

import userRoutes from './routes/userRoutes.js';
import eventRoutes from './routes/eventRoutes.js';

dotenv.config(); // 🔐 Load .env variables

const app = express();

// ✅ Enable CORS (for local + Vercel frontend access)
app.use(
  cors({
    origin: [
      'http://localhost:3000',
      'https://frontend2-phi-sepia.vercel.app'
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true, // Required for cookies or auth headers
  })
);

// ✅ Handle preflight requests
app.options('*', cors());

// ✅ Body parser (to parse JSON)
app.use(express.json());

// ✅ Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('✅ MongoDB Atlas Connected'))
  .catch((err) => console.error('❌ MongoDB Connection Error:', err.message));

// ✅ Routes
app.use('/api/users', userRoutes);
app.use('/api/events', eventRoutes);

// ✅ Default route
app.get('/', (req, res) => {
  res.send('🎉 API is running...');
});

// ✅ Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
