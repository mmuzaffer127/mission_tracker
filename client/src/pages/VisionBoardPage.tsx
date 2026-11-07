import React, { useState } from 'react';
import { Eye, Plus, Sparkles, Quote, Image } from 'lucide-react';
import { Modal } from '../components/ui/Modal.js';
import { useSound } from '../contexts/SoundContext.js';

interface VisionItem {
  id: string;
  title: string;
  quote?: string;
  imageUrl?: string;
  tag: string;
}

const INITIAL_ITEMS: VisionItem[] = [
  {
    id: 'v-1',
    title: 'Distributed Systems & AI Architecture',
    quote: 'First do it, then do it right, then do it better.',
    imageUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=600&q=80',
    tag: 'Career'
  },
  {
    id: 'v-2',
    title: 'Financial Independence & Creative Freedom',
    quote: 'Wealth is what you do not see. It is freedom to direct your time.',
    imageUrl: 'https://images.unsplash.com/photo-1553729459-efe14ef6055d?auto=format&fit=crop&w=600&q=80',
    tag: 'Wealth'
  },
  {
    id: 'v-3',
    title: 'Peak Physical Vitality & Daily Energy',
    quote: 'Take care of your body. It is the only place you have to live.',
    imageUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=600&q=80',
    tag: 'Health'
  }
];

export const VisionBoardPage: React.FC = () => {
  const [items, setItems] = useState<VisionItem[]>(INITIAL_ITEMS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [quote, setQuote] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [tag, setTag] = useState('Personal Dev');

  const { playComplete, playClick } = useSound();

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    playClick();
    const newItem: VisionItem = {
      id: `v-${Date.now()}`,
      title,
      quote,
      imageUrl: imageUrl || 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80',
      tag
    };
    setItems([newItem, ...items]);
    playComplete();
    setIsModalOpen(false);
    setTitle('');
    setQuote('');
    setImageUrl('');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center space-x-2">
            <Eye className="w-6 h-6 text-brand-emerald" />
            <span>Aspirational Vision Board</span>
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Imprint your long-range subconscious horizon with clarity, imagery, and relentless ambition.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-gradient-to-r from-brand-emerald to-teal-500 text-black text-xs font-semibold shadow-glow hover:brightness-110 active:scale-95 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Pin Inspiration</span>
        </button>
      </div>

      {/* Grid of Vision Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => (
          <div
            key={item.id}
            className="group glass-card overflow-hidden border border-surface-border hover:border-emerald-500/40 transition-all flex flex-col justify-between"
          >
            {item.imageUrl && (
              <div className="h-44 w-full overflow-hidden relative">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-3 left-3 text-[10px] font-mono px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-md text-emerald-400 border border-emerald-500/30">
                  {item.tag}
                </span>
              </div>
            )}

            <div className="p-5 space-y-2 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-base font-bold text-white tracking-wide">{item.title}</h3>
                {item.quote && (
                  <p className="text-xs text-gray-400 italic mt-2 flex items-start space-x-1.5 leading-relaxed">
                    <Quote className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span>"{item.quote}"</span>
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pin Inspiration Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Pin to Vision Board">
        <form onSubmit={handleAddItem} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">Aspiration / Vision *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Master Machine Learning Engineering & Launch SaaS"
              className="w-full px-3.5 py-2.5 rounded-xl bg-surface-50 border border-surface-border text-white text-sm focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">Anchoring Quote</label>
            <input
              type="text"
              value={quote}
              onChange={(e) => setQuote(e.target.value)}
              placeholder="e.g. Fortune favors the prepared mind."
              className="w-full px-3.5 py-2 rounded-xl bg-surface-50 border border-surface-border text-white text-xs focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">Image URL</label>
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://images.unsplash.com/..."
              className="w-full px-3.5 py-2 rounded-xl bg-surface-50 border border-surface-border text-white text-xs focus:outline-none"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-3 border-t border-surface-border">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 text-xs text-gray-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-brand-emerald text-black text-xs font-semibold hover:brightness-110"
            >
              Pin to Board
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
