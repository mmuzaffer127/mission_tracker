import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.middleware.js';
import { getGeminiAI } from '../config/gemini.js';
import { dbStore } from '../services/store.js';

export async function generateRoadmap(req: AuthenticatedRequest, res: Response) {
  try {
    const { ambition, context } = req.body;
    const ai = getGeminiAI();

    if (ai) {
      try {
        const prompt = `
          You are the Mission OS AI Personal Growth Strategist.
          Ambition: "${ambition}"
          Context: "${context || 'Personal growth'}"

          Break this ambition into a master roadmap.
          Return ONLY valid JSON matching this structure:
          {
            "goalTitle": "string",
            "timeframe": "quarterly",
            "milestones": [
              { "title": "string", "order": 0 }
            ],
            "actionableMissions": [
              {
                "title": "string",
                "priority": "high",
                "subtasks": ["subtask 1", "subtask 2"]
              }
            ]
          }
        `;

        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json'
          }
        });

        const parsed = JSON.parse(response.text || '{}');
        return res.json({ success: true, data: parsed });
      } catch (geminiError) {
        console.warn('[Gemini AI] Call failed, fallback to structured heuristic template:', geminiError);
      }
    }

    // High quality intelligent heuristic fallback when API key is not configured
    const sampleMilestones = [
      { title: `Foundational Research & Skill Mapping for ${ambition}`, order: 0 },
      { title: `Execute Hands-on Core Execution Phase`, order: 1 },
      { title: `Build Benchmark Portfolio / Proof of Work`, order: 2 },
      { title: `Review, Measure Metrics & Scale Mastery`, order: 3 }
    ];

    const sampleMissions = [
      {
        title: `Phase 1 Discovery: Setup environment for ${ambition}`,
        priority: 'high',
        subtasks: ['Document core requirements', 'Acquire necessary tools and documentation', 'Complete initial kickoff sprint']
      },
      {
        title: `Phase 2 Execution: Core Milestone Sprint`,
        priority: 'critical',
        subtasks: ['Implement core deliverable', 'Validate progress against quality criteria', 'Review output']
      }
    ];

    res.json({
      success: true,
      data: {
        goalTitle: ambition,
        timeframe: 'quarterly',
        milestones: sampleMilestones,
        actionableMissions: sampleMissions
      }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
}

export async function generateMonthlySynthesis(req: AuthenticatedRequest, res: Response) {
  try {
    const userId = req.userId!;
    const { yearMonth } = req.body;
    const summary = dbStore.getDashboardSummary(userId);
    const achievements = dbStore.getAchievements(userId, yearMonth);

    const ai = getGeminiAI();
    if (ai) {
      try {
        const prompt = `
          You are the Mission OS Executive Life Architect.
          Monthly Accomplishments for ${yearMonth}:
          - Total XP: ${summary.xp}
          - User Level: ${summary.level}
          - Missions Completed: ${summary.missions.completed}
          - Habit Average Streak: ${summary.habits.averageStreak} days
          - Unlocked Breakthroughs: ${achievements.map((a) => a.title).join(', ') || 'Consistent execution'}

          Generate a 3-paragraph executive reflection:
          1. Synthesis of primary wins and momentum.
          2. Constructive evaluation of potential bottlenecks.
          3. 3 Strategic focus directives for next month.
        `;

        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt
        });

        return res.json({ success: true, data: { reportMarkdown: response.text } });
      } catch (geminiError) {
        console.warn('[Gemini AI] Call failed, fallback to template:', geminiError);
      }
    }

    const report = `### Mission OS Executive Monthly Briefing — ${yearMonth}

**1. Wins & Momentum**
During this cycle, you maintained an average consistency streak of **${summary.habits.averageStreak} days** across your daily growth habits and successfully completed **${summary.missions.completed} missions**. Your current level is **${summary.level}** with **${summary.xp} XP** accumulated.

**2. Tactical Analysis**
Execution rate on high-priority missions remains solid. Habit retention is high in technical deep-work quadrants, with opportunities to stabilize evening wind-down rituals.

**3. Directives for Next Cycle**
- Target completion of upcoming quarterly milestones.
- Keep deep work sessions protected from context-switching.
- Double down on recording evidence for all major breakthroughs.`;

    res.json({ success: true, data: { reportMarkdown: report } });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
}

