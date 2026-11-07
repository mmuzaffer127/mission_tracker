import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.middleware.js';
import { dbStore } from '../services/store.js';

export async function getHabits(req: AuthenticatedRequest, res: Response) {
  try {
    const userId = req.userId!;
    const habits = dbStore.getHabits(userId);
    res.json({ success: true, data: habits });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
}

export async function createHabit(req: AuthenticatedRequest, res: Response) {
  try {
    const userId = req.userId!;
    const habit = dbStore.createHabit(userId, req.body);
    res.status(201).json({ success: true, data: habit });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
}

export async function checkinHabit(req: AuthenticatedRequest, res: Response) {
  try {
    const userId = req.userId!;
    const habitId = req.params.id as string;
    const { checkin_date, count, notes } = req.body;

    const result = dbStore.recordHabitCheckin(userId, habitId, checkin_date, count, notes);
    if (!result) {
      return res.status(404).json({ success: false, error: 'Habit not found' });
    }
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
}
