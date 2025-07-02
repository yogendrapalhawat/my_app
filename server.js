// backend/server.js or backend/index.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js'; // adjust path if needed

import userRoutes from './routes/userRoutes.js';
import eventRoutes from './routes/eventRoutes.js'; // ✅ Import event routes

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json()); // to parse JSON bodies

// ✅ Mount API routes
app.use('/api/users', userRoutes);
app.use('/api/events', eventRoutes);  // ✅ This line links events backend

// ✅ Basic test route
app.get('/', (req, res) => {
  res.send('API is running...');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
