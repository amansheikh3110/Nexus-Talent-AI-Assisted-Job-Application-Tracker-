import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './lib/db';
import authRoutes from './routes/auth';
import applicationRoutes from './routes/applications';
import aiRoutes from './routes/ai';
import userRoutes from './routes/user';

dotenv.config();

const app = express();
const allowedOrigins = process.env.FRONTEND_URL
  ? [process.env.FRONTEND_URL, 'http://localhost:5173']
  : ['http://localhost:5173'];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (e.g., mobile apps, curl, Postman)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    callback(new Error(`CORS: origin ${origin} not allowed`));
  },
  credentials: true,
}));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/jobs', applicationRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/user', userRoutes);

app.get('/api/health', (req, res) => {
  res.send('✅ AI Job Tracker API is healthy and running');
});

const PORT = process.env.PORT || 5000;

// Startup logic
if (require.main === module) {
  connectDB()
    .then(() => {
      app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
    })
    .catch((err) => {
      console.error('❌ Failed to start server:', err);
    });
}

export default app;
