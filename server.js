import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';

import userRoutes from './routes/userRoutes.js';
import eventRoutes from './routes/eventRoutes.js';

dotenv.config();
connectDB();

const app = express();

// ✅ Simplified CORS setup
const corsOptions = {
  origin: ['http://localhost:3000', 'https://frontend2-phi-sepia.vercel.app'],
  credentials: true
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // Handle preflight

app.use(express.json());

// ✅ Routes
app.use('/api/users', userRoutes);
app.use('/api/events', eventRoutes);

// ✅ Test Route
app.get('/', (req, res) => {
  res.send('🎓 One Portal API is Running...');
});

// ✅ Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
