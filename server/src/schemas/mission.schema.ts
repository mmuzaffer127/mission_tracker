import { z } from 'zod';

export const CreateMissionSchema = z.object({
  title: z.string().min(2, 'Title must be at least 2 characters').max(140),
  description: z.string().optional().default(''),
  category_id: z.string().uuid().optional().nullable(),
  goal_id: z.string().uuid().optional().nullable(),
  priority: z.enum(['low', 'medium', 'high', 'critical']).default('medium'),
  status: z.enum(['not_started', 'in_progress', 'completed', 'on_hold', 'cancelled']).default('not_started'),
  start_date: z.string().optional(),
  deadline: z.string().optional().nullable(),
  is_recurring: z.boolean().optional().default(false),
  recurrence_rule: z.string().optional(),
  subtasks: z.array(z.string().min(1)).optional().default([])
});

export const UpdateMissionSchema = CreateMissionSchema.partial().extend({
  progress_percentage: z.number().min(0).max(100).optional(),
  is_archived: z.boolean().optional()
});

export const UpdateMissionStatusSchema = z.object({
  status: z.enum(['not_started', 'in_progress', 'completed', 'on_hold', 'cancelled'])
});

export const CreateSubtaskSchema = z.object({
  title: z.string().min(1, 'Subtask title cannot be empty')
});

export const ToggleSubtaskSchema = z.object({
  is_completed: z.boolean()
});
