// backend/app.js

import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';

// ✅ Import Routes
import userRoutes from './routes/userRoutes.js';
import eventRoutes from './routes/eventRoutes.js';

dotenv.config(); // Load environment variables from .env

const app = express();

// ✅ Middleware: Enable CORS for frontend (local + deployed)
app.use(cors({
  origin: ['http://localhost:3000', 'https://one-portal-frontend.onrender.com'], // <-- apne frontend ka correct deployed URL
  credentials: true
}));

// ✅ Middleware: Parse JSON request bodies
app.use(express.json());

// ✅ Connect to MongoDB Atlas
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ MongoDB Atlas Connected'))
.catch((err) => console.error('❌ MongoDB Error:', err));

// ✅ Routes
app.use('/api/users', userRoutes);   // All user related routes
app.use('/api/events', eventRoutes); // All event related routes

// ✅ Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
