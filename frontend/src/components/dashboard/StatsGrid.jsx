import { motion } from 'framer-motion';
import { Flame, Star, Trophy, Zap } from 'lucide-react';

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const item = {
  hidden: { opacity: 0, scale: 0.8 },
  show: { opacity: 1, scale: 1, transition: { type: 'spring', duration: 0.5 } },
};

export default function StatsGrid({ xp = 0, level = 1, streakCount = 0, bestStreak = 0 }) {
  const stats = [
    {
      label: 'XP',
      value: xp,
      icon: Zap,
      color: 'text-gold-400',
      bg: 'from-gold-500/10 to-gold-600/10',
      border: 'border-gold-500/20',
    },
    {
      label: 'Level',
      value: level,
      icon: Star,
      color: 'text-royal-400',
      bg: 'from-royal-500/10 to-royal-600/10',
      border: 'border-royal-500/20',
    },
    {
      label: 'Streak',
      value: `${streakCount}d`,
      icon: Flame,
      color: 'text-sugar-400',
      bg: 'from-sugar-500/10 to-sugar-600/10',
      border: 'border-sugar-500/20',
    },
    {
      label: 'Best',
      value: `${bestStreak}d`,
      icon: Trophy,
      color: 'text-mint-400',
      bg: 'from-mint-500/10 to-mint-600/10',
      border: 'border-mint-500/20',
    },
  ];

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-2 gap-3 h-full">
      {stats.map((s) => (
        <motion.div
          key={s.label}
          variants={item}
          className={`flex flex-col items-center justify-center p-4 rounded-xl bg-gradient-to-b ${s.bg} border ${s.border}`}
        >
          <s.icon size={18} className={s.color} />
          <span className="text-2xl font-bold font-display text-white mt-1.5">{s.value}</span>
          <span className="text-xs text-dark-400 font-medium">{s.label}</span>
        </motion.div>
      ))}
    </motion.div>
  );
}
