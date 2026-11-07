import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.middleware.js';
import { dbStore } from '../services/store.js';

export async function getGoals(req: AuthenticatedRequest, res: Response) {
  try {
    const userId = req.userId!;
    const goals = dbStore.getGoals(userId);
    res.json({ success: true, data: goals });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
}

export async function createGoal(req: AuthenticatedRequest, res: Response) {
  try {
    const userId = req.userId!;
    const goal = dbStore.createGoal(userId, req.body);
    res.status(201).json({ success: true, data: goal });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
}

export async function toggleMilestone(req: AuthenticatedRequest, res: Response) {
  try {
    const userId = req.userId!;
    const goalId = req.params.id as string;
    const milestoneId = req.params.milestoneId as string;
    const { is_completed } = req.body;

    const updatedGoal = dbStore.toggleMilestone(userId, goalId, milestoneId, is_completed);
    if (!updatedGoal) {
      return res.status(404).json({ success: false, error: 'Goal or Milestone not found' });
    }
    res.json({ success: true, data: updatedGoal });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
}
