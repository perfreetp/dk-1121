import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, 
  LogOut, 
  ChevronRight, 
  FileText, 
  Quote, 
  Users, 
  Heart,
  Shield,
  Plus,
  X
} from 'lucide-react';
import { useUserStore } from '@/stores/userStore';
import { useDreamStore } from '@/stores/dreamStore';
import { useCollectionStore } from '@/stores/collectionStore';
import DreamCard from '@/components/dream/DreamCard';
import Modal from '@/components/common/Modal';
import { motion } from 'framer-motion';

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser, isLoggedIn, logout, login, addBlockedKeyword, removeBlockedKeyword } = useUserStore();
  const { dreams, loadDreams } = useDreamStore();
  const { loadData, collectedDreamIds } = useCollectionStore();
  
  const [nickname, setNickname] = useState('');
  const [showLogin, setShowLogin] = useState(false);
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [newKeyword, setNewKeyword] = useState('');
  const [activeSection, setActiveSection] = useState<'posts' | 'cited' | null>(null);

  useEffect(() => {
    loadDreams();
    loadData();
  }, []);

  const myDreams = currentUser 
    ? dreams.filter((d) => d.userId === currentUser.id)
    : [];

  const citedDreams = currentUser
    ? dreams.filter((d) => d.originalDreamId && dreams.find((orig) => orig.id === d.originalDreamId)?.userId === currentUser.id)
    : [];

  const collectedCount = collectedDreamIds.size;

  const handleLogin = () => {
    if (nickname.trim().length < 2) {
      alert('昵称至少需要2个字符');
      return;
    }
    login(nickname.trim());
    setShowLogin(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleAddKeyword = () => {
    if (newKeyword.trim()) {
      addBlockedKeyword(newKeyword.trim());
      setNewKeyword('');
    }
  };

  const handleRemoveKeyword = (keyword: string) => {
    removeBlockedKeyword(keyword);
  };

  const stats = [
    { label: '发布数', value: currentUser?.publishCount || 0, icon: <FileText size={18} /> },
    { label: '被引用', value: currentUser?.citedCount || 0, icon: <Quote size={18} /> },
    { label: '收藏数', value: collectedCount, icon: <Heart size={18} /> },
    { label: '关注者', value: currentUser?.followers || 0, icon: <Users size={18} /> },
  ];

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen pb-24 flex items-center justify-center">
        <div className="text-center px-6">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-dream-purple to-deep-indigo p-1">
            <div className="w-full h-full rounded-full bg-night-bg flex items-center justify-center">
              <User size={40} className="text-dream-purple" />
            </div>
          </div>
          <h2 className="text-xl font-semibold text-moonlight mb-2">欢迎来到梦境交换</h2>
          <p className="text-moonlight/60 text-sm mb-6 max-w-xs mx-auto">
            设置一个匿名昵称，开始你的梦境探索之旅
          </p>
          <button
            onClick={() => setShowLogin(true)}
            className="btn-primary"
          >
            <Plus size={18} className="inline mr-2" />
            创建身份
          </button>
        </div>

        <Modal isOpen={showLogin} onClose={() => setShowLogin(false)} title="设置匿名身份">
          <div className="space-y-4">
            <p className="text-sm text-moonlight/60">
              你的昵称将显示在发布的梦境旁边。我们保护你的隐私，不收集任何个人信息。
            </p>
            <input
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="输入匿名昵称..."
              className="input-field"
              maxLength={10}
            />
            <button onClick={handleLogin} className="btn-primary w-full">
              开始探索
            </button>
          </div>
        </Modal>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24">
      <header className="sticky top-0 z-40 bg-night-bg/95 backdrop-blur-md border-b border-dream-purple/10">
        <div className="max-w-lg mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-lg font-semibold text-moonlight">个人主页</h1>
            <button
              onClick={() => setShowBlockModal(true)}
              className="p-2 rounded-xl hover:bg-dream-purple/20 transition-colors"
            >
              <Shield size={20} className="text-moonlight/70" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-6 space-y-6">
        <section className="card">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-dream-purple to-star-gold p-1">
              <img
                src={currentUser?.avatar}
                alt={currentUser?.nickname}
                className="w-full h-full rounded-full bg-deep-indigo"
              />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-moonlight">{currentUser?.nickname}</h2>
              <p className="text-sm text-moonlight/50">加入于 {new Date(currentUser?.createdAt || '').toLocaleDateString()}</p>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-3">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center p-3 rounded-xl bg-deep-indigo/30">
                <div className="text-dream-purple mb-1 flex justify-center">{stat.icon}</div>
                <p className="text-lg font-semibold text-moonlight">{stat.value}</p>
                <p className="text-xs text-moonlight/50">{stat.label}</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setActiveSection(activeSection === 'posts' ? null : 'posts')}
              className={`flex-1 py-3 rounded-xl font-medium transition-all flex items-center justify-center gap-2 ${
                activeSection === 'posts'
                  ? 'bg-dream-purple text-white'
                  : 'bg-deep-indigo/50 text-moonlight/70 border border-dream-purple/20'
              }`}
            >
              <FileText size={16} />
              我的发布 ({myDreams.length})
            </button>
            <button
              onClick={() => setActiveSection(activeSection === 'cited' ? null : 'cited')}
              className={`flex-1 py-3 rounded-xl font-medium transition-all flex items-center justify-center gap-2 ${
                activeSection === 'cited'
                  ? 'bg-dream-purple text-white'
                  : 'bg-deep-indigo/50 text-moonlight/70 border border-dream-purple/20'
              }`}
            >
              <Quote size={16} />
              被引用 ({citedDreams.length})
            </button>
          </div>

          {activeSection === 'posts' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              {myDreams.length === 0 ? (
                <div className="text-center py-8">
                  <FileText size={32} className="mx-auto text-moonlight/20 mb-3" />
                  <p className="text-sm text-moonlight/50">还没有发布任何梦境</p>
                  <button
                    onClick={() => navigate('/publish')}
                    className="mt-3 btn-secondary text-sm"
                  >
                    发布梦境
                  </button>
                </div>
              ) : (
                myDreams.map((dream) => (
                  <DreamCard key={dream.id} dream={dream} showActions={false} />
                ))
              )}
            </motion.div>
          )}

          {activeSection === 'cited' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              {citedDreams.length === 0 ? (
                <div className="text-center py-8">
                  <Quote size={32} className="mx-auto text-moonlight/20 mb-3" />
                  <p className="text-sm text-moonlight/50">还没有被引用的梦境</p>
                  <p className="text-xs text-moonlight/30 mt-1">参与主题接龙可能被引用哦</p>
                </div>
              ) : (
                citedDreams.map((dream) => (
                  <DreamCard key={dream.id} dream={dream} showActions={false} />
                ))
              )}
            </motion.div>
          )}
        </section>

        <section className="space-y-2">
          <button
            onClick={() => navigate('/collection')}
            className="w-full flex items-center justify-between p-4 rounded-xl bg-deep-indigo/30 hover:bg-deep-indigo/50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Heart size={20} className="text-red-400" />
              <span className="text-moonlight">我的收藏</span>
            </div>
            <ChevronRight size={18} className="text-moonlight/40" />
          </button>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-between p-4 rounded-xl bg-deep-indigo/30 hover:bg-red-500/10 transition-colors group"
          >
            <div className="flex items-center gap-3">
              <LogOut size={20} className="text-moonlight/60 group-hover:text-red-400" />
              <span className="text-moonlight/60 group-hover:text-red-400">退出登录</span>
            </div>
          </button>
        </section>
      </main>

      <Modal isOpen={showBlockModal} onClose={() => setShowBlockModal(false)} title="内容屏蔽设置">
        <div className="space-y-4">
          <p className="text-sm text-moonlight/60">
            设置屏蔽关键词，包含这些词的梦境内容将被隐藏
          </p>
          
          <div className="flex gap-2">
            <input
              type="text"
              value={newKeyword}
              onChange={(e) => setNewKeyword(e.target.value)}
              placeholder="输入关键词..."
              className="input-field flex-1"
              onKeyDown={(e) => e.key === 'Enter' && handleAddKeyword()}
            />
            <button onClick={handleAddKeyword} className="btn-secondary px-4">
              <Plus size={18} />
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            {currentUser?.blockedKeywords.map((keyword) => (
              <span
                key={keyword}
                className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-deep-indigo/50 text-moonlight/80 text-sm"
              >
                {keyword}
                <button
                  onClick={() => handleRemoveKeyword(keyword)}
                  className="ml-1 hover:text-red-400"
                >
                  <X size={12} />
                </button>
              </span>
            ))}
            {(!currentUser?.blockedKeywords || currentUser.blockedKeywords.length === 0) && (
              <p className="text-sm text-moonlight/40 w-full text-center py-4">暂无屏蔽关键词</p>
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Profile;
