import { Router } from 'express';
import missionRoutes from './mission.routes.js';
import goalRoutes from './goal.routes.js';
import habitRoutes from './habit.routes.js';
import achievementRoutes from './achievement.routes.js';
import analyticsRoutes from './analytics.routes.js';
import aiRoutes from './ai.routes.js';

const router = Router();

router.use('/missions', missionRoutes);
router.use('/goals', goalRoutes);
router.use('/habits', habitRoutes);
router.use('/achievements', achievementRoutes);
router.use('/analytics', analyticsRoutes);
router.use('/ai', aiRoutes);

router.get('/health', (req, res) => {
  res.json({
    status: 'online',
    system: 'MISSION OS Enterprise Core',
    timestamp: new Date().toISOString()
  });
});

export default router;
