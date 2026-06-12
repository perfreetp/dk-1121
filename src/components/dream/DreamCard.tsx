import React from 'react';
import { Heart, MessageCircle, Share2, UserPlus, UserCheck, Eye } from 'lucide-react';
import { Dream } from '@/types';
import { useCollectionStore } from '@/stores/collectionStore';
import { useUserStore } from '@/stores/userStore';
import { useNavigate } from 'react-router-dom';

interface DreamCardProps {
  dream: Dream;
  showActions?: boolean;
}

const DreamCard: React.FC<DreamCardProps> = ({ dream, showActions = true }) => {
  const { isCollected, addToCollection, removeFromCollection } = useCollectionStore();
  const { currentUser, followUser, unfollowUser, isFollowing, getUserById } = useUserStore();
  const navigate = useNavigate();
  const collected = isCollected(dream.id);
  const author = getUserById(dream.userId);

  const handleFollow = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!currentUser) {
      alert('请先登录');
      return;
    }
    if (isFollowing(dream.userId)) {
      unfollowUser(dream.userId);
    } else {
      followUser(dream.userId);
    }
  };

  const handleViewProfile = () => {
    navigate(`/profile/${dream.userId}`);
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor(diff / (1000 * 60));

    if (days > 0) return `${days}天前`;
    if (hours > 0) return `${hours}小时前`;
    if (minutes > 0) return `${minutes}分钟前`;
    return '刚刚';
  };

  return (
    <div
      onClick={() => navigate(`/dream/${dream.id}`)}
      className="card cursor-pointer hover:border-dream-purple/30 transition-all group"
    >
      <div className="flex items-start gap-3">
        <div
          onClick={handleViewProfile}
          className="relative flex-shrink-0"
        >
          <img
            src={author?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${dream.userNickname}`}
            alt={dream.userNickname}
            className="w-10 h-10 rounded-full object-cover border-2 border-dream-purple/30"
          />
          <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-gradient-to-br from-dream-purple to-star-gold flex items-center justify-center">
            <Eye size={10} className="text-white" />
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <span
              onClick={handleViewProfile}
              className="text-sm font-medium text-moonlight hover:text-dream-purple transition-colors cursor-pointer"
            >
              @{dream.userNickname}
            </span>
            <span className="text-xs text-moonlight/40">{formatTime(dream.createdAt)}</span>
          </div>

          <p className="text-sm text-moonlight/80 leading-relaxed mb-3 line-clamp-3">
            {dream.content}
          </p>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-full text-xs bg-dream-purple/20 text-dream-purple">
                {dream.category}
              </span>
              {dream.creativeTags.slice(0, 2).map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 rounded-full text-xs bg-star-gold/20 text-star-gold"
                >
                  #{tag}
                </span>
              ))}
              {dream.creativeTags.length > 2 && (
                <span className="text-xs text-moonlight/40">+{dream.creativeTags.length - 2}</span>
              )}
            </div>

            {dream.relayCount > 0 && (
              <div className="flex items-center gap-1 text-xs text-moonlight/50">
                <MessageCircle size={12} />
                <span>{dream.relayCount} 接龙</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {showActions && (
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-dream-purple/10">
          <div className="flex items-center gap-4">
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (!currentUser) {
                  alert('请先登录');
                  return;
                }
                if (collected) {
                  removeFromCollection(dream.id);
                } else {
                  addToCollection(dream.id);
                }
              }}
              className={`flex items-center gap-1 text-xs transition-colors ${
                collected ? 'text-red-400' : 'text-moonlight/50 hover:text-red-400'
              }`}
            >
              <Heart size={14} className={collected ? 'fill-current' : ''} />
              <span>收藏</span>
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (!currentUser) {
                  alert('请先登录');
                  return;
                }
              }}
              className="flex items-center gap-1 text-xs text-moonlight/50 hover:text-dream-purple transition-colors"
            >
              <MessageCircle size={14} />
              <span>续写</span>
            </button>
            <button
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-1 text-xs text-moonlight/50 hover:text-star-gold transition-colors"
            >
              <Share2 size={14} />
              <span>分享</span>
            </button>
          </div>

          {currentUser && currentUser.id !== dream.userId && (
            <button
              onClick={handleFollow}
              className={`flex items-center gap-1 text-xs transition-all px-2 py-1 rounded-lg ${
                isFollowing(dream.userId)
                  ? 'bg-dream-purple/20 text-dream-purple'
                  : 'bg-deep-indigo/50 text-moonlight/60 hover:bg-dream-purple/10 hover:text-moonlight'
              }`}
            >
              {isFollowing(dream.userId) ? (
                <>
                  <UserCheck size={14} />
                  <span>已关注</span>
                </>
              ) : (
                <>
                  <UserPlus size={14} />
                  <span>关注</span>
                </>
              )}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default DreamCard;
