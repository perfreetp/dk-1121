import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Shuffle, PenLine, ChevronRight, Users, Clock } from 'lucide-react';
import { useThemeStore } from '@/stores/themeStore';
import { useDreamStore } from '@/stores/dreamStore';
import { useUserStore } from '@/stores/userStore';
import ThemeCard from '@/components/relay/ThemeCard';
import DreamCard from '@/components/dream/DreamCard';
import Modal from '@/components/common/Modal';
import TagSelector from '@/components/common/TagSelector';
import { CREATIVE_TAGS, CreativeTag, EmotionLevel } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';

const Relay: React.FC = () => {
  const navigate = useNavigate();
  const { themes, getTodayTheme, addParticipant, addDreamToTheme } = useThemeStore();
  const { dreams, addDream, getDreamById, incrementRelayCount } = useDreamStore();
  const { currentUser } = useUserStore();

  const [relayContent, setRelayContent] = useState('');
  const [showRelayModal, setShowRelayModal] = useState(false);
  const [creativeTags, setCreativeTags] = useState<CreativeTag[]>([]);
  const [emotionLevel] = useState<EmotionLevel>(3);
  const [isPicking, setIsPicking] = useState(false);
  const [pickedDreamId, setPickedDreamId] = useState<string | null>(null);

  const todayTheme = getTodayTheme();

  const handleRandomPick = () => {
    setIsPicking(true);
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * dreams.length);
      setPickedDreamId(dreams[randomIndex].id);
      setIsPicking(false);
    }, 800);
  };

  const pickedDream = pickedDreamId ? getDreamById(pickedDreamId) : null;

  const handleStartRelay = () => {
    if (pickedDreamId) {
      setShowRelayModal(true);
    }
  };

  const handleSubmitRelay = () => {
    if (!relayContent.trim() || relayContent.length < 20) {
      alert('续写内容至少需要20个字符');
      return;
    }

    addDream({
      userId: currentUser?.id || 'anonymous',
      userNickname: currentUser?.nickname || '匿名旅人',
      content: relayContent,
      category: pickedDream?.category || '奇幻',
      emotionLevel,
      creativeTags,
      relayFromId: pickedDreamId || undefined,
      relayCount: 0,
      collectCount: 0,
    });

    if (pickedDreamId) {
      addDreamToTheme(todayTheme.id, pickedDreamId);
      addParticipant(todayTheme.id);
      incrementRelayCount(pickedDreamId);
    }

    setShowRelayModal(false);
    setRelayContent('');
    setPickedDreamId(null);
    setCreativeTags([]);
    navigate('/');
  };

  return (
    <div className="min-h-screen pb-24">
      <header className="sticky top-0 z-40 bg-night-bg/95 backdrop-blur-md border-b border-dream-purple/10">
        <div className="max-w-lg mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate(-1)}
              className="p-2 -ml-2 rounded-xl hover:bg-dream-purple/20 transition-colors"
            >
              <ArrowLeft size={22} className="text-moonlight" />
            </button>
            <h1 className="text-lg font-semibold text-moonlight">主题接龙</h1>
            <div className="w-10" />
          </div>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-6 space-y-6">
        <section>
          <ThemeCard theme={todayTheme} isToday />
        </section>

        <section className="card">
          <h3 className="text-sm font-medium text-moonlight/70 mb-4 flex items-center gap-2">
            <Shuffle size={16} className="text-dream-purple" />
            随机抽取陌生梦
          </h3>
          
          <div className="flex gap-3">
            <button
              onClick={handleRandomPick}
              disabled={isPicking}
              className="flex-1 py-3 rounded-xl bg-gradient-to-r from-dream-purple to-deep-indigo text-moonlight font-medium transition-all hover:shadow-lg hover:shadow-dream-purple/30 disabled:opacity-50"
            >
              <div className="flex items-center justify-center gap-2">
                <Shuffle size={18} className={isPicking ? 'animate-spin' : ''} />
                <span>{isPicking ? '抽取中...' : '随机抽取'}</span>
              </div>
            </button>
          </div>

          <AnimatePresence mode="wait">
            {pickedDream && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4"
              >
                <div className="p-4 rounded-xl bg-deep-indigo/50 border border-dream-purple/20">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs text-moonlight/50">
                      来自 @{pickedDream.userNickname} 的梦境
                    </span>
                    <span className="tag">{pickedDream.category}</span>
                  </div>
                  <p className="text-moonlight/90 text-sm leading-relaxed line-clamp-4">
                    {pickedDream.content}
                  </p>
                </div>
                <button
                  onClick={handleStartRelay}
                  className="w-full mt-3 py-3 rounded-xl bg-star-gold/20 text-star-gold font-medium hover:bg-star-gold/30 transition-colors border border-star-gold/30"
                >
                  <div className="flex items-center justify-center gap-2">
                    <PenLine size={18} />
                    <span>以此梦为基础续写</span>
                  </div>
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {!pickedDream && !isPicking && (
            <p className="mt-4 text-center text-sm text-moonlight/40">
              点击上方按钮，随机获取一条陌生梦境作为续写素材
            </p>
          )}
        </section>

        <section>
          <h3 className="text-sm font-medium text-moonlight/70 mb-4 flex items-center gap-2">
            <Users size={16} className="text-dream-purple" />
            历史主题
          </h3>
          <div className="space-y-3">
            {themes.slice(1, 5).map((theme) => (
              <div
                key={theme.id}
                className="flex items-center justify-between p-4 rounded-xl bg-deep-indigo/30 border border-dream-purple/10 hover:border-dream-purple/30 transition-colors cursor-pointer"
                onClick={() => navigate('/')}
              >
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-moonlight truncate">{theme.title}</h4>
                  <p className="text-xs text-moonlight/40 mt-0.5">{theme.description}</p>
                </div>
                <div className="flex items-center gap-4 ml-4">
                  <div className="text-right">
                    <p className="text-sm text-moonlight/70">{theme.participantCount}</p>
                    <p className="text-xs text-moonlight/40">参与</p>
                  </div>
                  <ChevronRight size={18} className="text-moonlight/30" />
                </div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h3 className="text-sm font-medium text-moonlight/70 mb-4 flex items-center gap-2">
            <Clock size={16} className="text-dream-purple" />
            热门接龙
          </h3>
          <div className="space-y-4">
            {dreams.filter(d => d.relayCount > 5).slice(0, 3).map((dream) => (
              <DreamCard key={dream.id} dream={dream} showActions={false} />
            ))}
          </div>
        </section>
      </main>

      <Modal
        isOpen={showRelayModal}
        onClose={() => setShowRelayModal(false)}
        title="续写梦境"
      >
        <div className="space-y-4">
          {pickedDream && (
            <div className="p-3 rounded-xl bg-deep-indigo/50 border border-dream-purple/20">
              <p className="text-xs text-moonlight/50 mb-2">原梦片段</p>
              <p className="text-sm text-moonlight/80 line-clamp-3">{pickedDream.content}</p>
            </div>
          )}

          <div>
            <label className="text-sm font-medium text-moonlight/70 mb-2 block">续写内容</label>
            <textarea
              value={relayContent}
              onChange={(e) => setRelayContent(e.target.value)}
              placeholder="在此续写你的梦境...&#10;&#10;可以承接原梦的场景、情感或情节发展"
              className="input-field min-h-[150px] resize-none text-sm leading-relaxed"
              maxLength={500}
            />
            <p className="text-xs text-moonlight/40 mt-1 text-right">{relayContent.length}/500</p>
          </div>

          <div>
            <label className="text-sm font-medium text-moonlight/70 mb-2 block">续写风格标签</label>
            <TagSelector
              options={CREATIVE_TAGS}
              selected={creativeTags}
              onChange={(tags) => setCreativeTags(tags as CreativeTag[])}
              max={2}
            />
          </div>

          <button
            onClick={handleSubmitRelay}
            disabled={relayContent.length < 20}
            className={`w-full py-3 rounded-xl font-medium transition-all ${
              relayContent.length >= 20
                ? 'btn-primary'
                : 'bg-deep-indigo/30 text-moonlight/40 cursor-not-allowed'
            }`}
          >
            提交续写
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default Relay;
