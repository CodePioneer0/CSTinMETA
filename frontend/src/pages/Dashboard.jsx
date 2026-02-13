import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PlusCircle, TrendingUp, Sparkles, ArrowRight } from 'lucide-react';
import AnimatedPage from '../components/common/AnimatedPage';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import LoadingSpinner from '../components/common/LoadingSpinner';
import SugarScoreRing from '../components/dashboard/SugarScoreRing';
import StatsGrid from '../components/dashboard/StatsGrid';
import TodayLogs from '../components/dashboard/TodayLogs';
import BadgeGrid from '../components/dashboard/BadgeGrid';
import XPBar from '../components/dashboard/XPBar';
import { getDashboard } from '../api/dashboard';

export default function Dashboard() {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const res = await getDashboard();
      setData(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner text="Loading dashboard..." />;

  if (!data) {
    return (
      <AnimatedPage className="py-8 text-center">
        <p className="text-dark-400">Unable to load dashboard</p>
        <Button variant="secondary" size="sm" className="mt-4" onClick={fetchDashboard}>
          Retry
        </Button>
      </AnimatedPage>
    );
  }

  return (
    <AnimatedPage className="py-2 space-y-6">
      {/* Top row — Score hero + Stats + Quick action */}
      <div className="grid grid-cols-12 gap-6">
        {/* Sugar Score Card — big hero */}
        <Card className="!p-8 col-span-5">
          <div className="flex items-center gap-8">
            <SugarScoreRing score={data.sugarScore} />
            <div className="flex-1 space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-white mb-1">Today's Sugar Score</h3>
                <p className="text-sm text-dark-400">
                  {data.sugarScore >= 80
                    ? 'Amazing! Keep it up — your habits are on point 💪'
                    : data.sugarScore >= 50
                    ? 'Doing well, stay mindful of your intake'
                    : 'Try to cut back a little today'}
                </p>
              </div>
              <XPBar xp={data.xp} level={data.level} />
            </div>
          </div>
        </Card>

        {/* Stats grid — right side */}
        <div className="col-span-4">
          <StatsGrid
            xp={data.xp}
            level={data.level}
            streakCount={data.streakCount}
            bestStreak={data.bestStreak}
          />
        </div>

        {/* Quick Log CTA card */}
        <Card className="!p-6 col-span-3 flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-royal-500/20 to-sugar-500/20 border border-royal-500/20 flex items-center justify-center mb-4">
              <PlusCircle size={22} className="text-royal-400" />
            </div>
            <h3 className="font-semibold text-white text-sm mb-1">Log Sugar Intake</h3>
            <p className="text-xs text-dark-400">Track what you eat and get instant AI insights</p>
          </div>
          <Button size="md" className="w-full mt-4" onClick={() => navigate('/log')}>
            Log Now <ArrowRight size={14} />
          </Button>
        </Card>
      </div>

      {/* Bottom row — Today's logs + Badges side by side */}
      <div className="grid grid-cols-12 gap-6">
        {/* Today's Logs — wider left */}
        <div className="col-span-7">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-semibold text-lg text-white flex items-center gap-2">
              <Sparkles size={18} className="text-sugar-400" />
              Today's Log
            </h2>
            <span className="text-xs text-dark-500 bg-white/5 px-3 py-1 rounded-lg border border-white/10">
              {data.todaySugarLogs?.length || 0} items
            </span>
          </div>
          <TodayLogs logs={data.todaySugarLogs} />
        </div>

        {/* Badges — right column */}
        <div className="col-span-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-semibold text-lg text-white flex items-center gap-2">
              <TrendingUp size={18} className="text-gold-400" />
              Badges
            </h2>
            <button
              onClick={() => navigate('/history')}
              className="text-xs text-royal-400 hover:text-royal-300 transition-colors"
            >
              View All →
            </button>
          </div>
          <Card className="!p-5">
            <BadgeGrid earned={data.badges} />
          </Card>
        </div>
      </div>
    </AnimatedPage>
  );
}
