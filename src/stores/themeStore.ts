import { create } from 'zustand';
import { Theme } from '@/types';
import { mockThemes } from '@/utils/mockData';

interface ThemeStore {
  themes: Theme[];
  currentTheme: Theme | null;
  loadThemes: () => void;
  getTodayTheme: () => Theme;
  getRecentThemes: () => Theme[];
  addParticipant: (themeId: string) => void;
  addDreamToTheme: (themeId: string, dreamId: string) => void;
}

export const useThemeStore = create<ThemeStore>((set, get) => ({
  themes: mockThemes,
  currentTheme: null,

  loadThemes: () => {
    set({ themes: mockThemes });
  },

  getTodayTheme: () => {
    const themes = get().themes;
    return themes.find((t) => {
      const today = new Date();
      const themeDate = new Date(t.date);
      return (
        themeDate.getDate() === today.getDate() &&
        themeDate.getMonth() === today.getMonth() &&
        themeDate.getFullYear() === today.getFullYear()
      );
    }) || themes[0];
  },

  getRecentThemes: () => {
    return get().themes.slice(0, 7);
  },

  addParticipant: (themeId) => {
    const themes = get().themes.map((t) =>
      t.id === themeId ? { ...t, participantCount: t.participantCount + 1 } : t
    );
    set({ themes });
  },

  addDreamToTheme: (themeId, dreamId) => {
    const themes = get().themes.map((t) =>
      t.id === themeId
        ? { ...t, dreamIds: [...t.dreamIds, dreamId] }
        : t
    );
    set({ themes });
  },
}));
