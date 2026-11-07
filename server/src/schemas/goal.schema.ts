import { z } from 'zod';

export const CreateGoalSchema = z.object({
  title: z.string().min(3, 'Goal title must be at least 3 characters').max(150),
  description: z.string().optional().default(''),
  category_id: z.string().uuid().optional().nullable(),
  timeframe: z.enum(['daily', 'weekly', 'monthly', 'quarterly', 'annual', 'long_term']).default('quarterly'),
  target_date: z.string().optional().nullable(),
  milestones: z.array(z.string().min(1)).optional().default([])
});

export const UpdateGoalSchema = CreateGoalSchema.partial().extend({
  is_achieved: z.boolean().optional(),
  progress_percentage: z.number().min(0).max(100).optional()
});

export const CreateMilestoneSchema = z.object({
  title: z.string().min(1, 'Milestone title cannot be empty'),
  order_index: z.number().optional().default(0)
});
