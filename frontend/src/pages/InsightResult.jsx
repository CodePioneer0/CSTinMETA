import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  AlertTriangle,
  TrendingDown,
  Droplets,
  Dumbbell,
  Battery,
  Brain,
  Zap,
  CheckCircle2,
  ArrowRight,
  Home,
  Trophy,
  Sparkles,
} from 'lucide-react';
import toast from 'react-hot-toast';
import AnimatedPage from '../components/common/AnimatedPage';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import { completeAction } from '../api/sugar';
import { useState } from 'react';

const riskConfig = {
  HIGH_SUGAR_HABIT: { icon: AlertTriangle, color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20', label: 'High Sugar Habit' },
  SLEEP_DISRUPTION: { icon: Battery, color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/20', label: 'Sleep Disruption' },
  ENERGY_CRASH: { icon: TrendingDown, color: 'text-sugar-400', bg: 'bg-sugar-500/10', border: 'border-sugar-500/20', label: 'Energy Crash' },
  WEIGHT_GAIN_RISK: { icon: Dumbbell, color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20', label: 'Weight Gain Risk' },
  DEHYDRATION_RISK: { icon: Droplets, color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20', label: 'Dehydration Risk' },
};

const actionConfig = {
  DRINK_WATER: { emoji: '💧', label: 'Drink Water', desc: 'Have a glass of water now' },
  '10_MIN_WALK': { emoji: '🚶', label: '10 Min Walk', desc: 'Take a quick walk to burn off sugar' },
  PROTEIN_SWAP: { emoji: '🥜', label: 'Protein Swap', desc: 'Replace your next snack with protein' },
  STOP_MORE_SUGAR: { emoji: '🛑', label: 'No More Sugar', desc: "You've had enough today — stop here" },
  EAT_FRUIT: { emoji: '🍎', label: 'Eat Fruit', desc: 'Grab a fruit for natural sweetness' },
};

export default function InsightResult() {
  const location = useLocation();
  const navigate = useNavigate();
  const result = location.state?.result;
  const [actionDone, setActionDone] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  if (!result) {
    return (
      <AnimatedPage className="py-12 text-center">
        <p className="text-dark-400 mb-4">No insight data available</p>
        <Button variant="secondary" onClick={() => navigate('/log')}>
          Log Sugar First
        </Button>
      </AnimatedPage>
    );
  }

  const { insight, action, sugarEvent, pointsAwarded, surpriseReward, xp, level, streakCount } = result;
  const risk = riskConfig[insight?.riskTag] || riskConfig.DEHYDRATION_RISK;
  const actionInfo = actionConfig[insight?.suggestedAction] || actionConfig.DRINK_WATER;
  const RiskIcon = risk.icon;

  const handleCompleteAction = async () => {
    setActionLoading(true);
    try {
      await completeAction(sugarEvent._id);
      setActionDone(true);
      toast.success('Action completed! Extra XP earned 🎉');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to complete action');
    } finally {
      setActionLoading(false);
    }
  };

  const riskPercent = Math.round((insight?.riskScore || 0) * 100);

  return (
    <AnimatedPage className="py-2 space-y-6">
      {/* Points banner — full width */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-sm p-4 flex items-center gap-4"
      >
        <div className="w-12 h-12 rounded-xl bg-gold-500/10 border border-gold-500/20 flex items-center justify-center">
          <Zap size={20} className="text-gold-400" />
        </div>
        <div className="flex-1">
          <p className="text-base font-semibold text-white">+{pointsAwarded} XP earned!</p>
          <p className="text-xs text-dark-400">
            Level {level} · {streakCount} day streak
          </p>
        </div>
        {surpriseReward && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', delay: 0.5 }}
            className="px-3 py-1.5 rounded-lg bg-gold-500/20 border border-gold-500/30"
          >
            <span className="text-xs text-gold-400 font-bold">🎁 BONUS REWARD!</span>
          </motion.div>
        )}
      </motion.div>

      {/* Main — 2-column layout */}
      <div className="grid grid-cols-12 gap-6">
        {/* Left column — Risk + AI Insight */}
        <div className="col-span-7 space-y-5">
          {/* Risk Score Card */}
          <Card className="!p-6">
            <div className="flex items-start gap-5">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', delay: 0.2 }}
                className={`w-14 h-14 rounded-xl ${risk.bg} border ${risk.border} flex items-center justify-center flex-shrink-0`}
              >
                <RiskIcon size={26} className={risk.color} />
              </motion.div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-semibold text-white text-base">{risk.label}</h3>
                  <span className={`text-sm font-bold ${risk.color}`}>{riskPercent}%</span>
                </div>
                {/* Risk bar */}
                <div className="h-2 bg-dark-700 rounded-full overflow-hidden mb-3">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${riskPercent}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut', delay: 0.4 }}
                    className={`h-full rounded-full ${
                      riskPercent >= 70 ? 'bg-red-500' : riskPercent >= 40 ? 'bg-sugar-500' : 'bg-mint-500'
                    }`}
                  />
                </div>
                <p className="text-xs text-dark-400">Risk level based on your BMI, activity, sleep, and sugar habits</p>
              </div>
            </div>
          </Card>

          {/* AI Insight */}
          <Card className="!p-6">
            <div className="flex items-center gap-2 mb-4">
              <Brain size={18} className="text-royal-400" />
              <h3 className="font-semibold text-base text-white">AI Insight</h3>
              <Sparkles size={14} className="text-royal-400" />
            </div>
            <p className="text-sm text-dark-200 leading-relaxed">{insight?.insightText}</p>
            {insight?.explanation && (
              <div className="mt-4 pt-4 border-t border-white/5">
                <p className="text-xs text-dark-400 italic leading-relaxed">💡 {insight?.explanation}</p>
              </div>
            )}
          </Card>
        </div>

        {/* Right column — Action + Navigation */}
        <div className="col-span-5 space-y-5">
          {/* Suggested Action */}
          <Card className={`!p-6 ${actionDone ? '!border-mint-500/30 !bg-mint-500/5' : ''}`}>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">{actionInfo.emoji}</span>
              <h3 className="font-semibold text-base text-white">{actionInfo.label}</h3>
              {actionDone && <CheckCircle2 size={18} className="text-mint-400 ml-auto" />}
            </div>
            <p className="text-sm text-dark-300 mb-2">{actionInfo.desc}</p>

            {!actionDone && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="mt-5"
              >
                <Button
                  variant="secondary"
                  size="lg"
                  className="w-full"
                  onClick={handleCompleteAction}
                  loading={actionLoading}
                >
                  <CheckCircle2 size={16} /> Mark as Done (+XP)
                </Button>
              </motion.div>
            )}
          </Card>

          {/* Navigation */}
          <div className="space-y-3">
            <Button size="lg" className="w-full" onClick={() => navigate('/log')}>
              Log Again <ArrowRight size={16} />
            </Button>
            <Button variant="secondary" size="lg" className="w-full" onClick={() => navigate('/')}>
              <Home size={16} /> Back to Dashboard
            </Button>
          </div>
        </div>
      </div>
    </AnimatedPage>
  );
}
