import { Request, Response, NextFunction } from 'express';
import { getSupabase } from '../config/supabase.js';

export interface AuthenticatedRequest extends Request {
  userId?: string;
  userEmail?: string;
}

export async function authenticateUser(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

  const supabase = getSupabase();

  if (token && supabase) {
    try {
      const { data: { user }, error } = await supabase.auth.getUser(token);
      if (!error && user) {
        req.userId = user.id;
        req.userEmail = user.email || 'user@missionos.internal';
        return next();
      }
    } catch (err) {
      console.error('[Auth Middleware] Verification error:', err);
    }
  }

  // Fallback for Local Dev / Demo Sandbox Mode (or guest/unauthenticated sessions)
  req.userId = (req.headers['x-user-id'] as string) || '00000000-0000-0000-0000-000000000001';
  req.userEmail = 'commander@missionos.dev';
  next();
}

