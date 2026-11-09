import { Router } from 'express';
import { getAchievements, createAchievement } from '../controllers/achievement.controller.js';
import { authenticateUser } from '../middleware/auth.middleware.js';

const router = Router();

router.use(authenticateUser);

router.get('/', getAchievements);
router.post('/', createAchievement);

export default router;

