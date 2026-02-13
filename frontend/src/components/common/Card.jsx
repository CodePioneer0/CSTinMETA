import { motion } from 'framer-motion';

export default function Card({ children, className = '', hover = false, glow = false, ...props }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className={`
        glass p-4
        ${hover ? 'glass-hover cursor-pointer' : ''}
        ${glow ? 'animate-glow' : ''}
        ${className}
      `}
      {...props}
    >
      {children}
    </motion.div>
  );
}
