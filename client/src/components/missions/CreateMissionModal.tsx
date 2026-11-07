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
          <div className="p-3 text-xs rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400">
            {error}
          </div>
        )}

        <div>
          <label className="block text-xs font-semibold text-gray-300 mb-1">Mission Title *</label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Master PostgreSQL indexing & query plans"
            className="w-full px-3.5 py-2.5 rounded-xl bg-surface-50 border border-surface-border text-white text-sm focus:outline-none focus:border-brand-blue"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-300 mb-1">Brief Description</label>
          <textarea
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Strategic objective and success criteria..."
            className="w-full px-3.5 py-2 rounded-xl bg-surface-50 border border-surface-border text-white text-sm focus:outline-none focus:border-brand-blue resize-none"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">Priority Level</label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as MissionPriority)}
              className="w-full px-3 py-2 rounded-xl bg-surface-50 border border-surface-border text-white text-sm focus:outline-none focus:border-brand-blue"
            >
              <option value="low">Low Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="high">High Priority</option>
              <option value="critical">CRITICAL MISSION</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">Target Deadline</label>
            <input
              type="datetime-local"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-surface-50 border border-surface-border text-white text-sm focus:outline-none focus:border-brand-blue"
            />
          </div>
        </div>

        {/* Tactical Subtasks */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-semibold text-gray-300">Tactical Subtasks</label>
            <button
              type="button"
              onClick={handleAddSubtask}
              className="text-xs flex items-center space-x-1 text-brand-cyan hover:underline"
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
                  className="flex-1 px-3 py-1.5 rounded-lg bg-surface-50 border border-surface-border text-white text-xs focus:outline-none focus:border-brand-blue"
                />
                {subtasks.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveSubtask(i)}
                    className="p-1.5 text-gray-500 hover:text-rose-400 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Modal Actions */}
        <div className="flex items-center justify-end space-x-3 pt-3 border-t border-surface-border">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-medium text-gray-400 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            onClick={playClick}
            className="flex items-center space-x-2 px-5 py-2 rounded-xl bg-gradient-to-r from-brand-blue to-blue-600 text-white text-xs font-semibold shadow-glow hover:brightness-110 active:scale-95 disabled:opacity-50 transition-all"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{submitting ? 'Launching...' : 'Deploy Mission'}</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};
