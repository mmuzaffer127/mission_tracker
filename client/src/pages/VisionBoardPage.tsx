import React, { useState } from 'react';
import { Eye, Plus, Quote } from 'lucide-react';
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
          <h1
            className="text-2xl sm:text-3xl font-black text-white flex items-center space-x-2"
            style={{ letterSpacing: '-0.06em' }}
          >
            <Eye className="w-6 h-6 text-white" />
            <span>Aspirational Vision Board</span>
          </h1>
          <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.60)' }}>
            Imprint your long-range subconscious horizon with clarity, imagery, and relentless ambition.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="btn-primary flex items-center space-x-1.5 text-xs"
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
            className="group glass-card overflow-hidden flex flex-col justify-between"
          >
            {item.imageUrl && (
              <div className="h-44 w-full overflow-hidden relative">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span
                  className="absolute top-3 left-3 text-[10px] font-mono px-2 py-0.5 rounded-md text-white font-bold"
                  style={{
                    background: 'rgba(17,41,226,0.85)',
                    backdropFilter: 'blur(8px)',
                    boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.25)'
                  }}
                >
                  {item.tag}
                </span>
              </div>
            )}

            <div className="p-5 space-y-2 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-base font-bold text-white tracking-wide">{item.title}</h3>
                {item.quote && (
                  <p className="text-xs italic mt-2 flex items-start space-x-1.5 leading-relaxed" style={{ color: 'rgba(255,255,255,0.70)' }}>
                    <Quote className="w-3.5 h-3.5 text-white/80 flex-shrink-0 mt-0.5" />
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
            <label className="glass-label">Aspiration / Vision *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Master Machine Learning Engineering & Launch SaaS"
              className="glass-input text-sm"
            />
          </div>

          <div>
            <label className="glass-label">Anchoring Quote</label>
            <input
              type="text"
              value={quote}
              onChange={(e) => setQuote(e.target.value)}
              placeholder="e.g. Fortune favors the prepared mind."
              className="glass-input text-xs"
            />
          </div>

          <div>
            <label className="glass-label">Image URL</label>
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://images.unsplash.com/..."
              className="glass-input text-xs"
            />
          </div>

          <div
            className="flex justify-end space-x-3 pt-3"
            style={{ borderTop: '1px solid rgba(255,255,255,0.14)' }}
          >
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="btn-glass text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary text-xs"
            >
              Pin to Board
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
