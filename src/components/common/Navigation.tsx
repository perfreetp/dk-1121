import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, PenLine, Repeat, Heart, User } from 'lucide-react';

interface NavItem {
  path: string;
  label: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  { path: '/', label: '梦池', icon: <Home size={22} /> },
  { path: '/relay', label: '接龙', icon: <Repeat size={22} /> },
  { path: '/publish', label: '发布', icon: <PenLine size={22} /> },
  { path: '/collection', label: '收藏', icon: <Heart size={22} /> },
  { path: '/profile', label: '我的', icon: <User size={22} /> },
];

export const Navigation: React.FC = () => {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-deep-indigo/95 backdrop-blur-md border-t border-dream-purple/20 safe-area-pb">
      <div className="flex items-center justify-around max-w-lg mx-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-item ${isActive ? 'active' : ''}`}
            >
              {item.icon}
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default Navigation;
