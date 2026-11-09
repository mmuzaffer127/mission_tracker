import { Router } from 'express';
import { getHabits, createHabit, checkinHabit, updateHabit, deleteHabit } from '../controllers/habit.controller.js';
import { authenticateUser } from '../middleware/auth.middleware.js';
import { validateBody } from '../middleware/validate.middleware.js';
import { CreateHabitSchema, HabitCheckinSchema, UpdateHabitSchema } from '../schemas/habit.schema.js';

const router = Router();

router.use(authenticateUser);

router.get('/', getHabits);
router.post('/', validateBody(CreateHabitSchema), createHabit);
router.put('/:id', validateBody(UpdateHabitSchema), updateHabit);
router.delete('/:id', deleteHabit);
router.post('/:id/checkin', validateBody(HabitCheckinSchema), checkinHabit);

export default router;

