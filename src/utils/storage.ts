export const STORAGE_KEYS = {
  DREAMS: 'dream_exchange_dreams',
  CURRENT_USER: 'dream_exchange_current_user',
  USERS: 'dream_exchange_users',
  COLLECTIONS: 'dream_exchange_collections',
  DRAFTS: 'dream_exchange_drafts',
  BLOCKED: 'dream_exchange_blocked',
};

export const getStorageData = <T>(key: string, defaultValue: T): T => {
  try {
    const data = localStorage.getItem(key);
    if (data === null) return defaultValue;
    return JSON.parse(data);
  } catch {
    return defaultValue;
  }
};

export const setStorageData = <T>(key: string, value: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error('Failed to save data:', error);
  }
};
