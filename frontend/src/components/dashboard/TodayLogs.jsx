import { motion } from 'framer-motion';
import { Coffee, CupSoda, IceCream, Candy, Cookie, Apple, Milk, Package, HelpCircle } from 'lucide-react';

const iconMap = {
  CHAI: { icon: Coffee, color: 'text-amber-400', bg: 'bg-amber-500/10' },
  COFFEE: { icon: Coffee, color: 'text-yellow-600', bg: 'bg-yellow-600/10' },
  SWEETS: { icon: Candy, color: 'text-pink-400', bg: 'bg-pink-500/10' },
  COLD_DRINK: { icon: CupSoda, color: 'text-blue-400', bg: 'bg-blue-500/10' },
  PACKAGED_SNACK: { icon: Package, color: 'text-orange-400', bg: 'bg-orange-500/10' },
  ICE_CREAM: { icon: IceCream, color: 'text-cyan-300', bg: 'bg-cyan-500/10' },
  CHOCOLATE: { icon: Cookie, color: 'text-amber-600', bg: 'bg-amber-600/10' },
  JUICE: { icon: Apple, color: 'text-green-400', bg: 'bg-green-500/10' },
  OTHER: { icon: HelpCircle, color: 'text-gray-400', bg: 'bg-gray-500/10' },
};

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
};

const item = {
  hidden: { opacity: 0, x: -20 },
  show: { opacity: 1, x: 0, transition: { duration: 0.3 } },
};

function timeAgo(timestamp) {
  const diff = (Date.now() - new Date(timestamp).getTime()) / 60000;
  if (diff < 1) return 'Just now';
  if (diff < 60) return `${Math.floor(diff)}m ago`;
  if (diff < 1440) return `${Math.floor(diff / 60)}h ago`;
  return `${Math.floor(diff / 1440)}d ago`;
}

function formatItemType(type) {
  return type.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function TodayLogs({ logs = [] }) {
  if (logs.length === 0) {
    return (
      <div className="glass-sm p-5 sm:p-6 text-center">
        <p className="text-dark-400 text-sm">No sugar logged today</p>
        <p className="text-dark-500 text-xs mt-1">Tap + to log your first item</p>
      </div>
    );
  }

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-2">
      {logs.map((log, i) => {
        const entry = iconMap[log.itemType] || iconMap.OTHER;
        const Icon = entry.icon;
        return (
          <motion.div
            key={log._id || i}
            variants={item}
            className="glass-sm p-3 flex items-center gap-2 sm:gap-3 glass-hover"
          >
            <div className={`w-9 h-9 rounded-lg ${entry.bg} flex items-center justify-center flex-shrink-0`}>
              <Icon size={18} className={entry.color} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs sm:text-sm font-medium text-white truncate">
                {formatItemType(log.itemType)}
              </p>
              <p className="text-[11px] text-dark-400">
                {log.timeOfDay?.toLowerCase()} · qty {log.quantity || 1}
              </p>
            </div>
            <span className="text-[11px] text-dark-500 flex-shrink-0">
              {timeAgo(log.timestamp)}
            </span>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
