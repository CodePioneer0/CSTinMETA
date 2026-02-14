import { useLocation } from 'react-router-dom';
import { Bell, Search } from 'lucide-react';

const pageTitles = {
  '/': 'Dashboard',
  '/log': 'Log Sugar',
  '/insight': 'AI Insight',
  '/history': 'History',
  '/health': 'Health Sync',
  '/profile': 'Profile',
};

export default function Navbar() {
  const location = useLocation();
  const title = pageTitles[location.pathname] || 'SugarSense';

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <nav className="sticky top-0 z-40 backdrop-blur-xl bg-dark-950/60 border-b border-white/5">
      <div className="px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-lg sm:text-xl font-bold text-white truncate">{title}</h1>
          {location.pathname === '/' && (
            <p className="text-xs text-dark-400 -mt-0.5">{greeting()} 👋</p>
          )}
        </div>
        <div className="hidden sm:flex items-center gap-3">
          <button className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-dark-400 hover:text-white hover:bg-white/10 transition-all">
            <Search size={16} />
          </button>
          <button className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-dark-400 hover:text-white hover:bg-white/10 transition-all relative">
            <Bell size={16} />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-sugar-500 rounded-full border-2 border-dark-950" />
          </button>
        </div>
      </div>
    </nav>
  );
}
