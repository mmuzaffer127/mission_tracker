import { Router } from 'express';
import { generateRoadmap, generateMonthlySynthesis } from '../controllers/ai.controller.js';
import { authenticateUser } from '../middleware/auth.middleware.js';
import { validateBody } from '../middleware/validate.middleware.js';
import { GenerateRoadmapSchema, MonthlyReportAiSchema } from '../schemas/ai.schema.js';

const router = Router();

router.use(authenticateUser);

router.post('/generate-roadmap', validateBody(GenerateRoadmapSchema), generateRoadmap);
router.post('/monthly-synthesis', validateBody(MonthlyReportAiSchema), generateMonthlySynthesis);

export default router;
