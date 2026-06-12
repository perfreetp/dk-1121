import { create } from 'zustand';
import { Collection, InspirationList, CreativeDraft } from '@/types';
import { getStorageData, setStorageData, STORAGE_KEYS } from '@/utils/storage';
import { generateId } from '@/utils/mockData';

interface CollectionStore {
  collections: Collection[];
  inspirationLists: InspirationList[];
  drafts: CreativeDraft[];
  collectedDreamIds: Set<string>;
  loadData: () => void;
  addToCollection: (dreamId: string) => void;
  removeFromCollection: (dreamId: string) => void;
  isCollected: (dreamId: string) => boolean;
  getCollectionById: (id: string) => Collection | undefined;
  createInspirationList: (title: string, dreams: any[], tags: string[]) => void;
  createDraft: (title: string, content: string, dreamIds: string[]) => void;
  updateDraft: (id: string, updates: Partial<CreativeDraft>) => void;
  deleteDraft: (id: string) => void;
  deleteInspirationList: (id: string) => void;
}

export const useCollectionStore = create<CollectionStore>((set, get) => ({
  collections: getStorageData<Collection[]>(STORAGE_KEYS.COLLECTIONS, []),
  inspirationLists: [],
  drafts: getStorageData<CreativeDraft[]>(STORAGE_KEYS.DRAFTS, []),
  collectedDreamIds: new Set(
    getStorageData<Collection[]>(STORAGE_KEYS.COLLECTIONS, []).flatMap((c) => c.dreamIds)
  ),

  loadData: () => {
    const collections = getStorageData<Collection[]>(STORAGE_KEYS.COLLECTIONS, []);
    const drafts = getStorageData<CreativeDraft[]>(STORAGE_KEYS.DRAFTS, []);
    set({
      collections,
      drafts,
      collectedDreamIds: new Set(collections.flatMap((c) => c.dreamIds)),
    });
  },

  addToCollection: (dreamId) => {
    const { collections, collectedDreamIds } = get();
    const defaultCollection = collections.find((c) => c.title === '默认收藏夹') || {
      id: generateId(),
      userId: 'current',
      dreamIds: [],
      title: '默认收藏夹',
      createdAt: new Date(),
    };

    if (collectedDreamIds.has(dreamId)) return;

    const updatedCollection = {
      ...defaultCollection,
      dreamIds: [...defaultCollection.dreamIds, dreamId],
    };

    const otherCollections = collections.filter((c) => c.id !== defaultCollection.id);
    const updatedCollections = [...otherCollections, updatedCollection];

    setStorageData(STORAGE_KEYS.COLLECTIONS, updatedCollections);
    set({
      collections: updatedCollections,
      collectedDreamIds: new Set([...collectedDreamIds, dreamId]),
    });
  },

  removeFromCollection: (dreamId) => {
    const { collections, collectedDreamIds } = get();
    const updatedCollections = collections.map((c) => ({
      ...c,
      dreamIds: c.dreamIds.filter((id) => id !== dreamId),
    }));

    setStorageData(STORAGE_KEYS.COLLECTIONS, updatedCollections);
    set({
      collections: updatedCollections,
      collectedDreamIds: new Set([...collectedDreamIds].filter((id) => id !== dreamId)),
    });
  },

  isCollected: (dreamId) => {
    return get().collectedDreamIds.has(dreamId);
  },

  getCollectionById: (id) => {
    return get().collections.find((c) => c.id === id);
  },

  createInspirationList: (title, dreams, tags) => {
    const newList: InspirationList = {
      id: generateId(),
      userId: 'current',
      title,
      dreams,
      tags,
      createdAt: new Date(),
    };
    set({ inspirationLists: [...get().inspirationLists, newList] });
  },

  createDraft: (title, content, dreamIds) => {
    const newDraft: CreativeDraft = {
      id: generateId(),
      userId: 'current',
      title,
      content,
      dreamIds,
      createdAt: new Date(),
    };
    const updated = [...get().drafts, newDraft];
    setStorageData(STORAGE_KEYS.DRAFTS, updated);
    set({ drafts: updated });
  },

  updateDraft: (id, updates) => {
    const updated = get().drafts.map((d) =>
      d.id === id ? { ...d, ...updates } : d
    );
    setStorageData(STORAGE_KEYS.DRAFTS, updated);
    set({ drafts: updated });
  },

  deleteDraft: (id) => {
    const updated = get().drafts.filter((d) => d.id !== id);
    setStorageData(STORAGE_KEYS.DRAFTS, updated);
    set({ drafts: updated });
  },

  deleteInspirationList: (id) => {
    set({
      inspirationLists: get().inspirationLists.filter((l) => l.id !== id),
    });
  },
}));
