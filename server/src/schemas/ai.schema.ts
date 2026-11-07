import { z } from 'zod';

export const GenerateRoadmapSchema = z.object({
  ambition: z.string().min(3, 'Ambition must be at least 3 characters').max(300),
  context: z.string().max(1000).optional().default('General growth')
});

export const MissionBreakdownSchema = z.object({
  missionTitle: z.string().min(3).max(200),
  description: z.string().optional().default('')
});

export const MonthlyReportAiSchema = z.object({
  yearMonth: z.string().regex(/^\d{4}-\d{2}$/, 'Must be YYYY-MM')
});
