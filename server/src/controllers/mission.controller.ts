import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.middleware.js';
import { dbStore } from '../services/store.js';

export async function getMissions(req: AuthenticatedRequest, res: Response) {
  try {
    const userId = req.userId!;
    const { status, priority, search } = req.query;

    let missions = dbStore.getMissions(userId);

    if (status && typeof status === 'string') {
      missions = missions.filter((m) => m.status === status);
    }
    if (priority && typeof priority === 'string') {
      missions = missions.filter((m) => m.priority === priority);
    }
    if (search && typeof search === 'string') {
      const q = search.toLowerCase();
      missions = missions.filter((m) => m.title.toLowerCase().includes(q) || m.description?.toLowerCase().includes(q));
    }

    res.json({ success: true, data: missions });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
}

export async function createMission(req: AuthenticatedRequest, res: Response) {
  try {
    const userId = req.userId!;
    const mission = dbStore.createMission(userId, req.body);
    res.status(201).json({ success: true, data: mission });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
}

export async function getMissionById(req: AuthenticatedRequest, res: Response) {
  try {
    const userId = req.userId!;
    const mission = dbStore.getMissionById(userId, req.params.id as string);
    if (!mission) {
      return res.status(404).json({ success: false, error: 'Mission not found' });
    }
    res.json({ success: true, data: mission });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
}

export async function updateMission(req: AuthenticatedRequest, res: Response) {
  try {
    const userId = req.userId!;
    const updated = dbStore.updateMission(userId, req.params.id as string, req.body);
    if (!updated) {
      return res.status(404).json({ success: false, error: 'Mission not found' });
    }
    res.json({ success: true, data: updated });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
}

export async function deleteMission(req: AuthenticatedRequest, res: Response) {
  try {
    const userId = req.userId!;
    const deleted = dbStore.deleteMission(userId, req.params.id as string);
    if (!deleted) {
      return res.status(404).json({ success: false, error: 'Mission not found' });
    }
    res.json({ success: true, message: 'Mission deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
}

export async function toggleSubtask(req: AuthenticatedRequest, res: Response) {
  try {
    const userId = req.userId!;
    const missionId = req.params.id as string;
    const subtaskId = req.params.subtaskId as string;
    const { is_completed } = req.body;

    const updatedMission = dbStore.toggleSubtask(userId, missionId, subtaskId, is_completed);
    if (!updatedMission) {
      return res.status(404).json({ success: false, error: 'Mission or Subtask not found' });
    }
    res.json({ success: true, data: updatedMission });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
}
