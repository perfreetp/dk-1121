import React, { useState, useEffect } from 'react';
import { Search, Sparkles } from 'lucide-react';
import { useDreamStore } from '@/stores/dreamStore';
import { useThemeStore } from '@/stores/themeStore';
import { useCollectionStore } from '@/stores/collectionStore';
import { useUserStore } from '@/stores/userStore';
import DreamCard from '@/components/dream/DreamCard';
import CategoryFilter from '@/components/dream/CategoryFilter';
import ThemeCard from '@/components/relay/ThemeCard';
import { DreamCategory } from '@/types';

const DreamPool: React.FC = () => {
  const { getFilteredDreams, setFilter, currentFilter, loadDreams } = useDreamStore();
  const { getTodayTheme, loadThemes } = useThemeStore();
  const { loadData } = useCollectionStore();
  const { currentUser } = useUserStore();
  const [searchValue, setSearchValue] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    loadDreams();
    loadThemes();
    loadData();
    setMounted(true);
  }, []);

  useEffect(() => {
    const blockedKeywords = currentUser?.settings?.blockedKeywords || [];
    setFilter({ ...currentFilter, blockedKeywords });
  }, [currentUser?.settings?.blockedKeywords]);

  const filteredDreams = getFilteredDreams();
  const todayTheme = getTodayTheme();

  const handleCategoryChange = (category: DreamCategory | undefined) => {
    setFilter({ ...currentFilter, category });
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);
    setFilter({ ...currentFilter, searchKeyword: value });
  };

  return (
    <div className="min-h-screen pb-24">
      <header className="sticky top-0 z-40 bg-night-bg/95 backdrop-blur-md border-b border-dream-purple/10">
        <div className="max-w-lg mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold gradient-text font-serif">梦境交换</h1>
              <p className="text-xs text-moonlight/50 mt-0.5">探索潜意识的创意宝库</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-dream-purple to-star-gold p-0.5">
              <div className="w-full h-full rounded-full bg-night-bg flex items-center justify-center">
                <Sparkles size={18} className="text-star-gold" />
              </div>
            </div>
          </div>

          <div className="relative">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-moonlight/40" />
            <input
              type="text"
              value={searchValue}
              onChange={handleSearch}
              placeholder="搜索梦境片段..."
              className="input-field pl-11"
            />
          </div>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-4 space-y-6">
        <section>
          <h2 className="text-sm font-medium text-moonlight/60 mb-3 flex items-center gap-2">
            <Sparkles size={14} className="text-star-gold" />
            今日主题
          </h2>
          <ThemeCard theme={todayTheme} isToday />
        </section>

        <section>
          <h2 className="text-sm font-medium text-moonlight/60 mb-3">分类浏览</h2>
          <CategoryFilter
            selected={currentFilter.category}
            onSelect={handleCategoryChange}
          />
        </section>

        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-medium text-moonlight/60">
              {currentFilter.category || '全部'}梦境
            </h2>
            <span className="text-xs text-moonlight/40">
              共 {filteredDreams.length} 条
            </span>
          </div>

          <div className="space-y-4">
            {mounted && filteredDreams.map((dream, index) => (
              <div
                key={dream.id}
                style={{ animationDelay: `${index * 100}ms` }}
                className="animate-fade-in"
              >
                <DreamCard dream={dream} />
              </div>
            ))}
          </div>

          {filteredDreams.length === 0 && (
            <div className="text-center py-12">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-dream-purple/10 flex items-center justify-center">
                <Sparkles size={32} className="text-dream-purple/50" />
              </div>
              <p className="text-moonlight/50 text-sm">暂无匹配的梦境</p>
              <p className="text-moonlight/30 text-xs mt-1">试试其他分类或关键词</p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default DreamPool;
