import React, { useEffect, useState } from 'react';
import {
  Target,
  Plus,
  Search,
  CheckCircle2,
  Trash2,
  Pencil,
  Columns,
  List
} from 'lucide-react';
import { api } from '../lib/api.js';
import { Mission, MissionPriority, MissionStatus } from '../types/index.js';
import { StatusBadge } from '../components/ui/StatusBadge.js';
import { CreateMissionModal } from '../components/missions/CreateMissionModal.js';
import { EditMissionModal } from '../components/missions/EditMissionModal.js';
import { useSound } from '../contexts/SoundContext.js';

export const MissionsPage: React.FC = () => {
  const [missions, setMissions] = useState<Mission[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'kanban' | 'table'>('kanban');
  const [search, setSearch] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMission, setEditingMission] = useState<Mission | null>(null);

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

  const columns: { status: MissionStatus; title: string }[] = [
    { status: 'not_started', title: 'Not Started' },
    { status: 'in_progress', title: 'In Progress' },
    { status: 'on_hold', title: 'On Hold' },
    { status: 'completed', title: 'Completed' }
  ];

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1
            className="text-2xl sm:text-3xl font-black text-white flex items-center space-x-2"
            style={{ letterSpacing: '-0.06em' }}
          >
            <Target className="w-6 h-6 text-white" />
            <span>Mission Management HQ</span>
          </h1>
          <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.60)' }}>
            Break big ambitions into tactical missions and execute with military discipline.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          {/* View Mode Toggle */}
          <div
            className="flex items-center p-1 rounded-xl"
            style={{
              background: 'rgba(255,255,255,0.08)',
              boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.18)'
            }}
          >
            <button
              onClick={() => setViewMode('kanban')}
              className={`p-1.5 rounded-lg text-xs transition-colors ${
                viewMode === 'kanban' ? 'bg-white text-[#1129e2] font-bold shadow-sm' : 'text-white/60 hover:text-white'
              }`}
              title="Kanban Board View"
            >
              <Columns className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg text-xs transition-colors ${
                viewMode === 'table' ? 'bg-white text-[#1129e2] font-bold shadow-sm' : 'text-white/60 hover:text-white'
              }`}
              title="Table View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="btn-primary flex items-center space-x-1.5 text-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Create Mission</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-2xl"
        style={{
          background: 'rgba(255,255,255,0.08)',
          boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.15)'
        }}
      >
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-2.5 text-white/50" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search missions by keyword..."
            className="glass-input pl-10 pr-4 py-2 text-xs"
          />
        </div>

        <div className="flex items-center space-x-2">
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="glass-select px-3 py-2 text-xs"
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
            className="glass-select px-3 py-2 text-xs"
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
                className="flex flex-col rounded-2xl p-4 min-h-[500px]"
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.12)'
                }}
              >
                <div
                  className="flex items-center justify-between pb-3 mb-3"
                  style={{ borderBottom: '1px solid rgba(255,255,255,0.12)' }}
                >
                  <div className="flex items-center space-x-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-white/70" />
                    <h3
                      className="text-xs font-bold text-white uppercase tracking-wider"
                      style={{ letterSpacing: '0.05em' }}
                    >
                      {col.title}
                    </h3>
                  </div>
                  <span
                    className="text-xs px-2 py-0.5 rounded-full font-mono text-white/80"
                    style={{
                      background: 'rgba(255,255,255,0.12)',
                      boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.18)'
                    }}
                  >
                    {colMissions.length}
                  </span>
                </div>

                <div className="flex-1 space-y-3 overflow-y-auto">
                  {colMissions.map((mission) => (
                    <div
                      key={mission.id}
                      className="p-4 rounded-xl transition-all space-y-3"
                      style={{
                        background: 'rgba(255,255,255,0.08)',
                        boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.18)'
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.13)';
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.08)';
                      }}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <StatusBadge priority={mission.priority} />
                        <div className="flex items-center space-x-1">
                          <button
                            onClick={() => setEditingMission(mission)}
                            className="p-1 text-white/40 hover:text-cyan-300 transition-colors"
                            title="Edit Mission"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(mission.id)}
                            className="p-1 text-white/40 hover:text-red-400 transition-colors"
                            title="Delete Mission"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-sm font-semibold text-white">{mission.title}</h4>
                        {mission.description && (
                          <p className="text-xs mt-1 line-clamp-2" style={{ color: 'rgba(255,255,255,0.60)' }}>
                            {mission.description}
                          </p>
                        )}
                      </div>

                      {/* Subtasks */}
                      {mission.subtasks && mission.subtasks.length > 0 && (
                        <div
                          className="pt-2 space-y-1.5"
                          style={{ borderTop: '1px solid rgba(255,255,255,0.10)' }}
                        >
                          {mission.subtasks.map((st) => (
                            <label
                              key={st.id}
                              className="flex items-center space-x-2 text-xs cursor-pointer select-none"
                              style={{ color: st.is_completed ? 'rgba(255,255,255,0.35)' : 'rgba(255,255,255,0.80)' }}
                            >
                              <input
                                type="checkbox"
                                checked={st.is_completed}
                                onChange={() => handleSubtaskToggle(mission.id, st.id, st.is_completed)}
                              />
                              <span className={st.is_completed ? 'line-through text-[11px]' : 'text-[11px]'}>
                                {st.title}
                              </span>
                            </label>
                          ))}
                        </div>
                      )}

                      {/* Card Footer */}
                      <div
                        className="flex items-center justify-between pt-2 text-[11px]"
                        style={{ borderTop: '1px solid rgba(255,255,255,0.10)' }}
                      >
                        <select
                          value={mission.status}
                          onChange={(e) => handleStatusChange(mission.id, e.target.value as MissionStatus)}
                          className="glass-select rounded px-2 py-0.5 text-[10px]"
                          style={{ width: 'auto' }}
                        >
                          <option value="not_started">Not Started</option>
                          <option value="in_progress">In Progress</option>
                          <option value="on_hold">On Hold</option>
                          <option value="completed">Completed</option>
                        </select>
                        <span className="font-mono text-white/80">{mission.progress_percentage}%</span>
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
        <div
          className="rounded-2xl overflow-hidden"
          style={{
            background: 'rgba(255,255,255,0.08)',
            boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.18)'
          }}
        >
          <table className="w-full text-left text-xs">
            <thead
              className="text-white/60 uppercase font-mono tracking-wider"
              style={{
                background: 'rgba(255,255,255,0.06)',
                borderBottom: '1px solid rgba(255,255,255,0.12)'
              }}
            >
              <tr>
                <th className="py-3 px-4">Mission</th>
                <th className="py-3 px-4">Priority</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Progress</th>
                <th className="py-3 px-4">Deadline</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
              {missions.map((m) => (
                <tr
                  key={m.id}
                  className="transition-colors hover:bg-white/5"
                  style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}
                >
                  <td className="py-3 px-4 font-semibold text-white">{m.title}</td>
                  <td className="py-3 px-4"><StatusBadge priority={m.priority} /></td>
                  <td className="py-3 px-4"><StatusBadge status={m.status} /></td>
                  <td className="py-3 px-4 font-mono text-white/80">{m.progress_percentage}%</td>
                  <td className="py-3 px-4" style={{ color: 'rgba(255,255,255,0.60)' }}>
                    {m.deadline ? new Date(m.deadline).toLocaleDateString() : '—'}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end space-x-1">
                      <button
                        onClick={() => setEditingMission(m)}
                        className="text-white/40 hover:text-cyan-300 p-1 transition-colors"
                        title="Edit Mission"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(m.id)}
                        className="text-white/40 hover:text-red-400 p-1 transition-colors"
                        title="Delete Mission"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
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

      {/* Edit Mission Modal */}
      <EditMissionModal
        mission={editingMission}
        isOpen={!!editingMission}
        onClose={() => setEditingMission(null)}
        onMissionUpdated={fetchMissions}
      />
    </div>
  );
};
