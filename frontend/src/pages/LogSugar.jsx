import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Coffee, CupSoda, IceCream, Candy, Cookie, Apple, Package, HelpCircle, Minus, Plus, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import AnimatedPage from '../components/common/AnimatedPage';
import Button from '../components/common/Button';
import { logSugarEvent } from '../api/sugar';

const sugarItems = [
  { type: 'CHAI', label: 'Chai', emoji: '🍵', icon: Coffee, color: 'amber' },
  { type: 'COFFEE', label: 'Coffee', emoji: '☕', icon: Coffee, color: 'yellow' },
  { type: 'SWEETS', label: 'Sweets', emoji: '🍬', icon: Candy, color: 'pink' },
  { type: 'COLD_DRINK', label: 'Cold Drink', emoji: '🥤', icon: CupSoda, color: 'blue' },
  { type: 'PACKAGED_SNACK', label: 'Snack', emoji: '📦', icon: Package, color: 'orange' },
  { type: 'ICE_CREAM', label: 'Ice Cream', emoji: '🍦', icon: IceCream, color: 'cyan' },
  { type: 'CHOCOLATE', label: 'Chocolate', emoji: '🍫', icon: Cookie, color: 'amber' },
  { type: 'JUICE', label: 'Juice', emoji: '🧃', icon: Apple, color: 'green' },
  { type: 'OTHER', label: 'Other', emoji: '🍽️', icon: HelpCircle, color: 'gray' },
];

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

const item = {
  hidden: { opacity: 0, scale: 0.8 },
  show: { opacity: 1, scale: 1 },
};

export default function LogSugar() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);

  const handleLog = async () => {
    if (!selected) {
      toast.error('Please select a sugar item');
      return;
    }
    setLoading(true);
    try {
      const res = await logSugarEvent({
        itemType: selected,
        quantity,
        timestamp: new Date().toISOString(),
      });
      // Navigate to insight page with result data
      navigate('/insight', { state: { result: res.data } });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to log sugar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatedPage className="py-2 space-y-6">
      {/* Header */}
      <div>
        <p className="text-dark-400 text-sm mt-1">Select a sugar item and quantity to log</p>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Left — Item Grid (wider) */}
        <div className="col-span-8">
          <h3 className="text-sm font-semibold text-dark-300 mb-3 uppercase tracking-wider">What did you have?</h3>
          <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-5 gap-3">
            {sugarItems.map((s) => (
              <motion.button
                key={s.type}
                variants={item}
                whileTap={{ scale: 0.92 }}
                onClick={() => setSelected(s.type)}
                className={`flex flex-col items-center gap-2.5 p-5 rounded-xl border transition-all duration-200 ${
                  selected === s.type
                    ? 'bg-royal-500/15 border-royal-500/50 shadow-lg shadow-royal-500/10 scale-[1.02]'
                    : 'bg-white/3 border-white/8 hover:bg-white/5 hover:border-white/15'
                }`}
              >
                <span className="text-3xl">{s.emoji}</span>
                <span className={`text-xs font-medium ${selected === s.type ? 'text-royal-300' : 'text-dark-300'}`}>
                  {s.label}
                </span>
              </motion.button>
            ))}
          </motion.div>
        </div>

        {/* Right — Quantity + Submit */}
        <div className="col-span-4 space-y-5">
          {/* Quantity Selector */}
          <div className="glass-sm p-6">
            <p className="text-sm font-semibold text-white mb-1">Quantity</p>
            <p className="text-xs text-dark-400 mb-5">How many servings?</p>
            <div className="flex items-center justify-center gap-6">
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors"
              >
                <Minus size={18} className="text-dark-300" />
              </motion.button>
              <AnimatePresence mode="wait">
                <motion.span
                  key={quantity}
                  initial={{ scale: 1.3, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-4xl font-bold font-display text-white w-14 text-center"
                >
                  {quantity}
                </motion.span>
              </AnimatePresence>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setQuantity(Math.min(10, quantity + 1))}
                className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors"
              >
                <Plus size={18} className="text-dark-300" />
              </motion.button>
            </div>
          </div>

          {/* Selected summary */}
          {selected && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-sm p-4"
            >
              <p className="text-xs text-dark-400 mb-2">Selected</p>
              <div className="flex items-center gap-3">
                <span className="text-2xl">{sugarItems.find(s => s.type === selected)?.emoji}</span>
                <div>
                  <p className="text-sm font-semibold text-white">{sugarItems.find(s => s.type === selected)?.label}</p>
                  <p className="text-xs text-dark-400">x{quantity} serving{quantity > 1 ? 's' : ''}</p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Submit Button */}
          <Button
            size="xl"
            className="w-full"
            onClick={handleLog}
            loading={loading}
            disabled={!selected}
          >
            {loading ? 'Analyzing...' : 'Log & Get AI Insight'}
          </Button>
          <p className="text-[11px] text-dark-600 text-center">
            Our ML model will analyze your intake and predict risk
          </p>
        </div>
      </div>
    </AnimatedPage>
  );
}
