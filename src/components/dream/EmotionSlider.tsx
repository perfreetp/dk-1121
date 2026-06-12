import React from 'react';
import { EmotionLevel, EMOTION_LABELS } from '@/types';

interface EmotionSliderProps {
  value: EmotionLevel;
  onChange: (value: EmotionLevel) => void;
}

export const EmotionSlider: React.FC<EmotionSliderProps> = ({ value, onChange }) => {
  const levels: EmotionLevel[] = [1, 2, 3, 4, 5];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm text-moonlight/70">情绪强度</span>
        <span 
          className="text-sm font-medium"
          style={{ color: EMOTION_LABELS[value].color }}
        >
          {EMOTION_LABELS[value].label}
        </span>
      </div>
      
      <div className="flex gap-2">
        {levels.map((level) => {
          const isActive = level <= value;
          const color = EMOTION_LABELS[level].color;
          
          return (
            <button
              key={level}
              onClick={() => onChange(level)}
              className="flex-1 h-10 rounded-lg transition-all duration-200 flex items-center justify-center"
              style={{
                backgroundColor: isActive 
                  ? `${color}30` 
                  : 'rgba(107, 91, 149, 0.1)',
                border: `2px solid ${isActive ? color : 'transparent'}`,
                transform: level === value ? 'scale(1.05)' : 'scale(1)',
              }}
            >
              <div
                className="w-4 h-4 rounded-full transition-all"
                style={{
                  backgroundColor: color,
                  boxShadow: isActive ? `0 0 10px ${color}` : 'none',
                }}
              />
            </button>
          );
        })}
      </div>

      <div className="flex justify-between text-xs text-moonlight/40 px-1">
        <span>平静</span>
        <span>剧烈</span>
      </div>
    </div>
  );
};

export default EmotionSlider;
