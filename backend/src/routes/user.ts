import { Router, Response } from 'express';
import User from '../models/User';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router();
router.use(authenticate);

// Get current user profile
router.get('/me', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.user?.userId).select('-passwordHash');
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// Update current user profile
router.put('/me', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { fullName, bio, avatarUrl } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      req.user?.userId,
      { $set: { fullName, bio, avatarUrl } },
      { new: true }
    ).select('-passwordHash');
    
    if (!updatedUser) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

export default router;
