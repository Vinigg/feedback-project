import { Router } from 'express';
import { analyzeFeedbacks } from '../controllers/ai.controller';

const router = Router();

router.post('/analyze-feedbacks', analyzeFeedbacks);

export default router;
