export type DreamCategory = 
  | '奇幻'
  | '惊悚'
  | '校园'
  | '亲情'
  | '悬疑'
  | '温情'
  | '荒诞'
  | '其他';

export type CreativeTag = 
  | '画面感强'
  | '故事性强'
  | '荒诞度高'
  | '意境优美'
  | '情感真挚'
  | '悬念十足';

export type EmotionLevel = 1 | 2 | 3 | 4 | 5;

export interface UserSettings {
  blockedKeywords: string[];
  privacyLevel: 'anonymous' | 'public';
  notificationEnabled: boolean;
}

export interface User {
  id: string;
  nickname: string;
  avatar: string;
  bio: string;
  following: string[];
  followers: string[];
  referenceCount: number;
  references: string[];
  settings: UserSettings;
  createdAt: Date;
}

export interface Dream {
  id: string;
  userId: string;
  userNickname: string;
  content: string;
  category: DreamCategory;
  emotionLevel: EmotionLevel;
  creativeTags: CreativeTag[];
  relayFromId?: string;
  relayCount: number;
  collectCount: number;
  createdAt: Date;
}

export interface Theme {
  id: string;
  title: string;
  description: string;
  date: Date;
  participantCount: number;
  dreamIds: string[];
}

export interface Collection {
  id: string;
  userId: string;
  dreamIds: string[];
  title: string;
  createdAt: Date;
}

export interface InspirationList {
  id: string;
  userId: string;
  title: string;
  dreams: Dream[];
  tags: string[];
  createdAt: Date;
}

export interface CreativeDraft {
  id: string;
  userId: string;
  title: string;
  content: string;
  dreamIds: string[];
  createdAt: Date;
}

export interface Relay {
  id: string;
  themeId: string;
  originalDreamId?: string;
  relayContent: string;
  userId: string;
  userNickname: string;
  createdAt: Date;
}

export const CATEGORIES: DreamCategory[] = [
  '奇幻', '惊悚', '校园', '亲情', '悬疑', '温情', '荒诞', '其他'
];

export const CREATIVE_TAGS: CreativeTag[] = [
  '画面感强', '故事性强', '荒诞度高', '意境优美', '情感真挚', '悬念十足'
];

export const EMOTION_LABELS: Record<EmotionLevel, { label: string; color: string }> = {
  1: { label: '平静', color: '#98d8c8' },
  2: { label: '轻微', color: '#7ec8e3' },
  3: { label: '适中', color: '#f9c74f' },
  4: { label: '强烈', color: '#ff6b6b' },
  5: { label: '剧烈', color: '#9b59b6' },
};

export const CATEGORY_COLORS: Record<DreamCategory, string> = {
  '奇幻': 'bg-purple-500/20 text-purple-300 border-purple-500/30',
  '惊悚': 'bg-red-500/20 text-red-300 border-red-500/30',
  '校园': 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  '亲情': 'bg-pink-500/20 text-pink-300 border-pink-500/30',
  '悬疑': 'bg-gray-500/20 text-gray-300 border-gray-500/30',
  '温情': 'bg-orange-500/20 text-orange-300 border-orange-500/30',
  '荒诞': 'bg-green-500/20 text-green-300 border-green-500/30',
  '其他': 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
};
