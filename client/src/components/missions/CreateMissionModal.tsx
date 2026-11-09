import React, { useState } from 'react';
import { Modal } from '../ui/Modal.js';
import { Plus, Trash2, Sparkles } from 'lucide-react';
import { api } from '../../lib/api.js';
import { useSound } from '../../contexts/SoundContext.js';
import { MissionPriority } from '../../types/index.js';

interface CreateMissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onMissionCreated: () => void;
}

export const CreateMissionModal: React.FC<CreateMissionModalProps> = ({
  isOpen,
  onClose,
  onMissionCreated
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<MissionPriority>('medium');
  const [deadline, setDeadline] = useState('');
  const [subtasks, setSubtasks] = useState<string[]>(['']);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const { playComplete, playClick } = useSound();

  const handleAddSubtask = () => {
    setSubtasks([...subtasks, '']);
  };

  const handleSubtaskChange = (index: number, val: string) => {
    const updated = [...subtasks];
    updated[index] = val;
    setSubtasks(updated);
  };

  const handleRemoveSubtask = (index: number) => {
    setSubtasks(subtasks.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Title is required');
      return;
    }

    try {
      setSubmitting(true);
      setError('');

      const filteredSubtasks = subtasks.filter((s) => s.trim().length > 0);
      await api.createMission({
        title,
        description,
        priority,
        deadline: deadline ? new Date(deadline).toISOString() : null,
        subtasks: filteredSubtasks
      });

      playComplete();
      onMissionCreated();
      onClose();
      // Reset form
      setTitle('');
      setDescription('');
      setPriority('medium');
      setDeadline('');
      setSubtasks(['']);
    } catch (err: any) {
      setError(err.message || 'Failed to create mission');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Launch New Mission">
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
            placeholder="e.g. Master PostgreSQL indexing & query plans"
            className="glass-input text-sm"
          />
        </div>

        <div>
          <label className="glass-label">Brief Description</label>
          <textarea
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Strategic objective and success criteria..."
            className="glass-textarea text-sm"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="glass-label">Priority Level</label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as MissionPriority)}
              className="glass-select text-sm"
            >
              <option value="low">Low Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="high">High Priority</option>
              <option value="critical">CRITICAL MISSION</option>
            </select>
          </div>

          <div>
            <label className="glass-label">Target Deadline</label>
            <input
              type="datetime-local"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="glass-input text-sm"
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
              className="text-xs flex items-center space-x-1 text-white/80 hover:text-white transition-opacity"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Subtask</span>
            </button>
          </div>
          <div className="space-y-2">
            {subtasks.map((st, i) => (
              <div key={i} className="flex items-center space-x-2">
                <input
                  type="text"
                  value={st}
                  onChange={(e) => handleSubtaskChange(i, e.target.value)}
                  placeholder={`Subtask #${i + 1}`}
                  className="glass-input text-xs"
                />
                {subtasks.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveSubtask(i)}
                    className="p-1.5 text-white/50 hover:text-white transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Modal Actions */}
        <div className="flex items-center justify-end space-x-3 pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.14)' }}>
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
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{submitting ? 'Launching...' : 'Deploy Mission'}</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};
