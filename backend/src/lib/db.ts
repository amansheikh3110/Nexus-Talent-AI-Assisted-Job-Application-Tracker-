import mongoose from 'mongoose';

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/job-tracker';

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development and serverless function invocations in production.
 */
let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGO_URI, opts).then((mongoose) => {
      console.log('✅ New MongoDB Connection established');
      return mongoose;
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
