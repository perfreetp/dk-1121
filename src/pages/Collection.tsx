import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Layers, Plus, Trash2, Copy, Sparkles, GripVertical, X } from 'lucide-react';
import { useCollectionStore } from '@/stores/collectionStore';
import { useDreamStore } from '@/stores/dreamStore';
import DreamCard from '@/components/dream/DreamCard';
import Modal from '@/components/common/Modal';
import { motion, AnimatePresence } from 'framer-motion';

type TabType = 'collected' | 'lists' | 'drafts';

const Collection: React.FC = () => {
  const navigate = useNavigate();
  const { collections, drafts, inspirationLists, loadData, removeFromCollection, createDraft, deleteDraft, deleteInspirationList } = useCollectionStore();
  const { getDreamById, loadDreams } = useDreamStore();
  const [activeTab, setActiveTab] = useState<TabType>('collected');
  const [showNewDraft, setShowNewDraft] = useState(false);
  const [draftTitle, setDraftTitle] = useState('');
  const [selectedDreamsForDraft, setSelectedDreamsForDraft] = useState<string[]>([]);

  useEffect(() => {
    loadData();
    loadDreams();
  }, []);

  const collectedDreams = collections.flatMap((c) => c.dreamIds.map((id) => getDreamById(id))).filter(Boolean);

  const tabs = [
    { id: 'collected' as TabType, label: '收藏', icon: <Heart size={16} />, count: collectedDreams.length },
    { id: 'lists' as TabType, label: '灵感清单', icon: <Sparkles size={16} />, count: inspirationLists.length },
    { id: 'drafts' as TabType, label: '创意草稿', icon: <Layers size={16} />, count: drafts.length },
  ];

  const handleAddToDraft = (dreamId: string) => {
    if (!selectedDreamsForDraft.includes(dreamId)) {
      setSelectedDreamsForDraft([...selectedDreamsForDraft, dreamId]);
    }
  };

  const handleRemoveFromDraft = (dreamId: string) => {
    setSelectedDreamsForDraft(selectedDreamsForDraft.filter((id) => id !== dreamId));
  };

  const handleCreateDraft = () => {
    if (!draftTitle.trim() || selectedDreamsForDraft.length === 0) {
      alert('请输入标题并选择至少一条梦境');
      return;
    }

    const content = selectedDreamsForDraft
      .map((id) => getDreamById(id)?.content)
      .filter(Boolean)
      .join('\n\n---\n\n');

    createDraft(draftTitle, content, selectedDreamsForDraft);
    setDraftTitle('');
    setSelectedDreamsForDraft([]);
    setShowNewDraft(false);
    setActiveTab('drafts');
  };

  const handleCopyDraft = (content: string) => {
    navigator.clipboard.writeText(content);
    alert('已复制到剪贴板');
  };

  const getGroupedDreams = () => {
    const grouped: Record<string, any[]> = {};
    collectedDreams.forEach((dream) => {
      if (dream) {
        const key = dream.category;
        if (!grouped[key]) grouped[key] = [];
        grouped[key].push(dream);
      }
    });
    return grouped;
  };

  return (
    <div className="min-h-screen pb-24">
      <header className="sticky top-0 z-40 bg-night-bg/95 backdrop-blur-md border-b border-dream-purple/10">
        <div className="max-w-lg mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold gradient-text font-serif">灵感收藏</h1>
            <button
              onClick={() => setShowNewDraft(true)}
              className="p-2 rounded-xl bg-dream-purple/20 hover:bg-dream-purple/30 transition-colors"
            >
              <Plus size={20} className="text-dream-purple" />
            </button>
          </div>

          <div className="flex gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-dream-purple text-white'
                    : 'bg-deep-indigo/50 text-moonlight/60 hover:text-moonlight border border-dream-purple/20'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
                <span className={`px-1.5 py-0.5 rounded-full text-xs ${
                  activeTab === tab.id ? 'bg-white/20' : 'bg-dream-purple/20'
                }`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-6">
        <AnimatePresence mode="wait">
          {activeTab === 'collected' && (
            <motion.div
              key="collected"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-6"
            >
              {collectedDreams.length === 0 ? (
                <div className="text-center py-12">
                  <Heart size={48} className="mx-auto text-moonlight/20 mb-4" />
                  <p className="text-moonlight/50">还没有收藏任何梦境</p>
                  <p className="text-moonlight/30 text-sm mt-1">去梦池发现有趣的梦境吧</p>
                  <button
                    onClick={() => navigate('/')}
                    className="mt-4 btn-secondary"
                  >
                    探索梦池
                  </button>
                </div>
              ) : (
                Object.entries(getGroupedDreams()).map(([category, dreams]) => (
                  <div key={category}>
                    <h3 className="text-sm font-medium text-moonlight/60 mb-3">{category}</h3>
                    <div className="space-y-3">
                      {dreams.map((dream) => dream && (
                        <div key={dream.id} className="relative group">
                          <DreamCard dream={dream} showActions={false} />
                          <button
                            onClick={() => {
                              removeFromCollection(dream.id);
                            }}
                            className="absolute top-3 right-3 p-2 rounded-lg bg-red-500/20 text-red-400 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500/30"
                          >
                            <X size={16} />
                          </button>
                          <button
                            onClick={() => handleAddToDraft(dream.id)}
                            className="absolute top-3 right-12 p-2 rounded-lg bg-star-gold/20 text-star-gold opacity-0 group-hover:opacity-100 transition-opacity hover:bg-star-gold/30"
                          >
                            <Plus size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </motion.div>
          )}

          {activeTab === 'lists' && (
            <motion.div
              key="lists"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-4"
            >
              {inspirationLists.length === 0 ? (
                <div className="text-center py-12">
                  <Sparkles size={48} className="mx-auto text-moonlight/20 mb-4" />
                  <p className="text-moonlight/50">还没有灵感清单</p>
                  <p className="text-moonlight/30 text-sm mt-1">收藏梦境后可以自动生成灵感清单</p>
                </div>
              ) : (
                inspirationLists.map((list) => (
                  <div key={list.id} className="card">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-medium text-moonlight">{list.title}</h3>
                      <button
                        onClick={() => deleteInspirationList(list.id)}
                        className="p-1.5 rounded-lg hover:bg-red-500/20 text-moonlight/40 hover:text-red-400 transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                    <p className="text-xs text-moonlight/50 mb-3">
                      {list.dreams.length} 条梦境 · {list.tags.join(', ')}
                    </p>
                    <div className="space-y-2">
                      {list.dreams.slice(0, 3).map((dream) => (
                        <p key={dream.id} className="text-sm text-moonlight/70 line-clamp-2">
                          {dream.content}
                        </p>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </motion.div>
          )}

          {activeTab === 'drafts' && (
            <motion.div
              key="drafts"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-4"
            >
              {drafts.length === 0 ? (
                <div className="text-center py-12">
                  <Layers size={48} className="mx-auto text-moonlight/20 mb-4" />
                  <p className="text-moonlight/50">还没有创意草稿</p>
                  <p className="text-moonlight/30 text-sm mt-1">将多条梦境拼接成短篇创意</p>
                  <button
                    onClick={() => setShowNewDraft(true)}
                    className="mt-4 btn-primary"
                  >
                    创建草稿
                  </button>
                </div>
              ) : (
                drafts.map((draft) => (
                  <div key={draft.id} className="card">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-medium text-moonlight">{draft.title}</h3>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleCopyDraft(draft.content)}
                          className="p-1.5 rounded-lg hover:bg-dream-purple/20 text-moonlight/40 hover:text-dream-purple transition-colors"
                          title="复制内容"
                        >
                          <Copy size={14} />
                        </button>
                        <button
                          onClick={() => deleteDraft(draft.id)}
                          className="p-1.5 rounded-lg hover:bg-red-500/20 text-moonlight/40 hover:text-red-400 transition-colors"
                          title="删除草稿"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                    <p className="text-xs text-moonlight/50 mb-3">
                      包含 {draft.dreamIds.length} 条梦境片段
                    </p>
                    <p className="text-sm text-moonlight/70 leading-relaxed line-clamp-6 whitespace-pre-wrap">
                      {draft.content}
                    </p>
                  </div>
                ))
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <Modal isOpen={showNewDraft} onClose={() => setShowNewDraft(false)} title="创建创意草稿">
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-moonlight/70 mb-2 block">草稿标题</label>
            <input
              type="text"
              value={draftTitle}
              onChange={(e) => setDraftTitle(e.target.value)}
              placeholder="给草稿起个名字..."
              className="input-field"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-moonlight/70 mb-2 block">
              选择梦境片段 ({selectedDreamsForDraft.length})
            </label>
            <div className="space-y-2 max-h-[200px] overflow-y-auto">
              {collectedDreams.length === 0 ? (
                <p className="text-sm text-moonlight/40 text-center py-4">
                  暂无收藏梦境
                </p>
              ) : (
                collectedDreams.map((dream) => dream && (
                  <div
                    key={dream.id}
                    onClick={() => handleAddToDraft(dream.id)}
                    className={`p-3 rounded-xl cursor-pointer transition-all ${
                      selectedDreamsForDraft.includes(dream.id)
                        ? 'bg-dream-purple/30 border border-dream-purple'
                        : 'bg-deep-indigo/30 border border-dream-purple/10 hover:border-dream-purple/30'
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      <GripVertical size={16} className="text-moonlight/30 mt-1 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-moonlight/50 mb-1">@{dream.userNickname}</p>
                        <p className="text-sm text-moonlight/80 line-clamp-2">{dream.content}</p>
                      </div>
                      {selectedDreamsForDraft.includes(dream.id) && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveFromDraft(dream.id);
                          }}
                          className="p-1 rounded-full bg-red-500/20 text-red-400"
                        >
                          <X size={12} />
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <button
            onClick={handleCreateDraft}
            disabled={!draftTitle.trim() || selectedDreamsForDraft.length === 0}
            className={`w-full py-3 rounded-xl font-medium transition-all ${
              draftTitle.trim() && selectedDreamsForDraft.length > 0
                ? 'btn-primary'
                : 'bg-deep-indigo/30 text-moonlight/40 cursor-not-allowed'
            }`}
          >
            生成草稿
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default Collection;
