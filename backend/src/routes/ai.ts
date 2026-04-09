import { Router, Response } from 'express';
import { authenticate, AuthRequest } from '../middleware/auth';
import { parseJobDescription, generateResumeSuggestions } from '../services/aiService';

const router = Router();
router.use(authenticate);

router.post('/parse', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { jdText } = req.body;
    if (!jdText) {
       res.status(400).json({ error: 'Job description text is required' });
       return;
    }

    const parsedData = await parseJobDescription(jdText);
    res.json(parsedData);
  } catch (err) {
    res.status(500).json({ error: 'AI processing failed on parse' });
  }
});

router.post('/suggestions', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { parsedData } = req.body;
    if (!parsedData) {
       res.status(400).json({ error: 'Parsed job data is required' });
       return;
    }

    const suggestions = await generateResumeSuggestions(parsedData);
    res.json({ suggestions });
  } catch (err) {
    res.status(500).json({ error: 'AI processing failed on suggestions' });
  }
});

export default router;
