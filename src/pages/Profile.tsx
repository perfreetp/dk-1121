import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, UserPlus, UserCheck, Settings, BookOpen, Sparkles, Edit3, LogOut, Heart } from 'lucide-react';
import { useUserStore } from '@/stores/userStore';
import { useDreamStore } from '@/stores/dreamStore';
import DreamCard from '@/components/dream/DreamCard';
import Modal from '@/components/common/Modal';
import { motion, AnimatePresence } from 'framer-motion';
import { Dream } from '@/types';

type TabType = 'dreams' | 'relays' | 'references';

const Profile: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const { currentUser, loadUsers, followUser, unfollowUser, isFollowing, getUserById, logout } = useUserStore();
  const { getDreamsByUser, getDreamsByIds, loadDreams } = useDreamStore();
  const [activeTab, setActiveTab] = useState<TabType>('dreams');
  const [showSettings, setShowSettings] = useState(false);
  const [showEditBio, setShowEditBio] = useState(false);
  const [bio, setBio] = useState('');

  useEffect(() => {
    loadUsers();
    loadDreams();
  }, []);

  const profileUser = userId ? getUserById(userId) : currentUser;
  const isOwnProfile = !userId || userId === currentUser?.id;
  const following = isFollowing(userId || '');

  const userDreams = profileUser ? getDreamsByUser(profileUser.id) : [];
  const relayDreams = userDreams.filter((d: Dream) => d.relayFromId);
  const referenceDreams = profileUser ? getDreamsByIds(profileUser.references) : [];

  const tabs = [
    { id: 'dreams' as TabType, label: '发布', icon: <BookOpen size={16} />, count: userDreams.length },
    { id: 'relays' as TabType, label: '续写', icon: <Sparkles size={16} />, count: relayDreams.length },
    { id: 'references' as TabType, label: '被引用', icon: <Heart size={16} />, count: profileUser?.referenceCount || 0 },
  ];

  const handleFollow = () => {
    if (!userId || !currentUser) return;
    if (following) {
      unfollowUser(userId);
    } else {
      followUser(userId);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleSaveBio = () => {
    if (!currentUser) return;
    setShowEditBio(false);
  };

  if (!profileUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-moonlight/50">用户不存在</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24">
      <header className="sticky top-0 z-40 bg-night-bg/95 backdrop-blur-md border-b border-dream-purple/10">
        <div className="max-w-lg mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate(-1)}
              className="p-2 rounded-xl hover:bg-deep-indigo/50 transition-colors"
            >
              <ArrowLeft size={20} className="text-moonlight" />
            </button>
            {isOwnProfile && (
              <button
                onClick={() => setShowSettings(true)}
                className="p-2 rounded-xl hover:bg-deep-indigo/50 transition-colors"
              >
                <Settings size={20} className="text-moonlight" />
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-6">
        <div className="text-center mb-8">
          <div className="relative inline-block mb-4">
            <img
              src={profileUser.avatar}
              alt={profileUser.nickname}
              className="w-24 h-24 rounded-full object-cover border-4 border-dream-purple/30"
            />
            {isOwnProfile && (
              <button
                onClick={() => setShowEditBio(true)}
                className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-dream-purple flex items-center justify-center"
              >
                <Edit3 size={14} className="text-white" />
              </button>
            )}
          </div>

          <h1 className="text-xl font-bold text-moonlight mb-1">@{profileUser.nickname}</h1>
          
          {profileUser.bio ? (
            <p className="text-sm text-moonlight/60 mb-4">{profileUser.bio}</p>
          ) : isOwnProfile ? (
            <button
              onClick={() => setShowEditBio(true)}
              className="text-sm text-moonlight/40 hover:text-dream-purple transition-colors mb-4"
            >
              添加个人简介...
            </button>
          ) : null}

          <div className="flex items-center justify-center gap-8 mb-4">
            <div className="text-center">
              <p className="text-lg font-bold text-moonlight">{userDreams.length}</p>
              <p className="text-xs text-moonlight/50">发布</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-moonlight">{profileUser.following.length}</p>
              <p className="text-xs text-moonlight/50">关注</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-moonlight">{profileUser.followers.length}</p>
              <p className="text-xs text-moonlight/50">粉丝</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-star-gold">{profileUser.referenceCount}</p>
              <p className="text-xs text-moonlight/50">被引用</p>
            </div>
          </div>

          {!isOwnProfile && currentUser && (
            <button
              onClick={handleFollow}
              className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-full font-medium transition-all ${
                following
                  ? 'bg-deep-indigo/50 text-moonlight border border-dream-purple/30'
                  : 'bg-gradient-to-r from-dream-purple to-star-gold text-white'
              }`}
            >
              {following ? (
                <>
                  <UserCheck size={16} />
                  <span>已关注</span>
                </>
              ) : (
                <>
                  <UserPlus size={16} />
                  <span>关注</span>
                </>
              )}
            </button>
          )}
        </div>

        <div className="flex gap-2 mb-4">
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

        <AnimatePresence mode="wait">
          {activeTab === 'dreams' && (
            <motion.div
              key="dreams"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-4"
            >
              {userDreams.length === 0 ? (
                <div className="text-center py-12">
                  <BookOpen size={48} className="mx-auto text-moonlight/20 mb-4" />
                  <p className="text-moonlight/50">还没有发布任何梦境</p>
                </div>
              ) : (
                userDreams.map((dream: Dream, index: number) => (
                  <div
                    key={dream.id}
                    style={{ animationDelay: `${index * 100}ms` }}
                    className="animate-fade-in"
                  >
                    <DreamCard dream={dream} />
                  </div>
                ))
              )}
            </motion.div>
          )}

          {activeTab === 'relays' && (
            <motion.div
              key="relays"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-4"
            >
              {relayDreams.length === 0 ? (
                <div className="text-center py-12">
                  <Sparkles size={48} className="mx-auto text-moonlight/20 mb-4" />
                  <p className="text-moonlight/50">还没有续写任何梦境</p>
                </div>
              ) : (
                relayDreams.map((dream: Dream, index: number) => (
                  <div
                    key={dream.id}
                    style={{ animationDelay: `${index * 100}ms` }}
                    className="animate-fade-in"
                  >
                    <DreamCard dream={dream} />
                  </div>
                ))
              )}
            </motion.div>
          )}

          {activeTab === 'references' && (
            <motion.div
              key="references"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-4"
            >
              {referenceDreams.length === 0 ? (
                <div className="text-center py-12">
                  <Heart size={48} className="mx-auto text-moonlight/20 mb-4" />
                  <p className="text-moonlight/50">还没有被引用</p>
                </div>
              ) : (
                referenceDreams.map((dream: Dream, index: number) => (
                  <div
                    key={dream.id}
                    style={{ animationDelay: `${index * 100}ms` }}
                    className="animate-fade-in"
                  >
                    <DreamCard dream={dream} />
                  </div>
                ))
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <Modal isOpen={showSettings} onClose={() => setShowSettings(false)} title="设置">
        <div className="space-y-4">
          <button
            onClick={() => setShowEditBio(true)}
            className="w-full py-3 rounded-xl bg-deep-indigo/30 text-moonlight font-medium hover:bg-deep-indigo/50 transition-colors flex items-center gap-3"
          >
            <Edit3 size={18} />
            <span>编辑个人简介</span>
          </button>
          <button
            onClick={handleLogout}
            className="w-full py-3 rounded-xl bg-red-500/20 text-red-400 font-medium hover:bg-red-500/30 transition-colors flex items-center gap-3"
          >
            <LogOut size={18} />
            <span>退出登录</span>
          </button>
        </div>
      </Modal>

      <Modal isOpen={showEditBio} onClose={() => setShowEditBio(false)} title="编辑个人简介">
        <div className="space-y-4">
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="说说你自己..."
            rows={4}
            className="input-field resize-none"
          />
          <button
            onClick={handleSaveBio}
            className="w-full py-3 rounded-xl bg-dream-purple text-white font-medium hover:bg-dream-purple/80 transition-colors"
          >
            保存
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default Profile;
