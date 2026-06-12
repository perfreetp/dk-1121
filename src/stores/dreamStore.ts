import { create } from 'zustand';
import { Dream, DreamCategory, EmotionLevel } from '@/types';
import { mockDreams, generateId } from '@/utils/mockData';
import { getStorageData, setStorageData, STORAGE_KEYS } from '@/utils/storage';

interface DreamFilter {
  category?: DreamCategory;
  emotionLevel?: EmotionLevel;
  searchKeyword?: string;
  blockedKeywords?: string[];
}

interface DreamStore {
  dreams: Dream[];
  currentFilter: DreamFilter;
  loadDreams: () => void;
  addDream: (dream: Omit<Dream, 'id' | 'createdAt'>) => string;
  removeDream: (id: string) => void;
  updateDream: (id: string, updates: Partial<Dream>) => void;
  setFilter: (filter: DreamFilter) => void;
  getFilteredDreams: () => Dream[];
  getDreamById: (id: string) => Dream | undefined;
  getDreamsByUser: (userId: string) => Dream[];
  getDreamsByIds: (ids: string[]) => Dream[];
  incrementCollectCount: (id: string) => void;
  decrementCollectCount: (id: string) => void;
  incrementRelayCount: (id: string) => void;
  getCitedDreamsByUserId: (userId: string) => Dream[];
}

export const useDreamStore = create<DreamStore>((set, get) => ({
  dreams: getStorageData<Dream[]>(STORAGE_KEYS.DREAMS, mockDreams),
  currentFilter: {},

  loadDreams: () => {
    const stored = getStorageData<Dream[]>(STORAGE_KEYS.DREAMS, []);
    if (stored.length === 0) {
      setStorageData(STORAGE_KEYS.DREAMS, mockDreams);
      set({ dreams: mockDreams });
    } else {
      set({ dreams: stored });
    }
  },

  addDream: (dream) => {
    const newDream: Dream = {
      ...dream,
      id: generateId(),
      createdAt: new Date(),
    };
    const updated = [newDream, ...get().dreams];
    setStorageData(STORAGE_KEYS.DREAMS, updated);
    set({ dreams: updated });
    return newDream.id;
  },

  removeDream: (id) => {
    const updated = get().dreams.filter((d) => d.id !== id);
    setStorageData(STORAGE_KEYS.DREAMS, updated);
    set({ dreams: updated });
  },

  updateDream: (id, updates) => {
    const updated = get().dreams.map((d) =>
      d.id === id ? { ...d, ...updates } : d
    );
    setStorageData(STORAGE_KEYS.DREAMS, updated);
    set({ dreams: updated });
  },

  setFilter: (filter) => {
    set({ currentFilter: filter });
  },

  getFilteredDreams: () => {
    const { dreams, currentFilter } = get();
    return dreams.filter((dream) => {
      if (currentFilter.category && dream.category !== currentFilter.category) {
        return false;
      }
      if (currentFilter.emotionLevel && dream.emotionLevel !== currentFilter.emotionLevel) {
        return false;
      }
      if (currentFilter.searchKeyword) {
        const keyword = currentFilter.searchKeyword.toLowerCase();
        return (
          dream.content.toLowerCase().includes(keyword) ||
          dream.userNickname.toLowerCase().includes(keyword)
        );
      }
      if (currentFilter.blockedKeywords && currentFilter.blockedKeywords.length > 0) {
        const content = dream.content.toLowerCase();
        for (const keyword of currentFilter.blockedKeywords) {
          if (content.includes(keyword.toLowerCase())) {
            return false;
          }
        }
      }
      return true;
    });
  },

  getDreamById: (id) => {
    return get().dreams.find((d) => d.id === id);
  },

  getDreamsByUser: (userId) => {
    return get().dreams.filter((d) => d.userId === userId);
  },

  getDreamsByIds: (ids) => {
    return get().dreams.filter((d) => ids.includes(d.id));
  },

  incrementCollectCount: (id) => {
    const dream = get().getDreamById(id);
    if (dream) {
      get().updateDream(id, { collectCount: dream.collectCount + 1 });
    }
  },

  decrementCollectCount: (id) => {
    const dream = get().getDreamById(id);
    if (dream && dream.collectCount > 0) {
      get().updateDream(id, { collectCount: dream.collectCount - 1 });
    }
  },

  incrementRelayCount: (id) => {
    const dream = get().getDreamById(id);
    if (dream) {
      get().updateDream(id, { relayCount: dream.relayCount + 1 });
    }
  },

  getCitedDreamsByUserId: (userId) => {
    return get().dreams.filter((dream) => {
      if (!dream.relayFromId) return false;
      const originalDream = get().getDreamById(dream.relayFromId);
      return originalDream?.userId === userId;
    });
  },
}));
