import { create } from 'zustand';
import { User, UserSettings } from '@/types';
import { getStorageData, setStorageData, STORAGE_KEYS } from '@/utils/storage';
import { generateId } from '@/utils/mockData';

interface UserStore {
  currentUser: User | null;
  users: User[];
  loadUsers: () => void;
  login: (nickname: string) => void;
  logout: () => void;
  isLoggedIn: boolean;
  updateSettings: (settings: Partial<UserSettings>) => void;
  addBlockedKeyword: (keyword: string) => void;
  removeBlockedKeyword: (keyword: string) => void;
  followUser: (userId: string) => void;
  unfollowUser: (userId: string) => void;
  isFollowing: (userId: string) => boolean;
  getFollowedUsers: () => User[];
  getUserById: (userId: string) => User | undefined;
  incrementReferenceCount: (userId: string) => void;
  addReference: (userId: string, dreamId: string) => void;
  incrementPublishCount: () => void;
}

export const useUserStore = create<UserStore>((set, get) => ({
  currentUser: getStorageData<User | null>(STORAGE_KEYS.CURRENT_USER, null),
  users: getStorageData<User[]>(STORAGE_KEYS.USERS, []),

  loadUsers: () => {
    const users = getStorageData<User[]>(STORAGE_KEYS.USERS, []);
    const currentUser = getStorageData<User | null>(STORAGE_KEYS.CURRENT_USER, null);
    set({ users, currentUser });
  },

  login: (nickname) => {
    const { users } = get();
    let existingUser = users.find((u) => u.nickname === nickname);

    if (!existingUser) {
      existingUser = {
        id: generateId(),
        nickname,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${nickname}`,
        bio: '',
        following: [],
        followers: [],
        referenceCount: 0,
        references: [],
        settings: {
          blockedKeywords: [],
          privacyLevel: 'anonymous',
          notificationEnabled: true,
        },
        createdAt: new Date(),
      };
      users.push(existingUser);
      setStorageData(STORAGE_KEYS.USERS, users);
    }

    setStorageData(STORAGE_KEYS.CURRENT_USER, existingUser);
    set({ currentUser: existingUser });
  },

  logout: () => {
    setStorageData(STORAGE_KEYS.CURRENT_USER, null);
    set({ currentUser: null });
  },

  isLoggedIn: false,

  updateSettings: (settings) => {
    const { currentUser, users } = get();
    if (!currentUser) return;

    const updatedUser: User = {
      ...currentUser,
      settings: { ...currentUser.settings, ...settings },
    };

    const updatedUsers = users.map((u) => (u.id === currentUser.id ? updatedUser : u));

    setStorageData(STORAGE_KEYS.USERS, updatedUsers);
    setStorageData(STORAGE_KEYS.CURRENT_USER, updatedUser);
    set({ currentUser: updatedUser, users: updatedUsers });
  },

  addBlockedKeyword: (keyword) => {
    const { currentUser } = get();
    if (!currentUser) return;

    const blockedKeywords = [...new Set([...currentUser.settings.blockedKeywords, keyword])];
    get().updateSettings({ blockedKeywords });
  },

  removeBlockedKeyword: (keyword) => {
    const { currentUser } = get();
    if (!currentUser) return;

    const blockedKeywords = currentUser.settings.blockedKeywords.filter((k: string) => k !== keyword);
    get().updateSettings({ blockedKeywords });
  },

  followUser: (userId) => {
    const { currentUser, users } = get();
    if (!currentUser || currentUser.id === userId) return;

    const updatedCurrentUser: User = {
      ...currentUser,
      following: [...new Set([...currentUser.following, userId])],
    };

    const targetUser = users.find((u) => u.id === userId);
    const updatedTargetUser = targetUser
      ? {
          ...targetUser,
          followers: [...new Set([...targetUser.followers, currentUser.id])],
        }
      : null;

    const updatedUsers = users.map((u) =>
      u.id === currentUser.id ? updatedCurrentUser : u.id === userId ? updatedTargetUser : u
    ).filter((u): u is User => u !== null);

    setStorageData(STORAGE_KEYS.USERS, updatedUsers);
    setStorageData(STORAGE_KEYS.CURRENT_USER, updatedCurrentUser);
    set({ currentUser: updatedCurrentUser, users: updatedUsers });
  },

  unfollowUser: (userId) => {
    const { currentUser, users } = get();
    if (!currentUser || currentUser.id === userId) return;

    const updatedCurrentUser: User = {
      ...currentUser,
      following: currentUser.following.filter((id: string) => id !== userId),
    };

    const targetUser = users.find((u) => u.id === userId);
    const updatedTargetUser = targetUser
      ? {
          ...targetUser,
          followers: targetUser.followers.filter((id: string) => id !== currentUser.id),
        }
      : null;

    const updatedUsers = users.map((u) =>
      u.id === currentUser.id ? updatedCurrentUser : u.id === userId ? updatedTargetUser : u
    ).filter((u): u is User => u !== null);

    setStorageData(STORAGE_KEYS.USERS, updatedUsers);
    setStorageData(STORAGE_KEYS.CURRENT_USER, updatedCurrentUser);
    set({ currentUser: updatedCurrentUser, users: updatedUsers });
  },

  isFollowing: (userId) => {
    const { currentUser } = get();
    return currentUser?.following.includes(userId) ?? false;
  },

  getFollowedUsers: () => {
    const { currentUser, users } = get();
    if (!currentUser) return [];
    return users.filter((u) => currentUser.following.includes(u.id));
  },

  getUserById: (userId) => {
    return get().users.find((u) => u.id === userId);
  },

  incrementReferenceCount: (userId) => {
    const { users } = get();
    const updatedUsers = users.map((u) =>
      u.id === userId ? { ...u, referenceCount: u.referenceCount + 1 } : u
    );
    setStorageData(STORAGE_KEYS.USERS, updatedUsers);
    set({ users: updatedUsers });
  },

  addReference: (userId, dreamId) => {
    const { users } = get();
    const updatedUsers = users.map((u) =>
      u.id === userId ? { ...u, references: [...u.references, dreamId] } : u
    );
    setStorageData(STORAGE_KEYS.USERS, updatedUsers);
    set({ users: updatedUsers });
  },

  incrementPublishCount: () => {},
}));
