import { motion } from 'framer-motion';

export default function XPBar({ xp = 0, level = 1 }) {
  const xpInLevel = xp % 100;
  const xpNeeded = 100;
  const progress = (xpInLevel / xpNeeded) * 100;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs">
        <span className="text-dark-400">
          Level <span className="text-royal-400 font-bold">{level}</span>
        </span>
        <span className="text-dark-500">
          {xpInLevel} / {xpNeeded} XP
        </span>
      </div>
      <div className="h-2 bg-dark-700 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 1, ease: 'easeOut', delay: 0.3 }}
          className="h-full rounded-full bg-gradient-to-r from-royal-500 to-sugar-500 relative"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/20 animate-shimmer" 
               style={{ backgroundSize: '200% 100%' }} />
        </motion.div>
      </div>
    </div>
  );
}
