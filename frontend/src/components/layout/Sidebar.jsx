import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Home,
  PlusCircle,
  BarChart3,
  Heart,
  User,
  Sparkles,
  LogOut,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const navItems = [
  { path: '/', icon: Home, label: 'Dashboard' },
  { path: '/log', icon: PlusCircle, label: 'Log Sugar', accent: true },
  { path: '/history', icon: BarChart3, label: 'History' },
  { path: '/health', icon: Heart, label: 'Health Sync' },
  { path: '/profile', icon: User, label: 'Profile' },
];

export default function Sidebar() {
  const location = useLocation();
  const { logout } = useAuth();

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-64 bg-dark-900/80 backdrop-blur-2xl border-r border-white/5 z-50 hidden lg:flex flex-col">
      {/* Brand */}
      <div className="h-16 flex items-center gap-3 px-6 border-b border-white/5">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-royal-500 to-sugar-500 flex items-center justify-center shadow-lg shadow-royal-500/25">
          <Sparkles size={18} className="text-white" />
        </div>
        <span className="font-display font-bold text-xl tracking-tight">
          Sugar<span className="gradient-text">Sense</span>
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-6 space-y-1">
        {navItems.map((item) => {
          const isActive =
            item.path === '/'
              ? location.pathname === '/'
              : location.pathname.startsWith(item.path);
          const Icon = item.icon;

          if (item.accent) {
            return (
              <NavLink key={item.path} to={item.path}>
                <motion.div
                  whileTap={{ scale: 0.97 }}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all duration-200 my-2 ${
                    isActive
                      ? 'bg-gradient-to-r from-royal-500 to-sugar-500 text-white shadow-lg shadow-royal-500/25'
                      : 'bg-gradient-to-r from-royal-500/20 to-sugar-500/20 text-royal-300 hover:from-royal-500/30 hover:to-sugar-500/30 border border-royal-500/20'
                  }`}
                >
                  <Icon size={18} strokeWidth={2} />
                  <span>{item.label}</span>
                </motion.div>
              </NavLink>
            );
          }

          return (
            <NavLink key={item.path} to={item.path}>
              <motion.div
                whileTap={{ scale: 0.97 }}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm transition-all duration-200 relative ${
                  isActive
                    ? 'bg-white/8 text-white font-medium'
                    : 'text-dark-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="sidebar-indicator"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full bg-royal-500"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
                <Icon size={18} strokeWidth={isActive ? 2 : 1.5} />
                <span>{item.label}</span>
              </motion.div>
            </NavLink>
          );
        })}
      </nav>

      {/* Bottom section */}
      <div className="px-3 pb-6 space-y-3">
        <div className="glass-sm p-4">
          <p className="text-[11px] text-dark-500 uppercase tracking-wider font-semibold mb-2">
            SugarSense AI
          </p>
          <p className="text-xs text-dark-400 leading-relaxed">
            ML-powered sugar risk prediction with personalized health insights
          </p>
        </div>
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-dark-500 hover:text-red-400 hover:bg-red-500/5 transition-all"
        >
          <LogOut size={16} />
          <span>Log Out</span>
        </button>
      </div>
    </aside>
  );
}
