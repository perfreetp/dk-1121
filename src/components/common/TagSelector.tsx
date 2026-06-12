import React from 'react';
import { motion } from 'framer-motion';

interface TagSelectorProps {
  options: string[];
  selected: string[];
  onChange: (selected: string[]) => void;
  max?: number;
}

export const TagSelector: React.FC<TagSelectorProps> = ({
  options,
  selected,
  onChange,
  max = 3,
}) => {
  const toggleTag = (tag: string) => {
    if (selected.includes(tag)) {
      onChange(selected.filter((t) => t !== tag));
    } else if (selected.length < max) {
      onChange([...selected, tag]);
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      {options.map((tag) => {
        const isSelected = selected.includes(tag);
        const isDisabled = !isSelected && selected.length >= max;

        return (
          <motion.button
            key={tag}
            onClick={() => !isDisabled && toggleTag(tag)}
            disabled={isDisabled}
            whileTap={{ scale: 0.95 }}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
              isSelected
                ? 'bg-star-gold text-deep-indigo shadow-lg shadow-star-gold/30'
                : isDisabled
                ? 'bg-deep-indigo/30 text-moonlight/30 cursor-not-allowed'
                : 'bg-deep-indigo/50 text-moonlight/70 hover:text-moonlight border border-dream-purple/20 hover:border-star-gold/30'
            }`}
          >
            {tag}
            {isSelected && (
              <span className="ml-1 text-xs opacity-70">
                ({selected.indexOf(tag) + 1}/{max})
              </span>
            )}
          </motion.button>
        );
      })}
    </div>
  );
};

export default TagSelector;
