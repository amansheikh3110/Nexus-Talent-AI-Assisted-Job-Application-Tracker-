import app from '../src/index';
import connectDB from '../src/lib/db';

/**
 * Vercel Serverless Entry Point
 * Ensures database is connected BEFORE handling the express request.
 */
export default async (req: any, res: any) => {
  try {
    await connectDB();
    return app(req, res);
  } catch (error) {
    console.error('❌ Vercel Function Error:', error);
    res.status(500).json({ error: 'Database connection failed' });
  }
};
