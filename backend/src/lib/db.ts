import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Ensure environment variables are loaded
dotenv.config();

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development and serverless function invocations in production.
 */
let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

async function connectDB() {
  const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/job-tracker';

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGO_URI, opts).then((mongooseInstance) => {
      console.log('✅ New MongoDB Connection established');
      return mongooseInstance;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default connectDB;
