import React, { useEffect, useState } from 'react';
import {
  Target,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Trash2,
  Sparkles,
  Columns,
  List
} from 'lucide-react';
import { api } from '../lib/api.js';
import { Mission, MissionPriority, MissionStatus } from '../types/index.js';
import { StatusBadge } from '../components/ui/StatusBadge.js';
import { CreateMissionModal } from '../components/missions/CreateMissionModal.js';
import { useSound } from '../contexts/SoundContext.js';

export const MissionsPage: React.FC = () => {
  const [missions, setMissions] = useState<Mission[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'kanban' | 'table'>('kanban');
  const [search, setSearch] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { playComplete, playClick } = useSound();

  const fetchMissions = async () => {
    try {
      setLoading(true);
      const res = await api.getMissions({
        search: search || undefined,
        priority: priorityFilter !== 'all' ? priorityFilter : undefined,
        status: statusFilter !== 'all' ? statusFilter : undefined
      });
      setMissions(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMissions();
  }, [search, priorityFilter, statusFilter]);

  const handleStatusChange = async (id: string, newStatus: MissionStatus) => {
    try {
      playClick();
      await api.updateMission(id, { status: newStatus });
      if (newStatus === 'completed') playComplete();
      fetchMissions();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this mission?')) return;
    try {
      playClick();
      await api.deleteMission(id);
      fetchMissions();
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubtaskToggle = async (missionId: string, subtaskId: string, current: boolean) => {
    try {
      playClick();
      await api.toggleSubtask(missionId, subtaskId, !current);
      if (!current) playComplete();
      fetchMissions();
    } catch (err) {
      console.error(err);
    }
  };

  const columns: { status: MissionStatus; title: string; color: string }[] = [
    { status: 'not_started', title: 'Not Started', color: 'border-gray-500/30' },
    { status: 'in_progress', title: 'In Progress', color: 'border-blue-500/30' },
    { status: 'on_hold', title: 'On Hold', color: 'border-amber-500/30' },
    { status: 'completed', title: 'Completed', color: 'border-emerald-500/30' }
  ];

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center space-x-2">
            <Target className="w-6 h-6 text-brand-blue" />
            <span>Mission Management HQ</span>
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Break big ambitions into tactical missions and execute with military discipline.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          {/* View Mode Toggle */}
          <div className="flex items-center p-1 rounded-xl bg-surface-100 border border-surface-border">
            <button
              onClick={() => setViewMode('kanban')}
              className={`p-1.5 rounded-lg text-xs transition-colors ${
                viewMode === 'kanban' ? 'bg-surface-50 text-brand-blue font-bold shadow-sm' : 'text-gray-400 hover:text-white'
              }`}
              title="Kanban Board View"
            >
              <Columns className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg text-xs transition-colors ${
                viewMode === 'table' ? 'bg-surface-50 text-brand-blue font-bold shadow-sm' : 'text-gray-400 hover:text-white'
              }`}
              title="Table View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-gradient-to-r from-brand-blue to-blue-600 text-white text-xs font-semibold shadow-glow hover:brightness-110 active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Create Mission</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-2xl bg-surface-100/60 border border-surface-border">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search missions by keyword..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-surface-50 border border-surface-border text-white text-xs focus:outline-none focus:border-brand-blue"
          />
        </div>

        <div className="flex items-center space-x-2">
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-surface-50 border border-surface-border text-xs text-gray-300 focus:outline-none"
          >
            <option value="all">All Priorities</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-surface-50 border border-surface-border text-xs text-gray-300 focus:outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="not_started">Not Started</option>
            <option value="in_progress">In Progress</option>
            <option value="on_hold">On Hold</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>

      {/* Render View Mode */}
      {viewMode === 'kanban' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {columns.map((col) => {
            const colMissions = missions.filter((m) => m.status === col.status);
            return (
              <div
                key={col.status}
                className="flex flex-col bg-surface-200/60 rounded-2xl border border-surface-border p-4 min-h-[500px]"
              >
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-surface-border">
                  <div className="flex items-center space-x-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-brand-blue" />
                    <h3 className="text-xs font-bold text-gray-200 uppercase tracking-wider">{col.title}</h3>
                  </div>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-surface-100 border border-surface-border text-gray-400 font-mono">
                    {colMissions.length}
                  </span>
                </div>

                <div className="flex-1 space-y-3 overflow-y-auto">
                  {colMissions.map((mission) => (
                    <div
                      key={mission.id}
                      className="p-4 rounded-xl bg-surface-100/80 border border-surface-border hover:border-brand-blue/40 transition-all shadow-card space-y-3"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <StatusBadge priority={mission.priority} />
                        <button
                          onClick={() => handleDelete(mission.id)}
                          className="text-gray-500 hover:text-rose-400 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div>
                        <h4 className="text-sm font-semibold text-white">{mission.title}</h4>
                        {mission.description && (
                          <p className="text-xs text-gray-400 mt-1 line-clamp-2">{mission.description}</p>
                        )}
                      </div>

                      {/* Subtasks */}
                      {mission.subtasks && mission.subtasks.length > 0 && (
                        <div className="pt-2 border-t border-surface-border/50 space-y-1.5">
                          {mission.subtasks.map((st) => (
                            <label
                              key={st.id}
                              className="flex items-center space-x-2 text-xs text-gray-300 cursor-pointer select-none"
                            >
                              <input
                                type="checkbox"
                                checked={st.is_completed}
                                onChange={() => handleSubtaskToggle(mission.id, st.id, st.is_completed)}
                                className="rounded border-surface-border bg-surface-50 text-brand-blue focus:ring-0"
                              />
                              <span className={st.is_completed ? 'line-through text-gray-500 text-[11px]' : 'text-[11px]'}>
                                {st.title}
                              </span>
                            </label>
                          ))}
                        </div>
                      )}

                      {/* Card Footer */}
                      <div className="flex items-center justify-between pt-2 border-t border-surface-border text-[11px]">
                        <select
                          value={mission.status}
                          onChange={(e) => handleStatusChange(mission.id, e.target.value as MissionStatus)}
                          className="bg-surface-50 border border-surface-border text-gray-300 rounded px-2 py-0.5 text-[10px] focus:outline-none"
                        >
                          <option value="not_started">Not Started</option>
                          <option value="in_progress">In Progress</option>
                          <option value="on_hold">On Hold</option>
                          <option value="completed">Completed</option>
                        </select>
                        <span className="font-mono text-brand-cyan">{mission.progress_percentage}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Table View */
        <div className="glass-panel rounded-2xl overflow-hidden border border-surface-border">
          <table className="w-full text-left text-xs">
            <thead className="bg-surface-100 text-gray-400 uppercase font-mono tracking-wider border-b border-surface-border">
              <tr>
                <th className="py-3 px-4">Mission</th>
                <th className="py-3 px-4">Priority</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Progress</th>
                <th className="py-3 px-4">Deadline</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border">
              {missions.map((m) => (
                <tr key={m.id} className="hover:bg-surface-50/50 transition-colors">
                  <td className="py-3 px-4 font-semibold text-gray-200">{m.title}</td>
                  <td className="py-3 px-4"><StatusBadge priority={m.priority} /></td>
                  <td className="py-3 px-4"><StatusBadge status={m.status} /></td>
                  <td className="py-3 px-4 font-mono text-brand-cyan">{m.progress_percentage}%</td>
                  <td className="py-3 px-4 text-gray-400">{m.deadline ? new Date(m.deadline).toLocaleDateString() : '—'}</td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => handleDelete(m.id)}
                      className="text-gray-500 hover:text-rose-400 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Creation Modal */}
      <CreateMissionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onMissionCreated={fetchMissions}
      />
    </div>
  );
};
