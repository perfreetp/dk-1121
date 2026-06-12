import React from 'react';
import { Sparkles, Users } from 'lucide-react';
import { Theme } from '@/types';
import { formatDate } from '@/utils/mockData';

interface ThemeCardProps {
  theme: Theme;
  isToday?: boolean;
  onClick?: () => void;
}

export const ThemeCard: React.FC<ThemeCardProps> = ({ theme, isToday, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="relative overflow-hidden rounded-2xl cursor-pointer group"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-dream-purple/20 via-deep-indigo to-night-bg" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,215,0,0.1),transparent_50%)]" />
      
      <div className="relative p-6">
        {isToday && (
          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-star-gold/20 text-star-gold text-xs font-medium">
              <Sparkles size={12} />
              <span>今日主题</span>
            </div>
          </div>
        )}

        <h3 className="text-2xl font-bold text-moonlight mb-2 font-serif tracking-wide">
          {theme.title}
        </h3>
        
        <p className="text-moonlight/70 text-sm leading-relaxed mb-4">
          {theme.description}
        </p>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-moonlight/50 text-sm">
            <Users size={14} />
            <span>{theme.participantCount} 人参与</span>
          </div>
          {!isToday && (
            <span className="text-xs text-moonlight/40">
              {formatDate(theme.date)}
            </span>
          )}
        </div>

        <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
          <button className="w-full py-2.5 rounded-xl bg-dream-purple/30 hover:bg-dream-purple/50 text-moonlight text-sm font-medium transition-colors border border-dream-purple/30">
            参与接龙
          </button>
        </div>
      </div>

      <div className="absolute -top-10 -right-10 w-40 h-40 bg-star-gold/5 rounded-full blur-3xl" />
    </div>
  );
};

export default ThemeCard;
