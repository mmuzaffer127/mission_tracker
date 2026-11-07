export function calculateMissionProgress(subtasks: { is_completed: boolean }[]): number {
  if (subtasks.length === 0) return 0;
  const completed = subtasks.filter((st) => st.is_completed).length;
  return Number(((completed / subtasks.length) * 100).toFixed(1));
}

export function calculateGoalProgress(
  milestones: { is_completed: boolean }[],
  missions: { progress_percentage: number }[]
): number {
  const hasMilestones = milestones.length > 0;
  const hasMissions = missions.length > 0;

  if (!hasMilestones && !hasMissions) return 0;

  let milestoneProgress = 0;
  if (hasMilestones) {
    const completed = milestones.filter((m) => m.is_completed).length;
    milestoneProgress = (completed / milestones.length) * 100;
  }

  let missionProgress = 0;
  if (hasMissions) {
    const total = missions.reduce((acc, m) => acc + Number(m.progress_percentage), 0);
    missionProgress = total / missions.length;
  }

  if (hasMilestones && hasMissions) {
    return Number((milestoneProgress * 0.5 + missionProgress * 0.5).toFixed(1));
  }
  return Number((hasMilestones ? milestoneProgress : missionProgress).toFixed(1));
}

export function calculateHabitStreak(
  checkinDates: string[],
  todayStr: string,
  yesterdayStr: string
): { currentStreak: number; longestStreak: number } {
  if (checkinDates.length === 0) return { currentStreak: 0, longestStreak: 0 };

  const uniqueDates = Array.from(new Set(checkinDates)).sort().reverse();
  const mostRecent = uniqueDates[0];

  let currentStreak = 0;
  if (mostRecent === todayStr || mostRecent === yesterdayStr) {
    let expectedDate = new Date(mostRecent);
    for (const dateStr of uniqueDates) {
      const actualDate = new Date(dateStr);
      const diffDays = Math.round((expectedDate.getTime() - actualDate.getTime()) / (1000 * 3600 * 24));
      if (diffDays === 0) {
        currentStreak++;
        expectedDate.setDate(expectedDate.getDate() - 1);
      } else {
        break;
      }
    }
  }

  let longestStreak = 0;
  let running = 0;
  let prevDate: Date | null = null;

  const chronological = [...uniqueDates].reverse();
  for (const dateStr of chronological) {
    const currDate = new Date(dateStr);
    if (!prevDate) {
      running = 1;
    } else {
      const diff = Math.round((currDate.getTime() - prevDate.getTime()) / (1000 * 3600 * 24));
      if (diff === 1) {
        running++;
      } else {
        running = 1;
      }
    }
    if (running > longestStreak) longestStreak = running;
    prevDate = currDate;
  }

  return { currentStreak, longestStreak: Math.max(longestStreak, currentStreak) };
}
