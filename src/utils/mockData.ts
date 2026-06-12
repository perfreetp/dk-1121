import { Dream, Theme, User } from '@/types';

export const mockUsers: User[] = [
  {
    id: 'user1',
    nickname: '星空漫步者',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=starwalker',
    publishCount: 12,
    citedCount: 45,
    followers: 128,
    following: 34,
    blockedKeywords: [],
    createdAt: new Date('2024-01-01'),
  },
  {
    id: 'user2',
    nickname: '深海梦境',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=deepsea',
    publishCount: 8,
    citedCount: 23,
    followers: 67,
    following: 21,
    blockedKeywords: [],
    createdAt: new Date('2024-01-05'),
  },
  {
    id: 'user3',
    nickname: '云端旅人',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=cloudtraveler',
    publishCount: 15,
    citedCount: 67,
    followers: 203,
    following: 45,
    blockedKeywords: [],
    createdAt: new Date('2024-01-10'),
  },
];

export const mockDreams: Dream[] = [
  {
    id: 'dream1',
    userId: 'user1',
    userNickname: '星空漫步者',
    content: '我站在一片无尽的银色海滩上，脚下不是沙粒，而是无数破碎的水晶镜面。每走一步，脚下就会亮起微弱的光，像是踩在星星上。海平面上漂浮着一座座城市倒影，却比真实世界更加繁华。那些建筑的轮廓不断变换，有时是哥特式尖顶，有时是东方飞檐...',
    category: '奇幻',
    emotionLevel: 3,
    creativeTags: ['画面感强', '意境优美'],
    relayCount: 12,
    collectCount: 45,
    createdAt: new Date('2024-01-15'),
  },
  {
    id: 'dream2',
    userId: 'user2',
    userNickname: '深海梦境',
    content: '旧校舍的走廊没有尽头，两侧的门上都贴着褪色的春联。我数到第37扇门时，门突然自己打开了。里面是一间教室，黑板上写着不属于任何语言的符号，粉笔在无人触碰的情况下自己移动，写出的字迹像是某种警告。最后一个符号还没写完，窗外传来下课铃声...',
    category: '惊悚',
    emotionLevel: 4,
    creativeTags: ['悬念十足', '荒诞度高'],
    relayCount: 8,
    collectCount: 32,
    createdAt: new Date('2024-01-14'),
  },
  {
    id: 'dream3',
    userId: 'user3',
    userNickname: '云端旅人',
    content: '爷爷的老房子里有一部永远停在三楼的电梯。每次按下按钮，电梯门打开时，里面都是不同的场景——有时是盛夏的麦田，有时是飘雪的街道，有时是陌生人的客厅。我在里面遇见了很多人，他们都说自己在等一个回不去的人...',
    category: '亲情',
    emotionLevel: 5,
    creativeTags: ['情感真挚', '故事性强'],
    relayCount: 23,
    collectCount: 89,
    createdAt: new Date('2024-01-13'),
  },
  {
    id: 'dream4',
    userId: 'user1',
    userNickname: '星空漫步者',
    content: '我发现自己能够进入别人的梦境，像是一个透明的观察者。小明的梦里全是考试不及格的恐惧，小美的梦里有一只永远追不到的白色小猫，而我自己的梦里，居然住着另一个我自己。他说：「你已经来了三百七十二次了。」',
    category: '悬疑',
    emotionLevel: 3,
    creativeTags: ['故事性强', '悬念十足'],
    relayCount: 31,
    collectCount: 56,
    createdAt: new Date('2024-01-12'),
  },
  {
    id: 'dream5',
    userId: 'user2',
    userNickname: '深海梦境',
    content: '图书馆的书会自己移动位置，但只有我能看见。我按照书的指引，在某个雨夜找到了藏在《时间简史》第372页里的一封信。信上只有一句话：「图书馆明天就要沉入海底了，快带我们离开。」',
    category: '荒诞',
    emotionLevel: 2,
    creativeTags: ['荒诞度高', '故事性强'],
    relayCount: 15,
    collectCount: 41,
    createdAt: new Date('2024-01-11'),
  },
  {
    id: 'dream6',
    userId: 'user3',
    userNickname: '云端旅人',
    content: '校园里有一棵传说中的许愿树，据说在满月时分把愿望写在树叶上，愿望就会成真。我偷偷去了，却发现自己不会写字——在梦里，我从未学过任何文字。但奇怪的是，每片落叶上都已写好了字，是同一种我不认识的文字...',
    category: '校园',
    emotionLevel: 3,
    creativeTags: ['意境优美', '悬念十足'],
    relayCount: 19,
    collectCount: 67,
    createdAt: new Date('2024-01-10'),
  },
  {
    id: 'dream7',
    userId: 'user1',
    userNickname: '星空漫步者',
    content: '梦里我回到了小时候住的老房子，但一切都是倒着的——时钟逆时针转动，水往高处流。最可怕的是，爸爸妈妈的脸上没有五官，只有光滑的皮肤。他们依然在说话，依然在叫我吃饭，但我听不见任何声音...',
    category: '惊悚',
    emotionLevel: 5,
    creativeTags: ['荒诞度高', '情感真挚'],
    relayCount: 42,
    collectCount: 103,
    createdAt: new Date('2024-01-09'),
  },
  {
    id: 'dream8',
    userId: 'user2',
    userNickname: '深海梦境',
    content: '下雨天，我撑着一把透明的伞走在街上。每一滴落在伞上的雨都变成了一颗小小的星星，收集在伞柄的容器里。走到街角时，整个城市都已经装满了星星，路人们都在抬头看天，等待着今晚最亮的那一滴...',
    category: '温情',
    emotionLevel: 2,
    creativeTags: ['画面感强', '意境优美'],
    relayCount: 27,
    collectCount: 78,
    createdAt: new Date('2024-01-08'),
  },
  {
    id: 'dream9',
    userId: 'user3',
    userNickname: '云端旅人',
    content: '我在一座由音符构成的森林里迷路了。每一棵树都是不同的乐器，风吹过时就会发出不同的旋律。我循着最悲伤的那首曲子走去，发现演奏者是一个没有实体的幽灵指挥家。他转过身，对我微微一笑：「你是第一个听到这支曲子的人。」',
    category: '奇幻',
    emotionLevel: 4,
    creativeTags: ['画面感强', '故事性强'],
    relayCount: 35,
    collectCount: 92,
    createdAt: new Date('2024-01-07'),
  },
  {
    id: 'dream10',
    userId: 'user1',
    userNickname: '星空漫步者',
    content: '外婆的厨房里有一扇永远打不开的门。梦里我终于鼓起勇气去推，门开了，里面是一片无边无际的向日葵花田。外婆站在花田中央，背对着我。「外婆，你怎么在这里？」她转过身，但脸不是外婆的——是一面镜子，映照着我自己的脸...',
    category: '亲情',
    emotionLevel: 4,
    creativeTags: ['情感真挚', '荒诞度高'],
    relayCount: 51,
    collectCount: 134,
    createdAt: new Date('2024-01-06'),
  },
];

export const mockThemes: Theme[] = [
  {
    id: 'theme1',
    title: '时间的裂缝',
    description: '你在某处发现了一道裂缝，透过它能看到不同的时空。你会怎么做？',
    date: new Date(),
    participantCount: 156,
    dreamIds: ['dream4'],
  },
  {
    id: 'theme2',
    title: '遗失的信件',
    description: '在抽屉深处发现一封从未寄出的信，收件人竟然是自己。信里写了什么？',
    date: new Date(Date.now() - 86400000),
    participantCount: 203,
    dreamIds: [],
  },
  {
    id: 'theme3',
    title: '镜中世界',
    description: '镜子里的倒影开始做你不敢做的事，或者，你开始怀疑自己才是倒影...',
    date: new Date(Date.now() - 172800000),
    participantCount: 178,
    dreamIds: [],
  },
];

export function generateId(): string {
  return Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
}

export function formatDate(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  
  if (days === 0) return '今天';
  if (days === 1) return '昨天';
  if (days < 7) return `${days}天前`;
  if (days < 30) return `${Math.floor(days / 7)}周前`;
  return date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' });
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}
