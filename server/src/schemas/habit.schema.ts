import { z } from 'zod';

export const CreateHabitSchema = z.object({
  title: z.string().min(2, 'Habit title must be at least 2 characters').max(100),
  description: z.string().optional().default(''),
  category_id: z.string().optional().nullable(),
  frequency: z.enum(['daily', 'weekdays', 'weekends', 'custom_days']).default('daily'),
  custom_days: z.array(z.number().min(0).max(6)).optional().default([]),
  target_count_per_day: z.number().min(1).max(50).default(1)
});

export const UpdateHabitSchema = CreateHabitSchema.partial().extend({
  is_paused: z.boolean().optional(),
  is_archived: z.boolean().optional()
});

export const HabitCheckinSchema = z.object({
  checkin_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Must be in YYYY-MM-DD format'),
  count: z.number().min(1).default(1),
  notes: z.string().max(300).optional()
});

