import React from 'react';
import { Heart, MessageCircle, Bookmark } from 'lucide-react';
import { Dream, CATEGORY_COLORS, EMOTION_LABELS } from '@/types';
import { formatDate } from '@/utils/mockData';
import { useCollectionStore } from '@/stores/collectionStore';
import { useDreamStore } from '@/stores/dreamStore';
import { motion } from 'framer-motion';

interface DreamCardProps {
  dream: Dream;
  onRelay?: () => void;
  showActions?: boolean;
}

export const DreamCard: React.FC<DreamCardProps> = ({ 
  dream, 
  onRelay,
  showActions = true 
}) => {
  const { isCollected, addToCollection, removeFromCollection } = useCollectionStore();
  const { incrementCollectCount, decrementCollectCount } = useDreamStore();
  const collected = isCollected(dream.id);

  const handleCollect = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (collected) {
      removeFromCollection(dream.id);
      decrementCollectCount(dream.id);
    } else {
      addToCollection(dream.id);
      incrementCollectCount(dream.id);
    }
  };

  const emotionColor = EMOTION_LABELS[dream.emotionLevel].color;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="card group"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-dream-purple to-deep-indigo p-0.5">
            <img
              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${dream.userNickname}`}
              alt={dream.userNickname}
              className="w-full h-full rounded-full bg-deep-indigo"
            />
          </div>
          <div>
            <p className="font-medium text-moonlight">{dream.userNickname}</p>
            <p className="text-xs text-moonlight/50">{formatDate(dream.createdAt)}</p>
          </div>
        </div>
        <span className={`tag ${CATEGORY_COLORS[dream.category]}`}>
          {dream.category}
        </span>
      </div>

      <p className="text-moonlight/90 leading-relaxed mb-4 line-clamp-4">
        {dream.content}
      </p>

      <div className="flex items-center gap-2 flex-wrap mb-4">
        {dream.creativeTags.map((tag) => (
          <span
            key={tag}
            className="px-2 py-0.5 rounded-full text-xs bg-star-gold/10 text-star-gold border border-star-gold/20"
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="flex items-center gap-2 mb-4">
        <span className="text-xs text-moonlight/50">情绪强度</span>
        <div className="flex-1 flex gap-1">
          {[1, 2, 3, 4, 5].map((level) => (
            <div
              key={level}
              className="emotion-bar flex-1"
              style={{
                backgroundColor: level <= dream.emotionLevel ? emotionColor : 'rgba(107, 91, 149, 0.2)',
              }}
            />
          ))}
        </div>
        <span className="text-xs font-medium" style={{ color: emotionColor }}>
          {EMOTION_LABELS[dream.emotionLevel].label}
        </span>
      </div>

      {showActions && (
        <div className="flex items-center justify-between pt-3 border-t border-dream-purple/10">
          <div className="flex items-center gap-4 text-moonlight/50">
            <button
              onClick={onRelay}
              className="flex items-center gap-1 hover:text-dream-purple transition-colors"
            >
              <MessageCircle size={16} />
              <span className="text-xs">{dream.relayCount}</span>
            </button>
            <button
              onClick={handleCollect}
              className={`flex items-center gap-1 transition-all ${
                collected 
                  ? 'text-red-400 hover:text-red-300' 
                  : 'hover:text-red-400'
              }`}
            >
              <motion.div
                animate={collected ? { scale: [1, 1.3, 1] } : {}}
                transition={{ duration: 0.3 }}
              >
                <Heart size={16} fill={collected ? 'currentColor' : 'none'} />
              </motion.div>
              <span className="text-xs">{dream.collectCount}</span>
            </button>
          </div>
          <button className="flex items-center gap-1 text-dream-purple/70 hover:text-dream-purple transition-colors text-xs">
            <Bookmark size={14} />
            <span>引用</span>
          </button>
        </div>
      )}
    </motion.div>
  );
};

export default DreamCard;
