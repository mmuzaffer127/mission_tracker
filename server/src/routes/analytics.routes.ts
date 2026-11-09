import { Router } from 'express';
import { getDashboardSummary, getLifeBalanceWheel, getHeatmap } from '../controllers/analytics.controller.js';
import { authenticateUser } from '../middleware/auth.middleware.js';

const router = Router();

router.use(authenticateUser);

router.get('/dashboard-summary', getDashboardSummary);
router.get('/life-balance-wheel', getLifeBalanceWheel);
router.get('/heatmap', getHeatmap);

export default router;

