import { NavLink, useLocation } from 'react-router-dom';
import { Home, PlusCircle, BarChart3, Heart, User } from 'lucide-react';
import { motion } from 'framer-motion';

const navItems = [
  { path: '/', icon: Home, label: 'Home' },
  { path: '/history', icon: BarChart3, label: 'History' },
  { path: '/log', icon: PlusCircle, label: 'Log', isCenter: true },
  { path: '/health', icon: Heart, label: 'Health' },
  { path: '/profile', icon: User, label: 'Profile' },
];

export default function BottomNav() {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 lg:hidden">
      <div className="max-w-lg mx-auto">
        <div className="mx-3 mb-3 backdrop-blur-xl bg-dark-800/80 border border-white/10 rounded-2xl shadow-2xl shadow-black/50">
          <div className="flex items-center justify-around h-16 px-1 sm:px-2">
            {navItems.map((item) => {
              const isActive =
                item.path === '/'
                  ? location.pathname === '/'
                  : location.pathname.startsWith(item.path);
              const Icon = item.icon;

              if (item.isCenter) {
                return (
                  <NavLink key={item.path} to={item.path} className="relative -mt-6">
                    <motion.div
                      whileTap={{ scale: 0.9 }}
                      whileHover={{ scale: 1.05 }}
                      className="w-14 h-14 rounded-2xl bg-gradient-to-br from-royal-500 to-sugar-500 flex items-center justify-center shadow-lg shadow-royal-500/30 hover:shadow-royal-500/50 transition-shadow"
                    >
                      <Icon size={24} className="text-white" strokeWidth={2.5} />
                    </motion.div>
                  </NavLink>
                );
              }

              return (
                <NavLink key={item.path} to={item.path} className="relative flex flex-col items-center gap-0.5 py-1 px-3">
                  <div className="relative">
                    <Icon
                      size={20}
                      className={`transition-colors duration-200 ${
                        isActive ? 'text-royal-400' : 'text-dark-400 hover:text-dark-200'
                      }`}
                      strokeWidth={isActive ? 2.5 : 1.5}
                    />
                    {isActive && (
                      <motion.div
                        layoutId="nav-indicator"
                        className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-royal-400"
                        transition={{ type: 'spring', duration: 0.5 }}
                      />
                    )}
                  </div>
                  <span
                    className={`text-[10px] font-medium transition-colors duration-200 ${
                      isActive ? 'text-royal-400' : 'text-dark-500'
                    }`}
                  >
                    {item.label}
                  </span>
                </NavLink>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
