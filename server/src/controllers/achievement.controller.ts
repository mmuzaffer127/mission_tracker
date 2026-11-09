import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.middleware.js';
import { dbStore } from '../services/store.js';

export async function getAchievements(req: AuthenticatedRequest, res: Response) {
  try {
    const userId = req.userId!;
    const yearMonth = req.query.month as string | undefined;
    const achievements = dbStore.getAchievements(userId, yearMonth);
    res.json({ success: true, data: achievements });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
}

export async function createAchievement(req: AuthenticatedRequest, res: Response) {
  try {
    const userId = req.userId!;
    const achievement = dbStore.createAchievement(userId, req.body);
    res.status(201).json({ success: true, data: achievement });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
}

