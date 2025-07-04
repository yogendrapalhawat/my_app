// backend/app.js

import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';

import userRoutes from './routes/userRoutes.js';
import eventRoutes from './routes/eventRoutes.js';

dotenv.config(); // ✅ Load .env variables like MONGO_URI and JWT_SECRET

const app = express();

// ✅ Middlewares
app.use(cors()); // Allows frontend to communicate with backend (CORS enabled)
app.use(express.json()); // Automatically parses incoming JSON payloads

// ✅ Connect to MongoDB Atlas
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ MongoDB Atlas Connected'))
.catch((err) => console.error('❌ MongoDB Error:', err.message));

// ✅ API Routes (as per your folder structure)
app.use('/api/users', userRoutes);   // All user-related routes: register, login, profile, etc.
app.use('/api/events', eventRoutes); // All event-related routes: create, register, leave, etc.

// ✅ Default route (optional health check)
app.get('/', (req, res) => {
  res.send('🎓 One Portal Backend is Running');
});

// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
