import { motion } from 'framer-motion';

export default function SugarScoreRing({ score = 0 }) {
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  const getColor = () => {
    if (score >= 80) return { stroke: '#10b981', glow: 'rgba(16,185,129,0.3)', label: 'Excellent' };
    if (score >= 60) return { stroke: '#f59e0b', glow: 'rgba(245,158,11,0.3)', label: 'Good' };
    if (score >= 40) return { stroke: '#f97316', glow: 'rgba(249,115,22,0.3)', label: 'Fair' };
    return { stroke: '#ef4444', glow: 'rgba(239,68,68,0.3)', label: 'High Sugar' };
  };

  const { stroke, glow, label } = getColor();

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-32 h-32">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
          {/* Background ring */}
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.05)"
            strokeWidth="8"
          />
          {/* Animated progress ring */}
          <motion.circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke={stroke}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.2, ease: 'easeOut', delay: 0.3 }}
            style={{ filter: `drop-shadow(0 0 8px ${glow})` }}
          />
        </svg>
        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.5, type: 'spring' }}
            className="text-3xl font-bold font-display text-white"
          >
            {score}
          </motion.span>
          <span className="text-[10px] text-dark-400 font-medium uppercase tracking-wider">score</span>
        </div>
      </div>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="text-xs font-medium mt-2"
        style={{ color: stroke }}
      >
        {label}
      </motion.p>
    </div>
  );
}
