import { Router } from 'express';
import {
  getMissions,
  createMission,
  getMissionById,
  updateMission,
  deleteMission,
  toggleSubtask
} from '../controllers/mission.controller.js';
import { authenticateUser } from '../middleware/auth.middleware.js';
import { validateBody } from '../middleware/validate.middleware.js';
import {
  CreateMissionSchema,
  UpdateMissionSchema,
  ToggleSubtaskSchema
} from '../schemas/mission.schema.js';

const router = Router();

router.use(authenticateUser);

router.get('/', getMissions);
router.post('/', validateBody(CreateMissionSchema), createMission);
router.get('/:id', getMissionById);
router.put('/:id', validateBody(UpdateMissionSchema), updateMission);
router.delete('/:id', deleteMission);
router.patch('/:id/subtasks/:subtaskId', validateBody(ToggleSubtaskSchema), toggleSubtask);

export default router;

