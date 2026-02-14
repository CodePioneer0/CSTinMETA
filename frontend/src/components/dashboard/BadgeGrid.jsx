import { motion } from 'framer-motion';
import { Award } from 'lucide-react';

const badgeConfig = {
  FIRST_LOG: { emoji: '🎯', label: 'First Log', desc: 'Logged your first sugar event' },
  DAY_3_STREAK: { emoji: '🔥', label: '3-Day Streak', desc: '3 consecutive days of logging' },
  DAY_7_STREAK: { emoji: '⚡', label: '7-Day Streak', desc: 'A full week of tracking!' },
  DAY_30_STREAK: { emoji: '🏆', label: '30-Day Streak', desc: 'A whole month champion!' },
  QUICK_FIXER: { emoji: '⏱️', label: 'Quick Fixer', desc: 'Completed action within 30 min' },
};

const allBadges = Object.keys(badgeConfig);

export default function BadgeGrid({ earned = [] }) {
  return (
    <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
      {allBadges.map((key) => {
        const badge = badgeConfig[key];
        const isEarned = earned.includes(key);

        return (
          <motion.div
            key={key}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, type: 'spring' }}
            className={`relative flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${
              isEarned
                ? 'bg-gold-500/10 border border-gold-500/30'
                : 'bg-white/3 border border-white/5 opacity-40'
            }`}
            title={badge.desc}
          >
            <span className="text-lg sm:text-xl">{badge.emoji}</span>
            <span className="text-[8px] sm:text-[9px] text-center text-dark-300 font-medium leading-tight">
              {badge.label}
            </span>
            {!isEarned && (
              <div className="absolute inset-0 flex items-center justify-center bg-dark-900/60 rounded-xl">
                <Award size={14} className="text-dark-500" />
              </div>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}
