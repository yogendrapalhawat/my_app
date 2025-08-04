import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';

// 🔃 Import Routes
import userRoutes from './routes/userRoutes.js';
import eventRoutes from './routes/eventRoutes.js';

dotenv.config(); // 🔐 Load environment variables from .env

const app = express();

// 🔐 Enable CORS for frontend domains (local + Vercel)
app.use(
  cors({
    origin: [
      'http://localhost:3000',
      'scintillating-pie-e7e24e.netlify.app'
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  })
);

// ✅ Preflight support
app.options('*', cors());

// ✅ Parse incoming JSON payloads
app.use(express.json());

// ✅ MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('✅ MongoDB Atlas Connected'))
  .catch((err) => console.error('❌ MongoDB Connection Error:', err.message));

// ✅ API Routes
app.use('/api/users', userRoutes);
app.use('/api/events', eventRoutes);

// ✅ Root Route
app.get('/', (req, res) => {
  res.send('🎉 API is running...');
});

// ⚠️ Optional: Handle undefined routes
app.use((req, res) => {
  res.status(404).json({ message: '🚫 Route not found' });
});

// ✅ Start the Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
