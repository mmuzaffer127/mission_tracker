import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.middleware.js';
import { dbStore } from '../services/store.js';

export async function getDashboardSummary(req: AuthenticatedRequest, res: Response) {
  try {
    const userId = req.userId!;
    const summary = dbStore.getDashboardSummary(userId);
    res.json({ success: true, data: summary });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
}

export async function getLifeBalanceWheel(req: AuthenticatedRequest, res: Response) {
  try {
    // 8 quadrants of life balance
    const categories = [
      { subject: 'Career', score: 8.5, fullMark: 10 },
      { subject: 'Education', score: 9.0, fullMark: 10 },
      { subject: 'Health', score: 7.5, fullMark: 10 },
      { subject: 'Relationships', score: 7.0, fullMark: 10 },
      { subject: 'Financial Growth', score: 8.0, fullMark: 10 },
      { subject: 'Personal Dev', score: 9.5, fullMark: 10 },
      { subject: 'Creativity', score: 8.5, fullMark: 10 },
      { subject: 'Spiritual / Values', score: 7.8, fullMark: 10 }
    ];
    res.json({ success: true, data: categories });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
}

export async function getHeatmap(req: AuthenticatedRequest, res: Response) {
  try {
    const userId = req.userId!;
    // Generate dates for current year
    const checkins = dbStore.checkins.filter((c) => c.user_id === userId);
    const dateCounts: Record<string, number> = {};
    for (const c of checkins) {
      dateCounts[c.checkin_date] = (dateCounts[c.checkin_date] || 0) + 1;
    }
    res.json({ success: true, data: dateCounts });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
}

