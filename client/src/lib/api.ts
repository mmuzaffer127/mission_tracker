const API_BASE = '/api';

export async function fetchApi<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem('mission_os_token');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {})
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers
  });

  const json = await response.json();
  if (!response.ok) {
    throw new Error(json.error || `Request failed with status ${response.status}`);
  }
  return json.data as T;
}

export const api = {
  // Dashboard & Analytics
  getDashboardSummary: () => fetchApi<any>('/analytics/dashboard-summary'),
  getLifeBalanceWheel: () => fetchApi<any[]>('/analytics/life-balance-wheel'),
  getHeatmap: () => fetchApi<Record<string, number>>('/analytics/heatmap'),

  // Missions
  getMissions: (params?: { status?: string; priority?: string; search?: string }) => {
    const q = new URLSearchParams();
    if (params?.status) q.append('status', params.status);
    if (params?.priority) q.append('priority', params.priority);
    if (params?.search) q.append('search', params.search);
    const queryStr = q.toString() ? `?${q.toString()}` : '';
    return fetchApi<any[]>(`/missions${queryStr}`);
  },
  createMission: (data: any) => fetchApi<any>('/missions', { method: 'POST', body: JSON.stringify(data) }),
  updateMission: (id: string, data: any) => fetchApi<any>(`/missions/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteMission: (id: string) => fetchApi<void>(`/missions/${id}`, { method: 'DELETE' }),
  toggleSubtask: (missionId: string, subtaskId: string, is_completed: boolean) =>
    fetchApi<any>(`/missions/${missionId}/subtasks/${subtaskId}`, {
      method: 'PATCH',
      body: JSON.stringify({ is_completed })
    }),

  // Goals
  getGoals: () => fetchApi<any[]>('/goals'),
  createGoal: (data: any) => fetchApi<any>('/goals', { method: 'POST', body: JSON.stringify(data) }),
  toggleMilestone: (goalId: string, milestoneId: string, is_completed: boolean) =>
    fetchApi<any>(`/goals/${goalId}/milestones/${milestoneId}`, {
      method: 'PATCH',
      body: JSON.stringify({ is_completed })
    }),

  // Habits
  getHabits: () => fetchApi<any[]>('/habits'),
  createHabit: (data: any) => fetchApi<any>('/habits', { method: 'POST', body: JSON.stringify(data) }),
  checkinHabit: (id: string, date: string, count = 1, notes?: string) =>
    fetchApi<any>(`/habits/${id}/checkin`, {
      method: 'POST',
      body: JSON.stringify({ checkin_date: date, count, notes })
    }),

  // Achievements
  getAchievements: (month?: string) => fetchApi<any[]>(`/achievements${month ? `?month=${month}` : ''}`),
  createAchievement: (data: any) => fetchApi<any>('/achievements', { method: 'POST', body: JSON.stringify(data) }),

  // AI
  generateRoadmap: (ambition: string, context?: string) =>
    fetchApi<any>('/ai/generate-roadmap', {
      method: 'POST',
      body: JSON.stringify({ ambition, context })
    }),
  generateMonthlySynthesis: (yearMonth: string) =>
    fetchApi<any>('/ai/monthly-synthesis', {
      method: 'POST',
      body: JSON.stringify({ yearMonth })
    })
};
