import React, { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal.js';
import { Plus, Trash2, Save } from 'lucide-react';
import { api } from '../../lib/api.js';
import { useSound } from '../../contexts/SoundContext.js';
import { Mission, MissionPriority, MissionStatus } from '../../types/index.js';

interface EditMissionModalProps {
  mission: Mission | null;
  isOpen: boolean;
  onClose: () => void;
  onMissionUpdated: () => void;
}

export const EditMissionModal: React.FC<EditMissionModalProps> = ({
  mission,
  isOpen,
  onClose,
  onMissionUpdated
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<MissionPriority>('medium');
  const [status, setStatus] = useState<MissionStatus>('not_started');
  const [deadline, setDeadline] = useState('');
  const [subtasks, setSubtasks] = useState<{ id?: string; title: string; is_completed?: boolean }[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const { playComplete, playClick } = useSound();

  useEffect(() => {
    if (mission) {
      setTitle(mission.title || '');
      setDescription(mission.description || '');
      setPriority(mission.priority || 'medium');
      setStatus(mission.status || 'not_started');
      setDeadline(mission.deadline ? mission.deadline.slice(0, 16) : '');
      setSubtasks(
        mission.subtasks && mission.subtasks.length > 0
          ? mission.subtasks.map((st) => ({ id: st.id, title: st.title, is_completed: st.is_completed }))
          : [{ title: '' }]
      );
    }
  }, [mission]);

  const handleAddSubtask = () => {
    setSubtasks([...subtasks, { title: '' }]);
  };

  const handleSubtaskChange = (index: number, val: string) => {
    const updated = [...subtasks];
    updated[index] = { ...updated[index], title: val };
    setSubtasks(updated);
  };

  const handleRemoveSubtask = (index: number) => {
    setSubtasks(subtasks.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mission) return;
    if (!title.trim()) {
      setError('Title is required');
      return;
    }

    try {
      setSubmitting(true);
      setError('');

      const filteredSubtasks = subtasks.filter((s) => s.title.trim().length > 0);
      await api.updateMission(mission.id, {
        title,
        description,
        priority,
        status,
        deadline: deadline ? new Date(deadline).toISOString() : null,
        subtasks: filteredSubtasks
      });

      playComplete();
      onMissionUpdated();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to update mission');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Mission Details">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div
            className="p-3 text-xs rounded-xl"
            style={{
              background: 'rgba(255, 100, 100, 0.2)',
              boxShadow: 'inset 0 0 0 1px rgba(255, 100, 100, 0.4)',
              color: '#ffffff'
            }}
          >
            {error}
          </div>
        )}

        <div>
          <label className="glass-label">Mission Title *</label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="glass-input text-sm"
          />
        </div>

        <div>
          <label className="glass-label">Brief Description</label>
          <textarea
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="glass-textarea text-sm"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="glass-label">Priority</label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as MissionPriority)}
              className="glass-select text-xs"
            >
              <option value="low">Low Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="high">High Priority</option>
              <option value="critical">CRITICAL MISSION</option>
            </select>
          </div>

          <div>
            <label className="glass-label">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as MissionStatus)}
              className="glass-select text-xs"
            >
              <option value="not_started">Not Started</option>
              <option value="in_progress">In Progress</option>
              <option value="on_hold">On Hold</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          <div>
            <label className="glass-label">Deadline</label>
            <input
              type="datetime-local"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="glass-input text-xs"
            />
          </div>
        </div>

        {/* Tactical Subtasks */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="glass-label mb-0">Tactical Subtasks</label>
            <button
              type="button"
              onClick={handleAddSubtask}
              className="text-xs flex items-center space-x-1 text-cyan-300 hover:text-white transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Subtask</span>
            </button>
          </div>
          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
            {subtasks.map((st, i) => (
              <div key={i} className="flex items-center space-x-2">
                <input
                  type="text"
                  value={st.title}
                  onChange={(e) => handleSubtaskChange(i, e.target.value)}
                  placeholder={`Subtask #${i + 1}`}
                  className="glass-input text-xs flex-1"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveSubtask(i)}
                  className="p-1.5 text-white/40 hover:text-red-400 transition-colors"
                  title="Remove subtask"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Modal Actions */}
        <div
          className="flex items-center justify-end space-x-3 pt-3"
          style={{ borderTop: '1px solid rgba(255,255,255,0.14)' }}
        >
          <button
            type="button"
            onClick={onClose}
            className="btn-glass text-xs"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            onClick={playClick}
            className="btn-primary flex items-center space-x-1.5 text-xs disabled:opacity-50"
            style={{
              background: 'linear-gradient(135deg, #22d3ee, #06b6d4)',
              color: '#000000'
            }}
          >
            <Save className="w-3.5 h-3.5" />
            <span>{submitting ? 'Saving...' : 'Save Changes'}</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};

