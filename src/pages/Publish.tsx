import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Send, AlertCircle, Eye, Sparkles } from 'lucide-react';
import { useDreamStore } from '@/stores/dreamStore';
import { useUserStore } from '@/stores/userStore';
import { CATEGORIES, CREATIVE_TAGS, DreamCategory, CreativeTag, EmotionLevel } from '@/types';
import { desensitizeDream, validateDreamContent } from '@/utils/desensitize';
import EmotionSlider from '@/components/dream/EmotionSlider';
import TagSelector from '@/components/common/TagSelector';
import Modal from '@/components/common/Modal';
import { motion } from 'framer-motion';

const Publish: React.FC = () => {
  const navigate = useNavigate();
  const { addDream } = useDreamStore();
  const { currentUser, isLoggedIn, incrementPublishCount, login } = useUserStore();

  const [content, setContent] = useState('');
  const [category, setCategory] = useState<DreamCategory>('奇幻');
  const [emotionLevel, setEmotionLevel] = useState<EmotionLevel>(3);
  const [creativeTags, setCreativeTags] = useState<CreativeTag[]>([]);
  const [warnings, setWarnings] = useState<string[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [nickname, setNickname] = useState('');

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setContent(value);
    
    if (value.length > 20) {
      const { warnings: w } = desensitizeDream(value);
      setWarnings(w);
    } else {
      setWarnings([]);
    }
  };

  const handlePublish = () => {
    if (!isLoggedIn) {
      setShowLogin(true);
      return;
    }

    const validation = validateDreamContent(content);
    if (!validation.valid) {
      alert(validation.errors.join('\n'));
      return;
    }

    const { desensitized } = desensitizeDream(content);

    addDream({
      userId: currentUser!.id,
      userNickname: currentUser!.nickname,
      content: desensitized,
      category,
      emotionLevel,
      creativeTags,
      relayCount: 0,
      collectCount: 0,
    });

    incrementPublishCount();
    navigate('/');
  };

  const handleLogin = () => {
    if (nickname.trim().length < 2) {
      alert('昵称至少需要2个字符');
      return;
    }
    login(nickname.trim());
    setShowLogin(false);
  };

  const desensitizedPreview = content.length > 20 ? desensitizeDream(content).desensitized : content;

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
            <h1 className="text-lg font-semibold text-moonlight">发布梦境</h1>
            <button
              onClick={() => setShowPreview(true)}
              className="p-2 -mr-2 rounded-xl hover:bg-dream-purple/20 transition-colors"
            >
              <Eye size={20} className="text-moonlight/70" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-6 space-y-6">
        <section>
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-medium text-moonlight/70">梦境内容</label>
            <span className={`text-xs ${content.length > 500 ? 'text-red-400' : 'text-moonlight/40'}`}>
              {content.length}/500
            </span>
          </div>
          <textarea
            value={content}
            onChange={handleContentChange}
            placeholder="描述你的梦境片段...&#10;&#10;建议：&#10;• 描述具体的场景和感受&#10;• 保留独特有趣的细节&#10;• 可以适当模糊真实信息"
            className="input-field min-h-[200px] resize-none leading-relaxed"
            maxLength={500}
          />
        </section>

        {warnings.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-start gap-3 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20"
          >
            <AlertCircle size={18} className="text-amber-400 flex-shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="text-sm text-amber-400 font-medium">脱敏建议</p>
              {warnings.map((w, i) => (
                <p key={i} className="text-xs text-amber-400/70">{w}</p>
              ))}
            </div>
          </motion.div>
        )}

        <section>
          <label className="text-sm font-medium text-moonlight/70 mb-3 block">梦境分类</label>
          <div className="grid grid-cols-4 gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`py-2.5 rounded-xl text-sm font-medium transition-all ${
                  category === cat
                    ? 'bg-dream-purple text-white shadow-lg shadow-dream-purple/30'
                    : 'bg-deep-indigo/50 text-moonlight/70 hover:text-moonlight border border-dream-purple/20'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </section>

        <section>
          <EmotionSlider value={emotionLevel} onChange={setEmotionLevel} />
        </section>

        <section>
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-medium text-moonlight/70">创意标签</label>
            <span className="text-xs text-moonlight/40">最多选择3个</span>
          </div>
          <TagSelector
            options={CREATIVE_TAGS}
            selected={creativeTags}
            onChange={(tags) => setCreativeTags(tags as CreativeTag[])}
            max={3}
          />
        </section>

        <div className="pt-4">
          <button
            onClick={handlePublish}
            disabled={content.length < 20}
            className={`w-full py-4 rounded-2xl font-semibold text-lg transition-all flex items-center justify-center gap-2 ${
              content.length >= 20
                ? 'btn-primary'
                : 'bg-deep-indigo/30 text-moonlight/40 cursor-not-allowed'
            }`}
          >
            <Send size={20} />
            {isLoggedIn ? '发布梦境' : '登录后发布'}
          </button>
        </div>
      </main>

      <Modal isOpen={showPreview} onClose={() => setShowPreview(false)} title="预览效果">
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-deep-indigo/50 border border-dream-purple/20">
            <p className="text-moonlight/90 leading-relaxed whitespace-pre-wrap">
              {desensitizedPreview || '请输入梦境内容...'}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="tag">{category}</span>
            <span
              className="tag"
              style={{
                backgroundColor: `rgba(107, 91, 149, 0.2)`,
                color: '#ffd700',
                borderColor: 'rgba(255, 215, 0, 0.3)',
              }}
            >
              {emotionLevel}级情绪
            </span>
            {creativeTags.map((tag) => (
              <span key={tag} className="tag bg-star-gold/10 text-star-gold border-star-gold/20">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </Modal>

      <Modal isOpen={showLogin} onClose={() => setShowLogin(false)} title="设置匿名身份">
        <div className="space-y-4">
          <p className="text-sm text-moonlight/60">
            为了保护隐私，请设置一个匿名昵称。这个昵称将显示在你的梦境旁边。
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
            <Sparkles size={18} className="inline mr-2" />
            开始探索
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default Publish;
