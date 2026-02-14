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
  Info,
  Activity,
  Lightbulb,
} from 'lucide-react';
import toast from 'react-hot-toast';
import AnimatedPage from '../components/common/AnimatedPage';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import { completeAction } from '../api/sugar';
import { useState } from 'react';

const riskConfig = {
  HIGH_SUGAR_HABIT: { icon: AlertTriangle, color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20', shadow: 'shadow-red-500/20', label: 'High Sugar Risk' },
  SLEEP_DISRUPTION: { icon: Battery, color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/20', shadow: 'shadow-purple-500/20', label: 'Sleep Disruption' },
  ENERGY_CRASH: { icon: TrendingDown, color: 'text-sugar-400', bg: 'bg-sugar-500/10', border: 'border-sugar-500/20', shadow: 'shadow-sugar-500/20', label: 'Energy Crash' },
  WEIGHT_GAIN_RISK: { icon: Dumbbell, color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20', shadow: 'shadow-yellow-500/20', label: 'Weight Management' },
  DEHYDRATION_RISK: { icon: Droplets, color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20', shadow: 'shadow-blue-500/20', label: 'Hydration Level' },
};

const actionConfig = {
  DRINK_WATER: { emoji: '💧', label: 'Drink Water', desc: 'Hydration helps flush out excess sugar and stabilize levels' },
  '10_MIN_WALK': { emoji: '🚶', label: '10 Min Walk', desc: 'Light movement improves insulin sensitivity immediately' },
  PROTEIN_SWAP: { emoji: '🥜', label: 'Protein Swap', desc: 'Protein slows down sugar absorption in your bloodstream' },
  STOP_MORE_SUGAR: { emoji: '🛑', label: 'No More Sugar', desc: 'Your limit is reached. Switch to water or herbal tea.' },
  EAT_FRUIT: { emoji: '🍎', label: 'Eat Fruit', desc: 'Fiber in fruit prevents rapid blood sugar spikes' },
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

  const { insight, sugarEvent, pointsAwarded, xp, level, streakCount } = result;

  // Tag fallback to generic if not found
  const riskTag = insight?.riskTag || 'DEHYDRATION_RISK';
  const risk = riskConfig[riskTag] || riskConfig.DEHYDRATION_RISK;

  // Action fallback
  const actionKey = insight?.suggestedAction || 'DRINK_WATER';
  const actionInfo = actionConfig[actionKey] || actionConfig.DRINK_WATER;

  const RiskIcon = risk.icon;
  const riskPercent = Math.round((insight?.riskScore || 0) * 100);

  // Determine severity based on score
  const severity = riskPercent > 70 ? 'High' : riskPercent > 40 ? 'Moderate' : 'Low';
  const severityColor = riskPercent > 70 ? 'text-red-400' : riskPercent > 40 ? 'text-sugar-400' : 'text-mint-400';

  const handleCompleteAction = async () => {
    setActionLoading(true);
    try {
      if (sugarEvent?._id) {
        await completeAction(sugarEvent._id);
        setActionDone(true);
        toast.success(`Action completed!🎉`);
      } else {
        // Just simulate if no event ID (e.g. forced demo)
        setActionDone(true);
        toast.success('Action marked as done!');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to complete action');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <AnimatedPage className="py-4 pb-12 space-y-8">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="font-display text-xl sm:text-2xl text-white font-bold flex items-center gap-3">
            <Brain className="text-royal-400" />
            AI Analysis Result
          </h1>
          <p className="text-dark-400 text-sm mt-1">
            Based on your recent logs and health data
          </p>
        </div>
        <div className="flex items-center gap-3 bg-white/5 px-4 py-2 rounded-xl border border-white/10 w-fit">
          <Zap className="text-gold-400" size={18} />
          <span className="text-white font-semibold">+{pointsAwarded} XP Earned</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* 1. RISK ASSESSMENT CARD */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className={`h-full !p-0 overflow-hidden relative border-0 ring-1 ring-inset ${risk.border}`}>
            {/* Background Gradient */}
            <div className={`absolute inset-0 opacity-20 bg-gradient-to-br ${risk.bg} to-transparent`} />

            <div className="p-6 relative z-10">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-dark-400 uppercase tracking-wider text-xs font-bold mb-1">Risk Assessment</h2>
                  <h3 className="text-2xl font-display font-bold text-white flex items-center gap-2">
                    {risk.label}
                  </h3>
                </div>
                <div className={`w-12 h-12 rounded-xl ${risk.bg} border ${risk.border} flex items-center justify-center shadow-lg ${risk.shadow}`}>
                  <RiskIcon size={24} className={risk.color} />
                </div>
              </div>

              {/* Gauge / Score */}
              <div className="mb-6">
                <div className="flex items-end justify-between mb-2">
                  <span className={`text-4xl font-bold ${severityColor}`}>{riskPercent}%</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold border ${risk.border} ${risk.bg} ${risk.color}`}>
                    {severity} Risk
                  </span>
                </div>
                <div className="h-3 bg-black/20 rounded-full overflow-hidden backdrop-blur-sm ring-1 ring-white/5">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${riskPercent}%` }}
                    transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
                    className={`h-full rounded-full ${riskPercent > 70 ? 'bg-gradient-to-r from-red-500 to-red-400' : riskPercent > 40 ? 'bg-gradient-to-r from-sugar-500 to-sugar-400' : 'bg-gradient-to-r from-mint-500 to-mint-400'}`}
                  />
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 rounded-xl bg-black/20 border border-white/5">
                <Activity size={18} className="text-dark-400 mt-0.5 shrink-0" />
                <p className="text-sm text-dark-300 leading-relaxed">
                  {insight?.insightText || "Your sugar intake is being analyzed against your activity levels."}
                </p>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* 2. EXPLANATION CARD */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="h-full !p-0 overflow-hidden relative border-white/10">
            <div className="absolute inset-0 bg-royal-500/5" />

            <div className="p-6 relative z-10 flex flex-col h-full">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-royal-500/10 flex items-center justify-center text-royal-400">
                  <Lightbulb size={20} />
                </div>
                <div>
                  <h2 className="text-dark-400 uppercase tracking-wider text-xs font-bold">The Explanation</h2>
                  <h3 className="text-xl font-display font-semibold text-white">Why this matters?</h3>
                </div>
              </div>

              <div className="flex-1">
                <p className="text-dark-200 leading-7 text-sm">
                  {insight?.explanation || "Consuming this amount of sugar without corresponding physical activity can lead to rapid insulin spikes followed by an energy crash."}
                </p>

                <div className="mt-6 space-y-3">
                  <div className="flex items-center gap-3 text-sm text-dark-300">
                    <CheckCircle2 size={16} className="text-mint-400" />
                    <span>Real-time analysis of your metabolism</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-dark-300">
                    <CheckCircle2 size={16} className="text-mint-400" />
                    <span>Based on {new Date().getHours() < 12 ? 'morning' : 'current'} activity levels</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* 3. ACTION CARD (Full Width or Prominent) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="md:col-span-2"
        >
          <Card className={`!p-1 overflow-hidden transition-all duration-500 ${actionDone ? 'border-mint-500/50 shadow-lg shadow-mint-500/10' : 'border-white/10'}`}>
            <div className={`p-5 sm:p-8 rounded-[14px] ${actionDone ? 'bg-mint-500/10' : 'bg-gradient-to-r from-royal-500/10 to-transparent'}`}>
              <div className="flex flex-col md:flex-row md:items-center gap-6 sm:gap-8">

                {/* Icon & Text */}
                <div className="flex-1 flex items-start gap-4 sm:gap-6">
                  <div className="text-5xl sm:text-6xl filter drop-shadow-lg animate-bounce-slow">
                    {actionInfo.emoji}
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-md bg-white/10 border border-white/20 text-[10px] font-bold uppercase tracking-wider text-white">
                        Recommended Action
                      </span>
                      {actionDone && (
                        <span className="flex items-center gap-1 text-mint-400 text-xs font-bold">
                          <CheckCircle2 size={12} /> COMPLETED
                        </span>
                      )}
                    </div>
                    <h3 className="text-xl sm:text-2xl font-display font-bold text-white">
                      {actionInfo.label}
                    </h3>
                    <p className="text-dark-300 max-w-lg">
                      {actionInfo.desc}
                    </p>
                  </div>
                </div>

                {/* Button */}
                <div className="w-full md:w-auto min-w-[200px]">
                  {!actionDone ? (
                    <Button
                      size="xl"
                      className="w-full shadow-xl shadow-royal-500/20"
                      onClick={handleCompleteAction}
                      loading={actionLoading}
                    >
                      I'll do this now <ArrowRight size={18} />
                    </Button>
                  ) : (
                    <motion.div
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="flex flex-col items-center justify-center p-4 rounded-xl bg-mint-500/20 border border-mint-500/30 text-mint-400"
                    >
                      <CheckCircle2 size={32} className="mb-2" />
                      <span className="font-bold">Great job!</span>
                    </motion.div>
                  )}
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

      </div>

      {/* Navigation Footer */}
      <div className="flex justify-center pt-8 border-t border-white/5">
        <Button variant="ghost" className="text-dark-400 hover:text-white" onClick={() => navigate('/')}>
          <Home size={16} className="mr-2" /> Back to Dashboard
        </Button>
      </div>
    </AnimatedPage>
  );
}
