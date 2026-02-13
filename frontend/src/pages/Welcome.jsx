import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, Shield, Brain, Trophy, Activity, Zap, BarChart3 } from 'lucide-react';
import Button from '../components/common/Button';
import { useAuth } from '../context/AuthContext';

const features = [
  {
    icon: Brain,
    title: 'AI-Powered Insights',
    desc: 'Our ML model predicts sugar crash risks using your health data in real-time',
    color: 'from-royal-500/20 to-royal-600/20',
    iconColor: 'text-royal-400',
    border: 'border-royal-500/20',
  },
  {
    icon: Shield,
    title: 'Health Tracking',
    desc: 'Connect steps, sleep & heart rate for precision predictions',
    color: 'from-mint-500/20 to-mint-600/20',
    iconColor: 'text-mint-400',
    border: 'border-mint-500/20',
  },
  {
    icon: Trophy,
    title: 'Gamified Wellness',
    desc: 'Earn XP, unlock badges, and build daily streaks to stay motivated',
    color: 'from-gold-500/20 to-gold-600/20',
    iconColor: 'text-gold-400',
    border: 'border-gold-500/20',
  },
  {
    icon: BarChart3,
    title: 'Visual Analytics',
    desc: 'Rich dashboards and history charts to track your sugar journey',
    color: 'from-sugar-500/20 to-sugar-600/20',
    iconColor: 'text-sugar-400',
    border: 'border-sugar-500/20',
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.4 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

export default function Welcome() {
  const navigate = useNavigate();
  const { startSession, isAuthenticated, onboarded } = useAuth();

  const handleGetStarted = async () => {
    if (isAuthenticated && onboarded) {
      navigate('/');
      return;
    }
    if (isAuthenticated && !onboarded) {
      navigate('/onboarding');
      return;
    }
    try {
      await startSession();
      navigate('/onboarding');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-dark-950 noise-bg relative overflow-hidden flex">
      {/* Background effects */}
      <div className="orb-purple-xl top-[-200px] left-[10%]" style={{ position: 'absolute' }} />
      <div className="orb-orange-xl bottom-[-100px] right-[5%]" style={{ position: 'absolute' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-royal-600/5 rounded-full blur-[120px]" />

      {/* Left panel — Hero */}
      <div className="flex-1 flex flex-col justify-center px-16 xl:px-24 relative z-10">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="max-w-xl"
        >
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-royal-500 to-sugar-500 flex items-center justify-center shadow-2xl shadow-royal-500/30 animate-float">
              <Sparkles size={32} className="text-white" />
            </div>
            <div>
              <h1 className="font-display text-5xl xl:text-6xl font-extrabold tracking-tight">
                Sugar<span className="gradient-text">Sense</span>
              </h1>
            </div>
          </div>

          <p className="text-dark-300 text-xl leading-relaxed mb-10 max-w-lg">
            Track your sugar intake, get <span className="text-royal-400 font-medium">AI-powered risk predictions</span>, and build
            healthier habits with gamified wellness tracking
          </p>

          <div className="flex items-center gap-4">
            <Button onClick={handleGetStarted} size="xl" className="px-10">
              Get Started <ArrowRight size={18} />
            </Button>
            <Button
              variant="ghost"
              size="lg"
              className="text-dark-400 hover:text-white"
              onClick={() => navigate('/login')}
            >
              Log In →
            </Button>
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="text-xs text-dark-600 mt-6"
          >
            No sign-up required to start — your data stays private
          </motion.p>
        </motion.div>
      </div>

      {/* Right panel — Feature cards grid */}
      <div className="w-[520px] xl:w-[580px] flex items-center pr-12 xl:pr-20 relative z-10">
        <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-2 gap-4 w-full">
          {features.map((f) => (
            <motion.div
              key={f.title}
              variants={item}
              className={`glass-sm p-5 flex flex-col gap-3 glass-hover border ${f.border}`}
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${f.color} flex items-center justify-center flex-shrink-0`}>
                <f.icon size={22} className={f.iconColor} />
              </div>
              <div>
                <h3 className="font-semibold text-sm text-white mb-1">{f.title}</h3>
                <p className="text-xs text-dark-400 leading-relaxed">{f.desc}</p>
              </div>
            </motion.div>
          ))}

          {/* Tech stack badge */}
          <motion.div
            variants={item}
            className="col-span-2 glass-sm p-4 flex items-center gap-3 border border-white/5"
          >
            <div className="flex items-center gap-2">
              <Zap size={14} className="text-gold-400" />
              <span className="text-xs text-dark-400">Powered by</span>
            </div>
            <div className="flex items-center gap-2 text-[11px]">
              <span className="px-2 py-1 rounded-md bg-royal-500/10 text-royal-400 border border-royal-500/20">React</span>
              <span className="px-2 py-1 rounded-md bg-mint-500/10 text-mint-400 border border-mint-500/20">FastAPI ML</span>
              <span className="px-2 py-1 rounded-md bg-sugar-500/10 text-sugar-400 border border-sugar-500/20">Groq LLM</span>
              <span className="px-2 py-1 rounded-md bg-gold-500/10 text-gold-400 border border-gold-500/20">MongoDB</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
