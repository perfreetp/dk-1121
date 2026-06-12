const STORAGE_KEYS = {
  DREAMS: 'dream_exchange_dreams',
  USER: 'dream_exchange_user',
  COLLECTIONS: 'dream_exchange_collections',
  DRAFTS: 'dream_exchange_drafts',
  BLOCKED: 'dream_exchange_blocked',
} as const;

export function getStorageData<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch {
    return defaultValue;
  }
}

export function setStorageData<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error('Storage error:', error);
  }
}

export function removeStorageData(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error('Storage error:', error);
  }
}

export { STORAGE_KEYS };
