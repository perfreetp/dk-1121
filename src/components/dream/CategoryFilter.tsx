import React from 'react';
import { CATEGORIES, DreamCategory, CATEGORY_COLORS } from '@/types';

interface CategoryFilterProps {
  selected?: DreamCategory;
  onSelect: (category: DreamCategory | undefined) => void;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  selected,
  onSelect,
}) => {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
      <button
        onClick={() => onSelect(undefined)}
        className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${
          !selected
            ? 'bg-dream-purple text-white shadow-lg shadow-dream-purple/30'
            : 'bg-deep-indigo/50 text-moonlight/70 hover:text-moonlight border border-dream-purple/20'
        }`}
      >
        全部
      </button>
      {CATEGORIES.map((category) => (
        <button
          key={category}
          onClick={() => onSelect(category === selected ? undefined : category)}
          className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${
            selected === category
              ? `${CATEGORY_COLORS[category]} shadow-lg`
              : 'bg-deep-indigo/50 text-moonlight/70 hover:text-moonlight border border-dream-purple/20'
          }`}
        >
          {category}
        </button>
      ))}
    </div>
  );
};

export default CategoryFilter;
