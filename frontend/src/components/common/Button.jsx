import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

const variants = {
  primary:
    'bg-gradient-to-r from-royal-500 to-royal-600 hover:from-royal-600 hover:to-royal-700 text-white shadow-lg shadow-royal-500/20 hover:shadow-royal-500/40',
  secondary:
    'bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white',
  sugar:
    'bg-gradient-to-r from-sugar-500 to-sugar-600 hover:from-sugar-600 hover:to-sugar-700 text-white shadow-lg shadow-sugar-500/20',
  ghost:
    'hover:bg-white/5 text-dark-200 hover:text-white',
  danger:
    'bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400',
};

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  className = '',
  ...props
}) {
  const sizes = {
    sm: 'px-3 py-1.5 text-sm rounded-lg',
    md: 'px-5 py-2.5 text-sm rounded-xl',
    lg: 'px-6 py-3 text-base rounded-xl',
    xl: 'px-8 py-4 text-lg rounded-2xl',
  };

  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      whileHover={{ scale: 1.01 }}
      className={`
        inline-flex items-center justify-center gap-2 font-semibold
        transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed
        ${variants[variant]} ${sizes[size]} ${className}
      `}
      disabled={loading}
      {...props}
    >
      {loading && <Loader2 size={16} className="animate-spin" />}
      {children}
    </motion.button>
  );
}
