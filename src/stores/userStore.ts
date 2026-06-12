import { create } from 'zustand';
import { User } from '@/types';
import { getStorageData, setStorageData, STORAGE_KEYS } from '@/utils/storage';
import { generateId } from '@/utils/mockData';

interface UserStore {
  currentUser: User | null;
  isLoggedIn: boolean;
  login: (nickname: string) => void;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => void;
  incrementPublishCount: () => void;
  incrementCitedCount: () => void;
  addBlockedKeyword: (keyword: string) => void;
  removeBlockedKeyword: (keyword: string) => void;
}

const defaultUser: User = {
  id: '',
  nickname: '',
  avatar: '',
  publishCount: 0,
  citedCount: 0,
  followers: 0,
  following: 0,
  blockedKeywords: [],
  createdAt: new Date(),
};

export const useUserStore = create<UserStore>((set, get) => ({
  currentUser: getStorageData<User | null>(STORAGE_KEYS.USER, null),
  isLoggedIn: getStorageData<User | null>(STORAGE_KEYS.USER, null) !== null,

  login: (nickname) => {
    const user: User = {
      ...defaultUser,
      id: generateId(),
      nickname,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${nickname}`,
      createdAt: new Date(),
    };
    setStorageData(STORAGE_KEYS.USER, user);
    set({ currentUser: user, isLoggedIn: true });
  },

  logout: () => {
    setStorageData(STORAGE_KEYS.USER, null);
    set({ currentUser: null, isLoggedIn: false });
  },

  updateProfile: (updates) => {
    const user = get().currentUser;
    if (user) {
      const updated = { ...user, ...updates };
      setStorageData(STORAGE_KEYS.USER, updated);
      set({ currentUser: updated });
    }
  },

  incrementPublishCount: () => {
    const user = get().currentUser;
    if (user) {
      get().updateProfile({ publishCount: user.publishCount + 1 });
    }
  },

  incrementCitedCount: () => {
    const user = get().currentUser;
    if (user) {
      get().updateProfile({ citedCount: user.citedCount + 1 });
    }
  },

  addBlockedKeyword: (keyword) => {
    const user = get().currentUser;
    if (user && !user.blockedKeywords.includes(keyword)) {
      get().updateProfile({
        blockedKeywords: [...user.blockedKeywords, keyword],
      });
    }
  },

  removeBlockedKeyword: (keyword) => {
    const user = get().currentUser;
    if (user) {
      get().updateProfile({
        blockedKeywords: user.blockedKeywords.filter((k) => k !== keyword),
      });
    }
  },
}));
