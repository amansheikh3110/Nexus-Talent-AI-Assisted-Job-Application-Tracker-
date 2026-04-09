import { Router, Response } from 'express';
import Application from '../models/Application';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router();
router.use(authenticate);

// Get all applications for the logged-in user
router.get('/', async (req: AuthRequest, res: Response) => {
  try {
    const apps = await Application.find({ user: req.user?.userId }).sort({ createdAt: -1 });
    res.json(apps);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch applications' });
  }
});

// Create new application
router.post('/', async (req: AuthRequest, res: Response) => {
  try {
    const newApp = new Application({ ...req.body, user: req.user?.userId });
    const savedApp = await newApp.save();
    res.status(201).json(savedApp);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create application' });
  }
});

// Update application (e.g. status change)
router.put('/:id', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const updatedApp = await Application.findOneAndUpdate(
      { _id: req.params.id, user: req.user?.userId },
      { $set: req.body },
      { new: true }
    );
    if (!updatedApp) { res.status(404).json({ error: 'Not found' }); return; }
    res.json(updatedApp);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update application' });
  }
});

// Delete application
router.delete('/:id', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const deletedApp = await Application.findOneAndDelete({ _id: req.params.id, user: req.user?.userId });
    if (!deletedApp) { res.status(404).json({ error: 'Not found' }); return; }
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete application' });
  }
});

export default router;
