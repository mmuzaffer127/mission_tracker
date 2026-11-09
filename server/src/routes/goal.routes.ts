import { Router } from 'express';
import { getGoals, createGoal, toggleMilestone, updateGoal, deleteGoal } from '../controllers/goal.controller.js';
import { authenticateUser } from '../middleware/auth.middleware.js';
import { validateBody } from '../middleware/validate.middleware.js';
import { CreateGoalSchema, UpdateGoalSchema } from '../schemas/goal.schema.js';

const router = Router();

router.use(authenticateUser);

router.get('/', getGoals);
router.post('/', validateBody(CreateGoalSchema), createGoal);
router.put('/:id', validateBody(UpdateGoalSchema), updateGoal);
router.delete('/:id', deleteGoal);
router.patch('/:id/milestones/:milestoneId', toggleMilestone);

export default router;

