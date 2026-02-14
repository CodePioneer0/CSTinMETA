import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, Brain, Calendar, ChevronDown } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import AnimatedPage from '../components/common/AnimatedPage';
import Card from '../components/common/Card';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { getSugarHistory, getInsightsHistory } from '../api/history';

const dayRanges = [
  { label: '7 Days', value: 7 },
  { label: '14 Days', value: 14 },
  { label: '30 Days', value: 30 },
];

const riskColors = {
  HIGH_SUGAR_HABIT: '#ef4444',
  SLEEP_DISRUPTION: '#a78bfa',
  ENERGY_CRASH: '#f97316',
  WEIGHT_GAIN_RISK: '#fbbf24',
  DEHYDRATION_RISK: '#60a5fa',
};

const riskLabels = {
  HIGH_SUGAR_HABIT: 'High Sugar Habit',
  SLEEP_DISRUPTION: 'Sleep Disruption',
  ENERGY_CRASH: 'Energy Crash',
  WEIGHT_GAIN_RISK: 'Weight Gain Risk',
  DEHYDRATION_RISK: 'Dehydration Risk',
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-sm p-2 text-xs">
        <p className="text-white font-medium">{label}</p>
        <p className="text-dark-300">{payload[0].value} items</p>
      </div>
    );
  }
  return null;
};

export default function History() {
  const [days, setDays] = useState(7);
  const [sugarHistory, setSugarHistory] = useState([]);
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('sugar');

  useEffect(() => {
    fetchData();
  }, [days]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [sRes, iRes] = await Promise.all([
        getSugarHistory(days),
        getInsightsHistory(days),
      ]);
      setSugarHistory(sRes.data.history || []);
      setInsights(iRes.data.insights || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Aggregate sugar data by date for chart
  const chartData = () => {
    const map = {};
    sugarHistory.forEach((e) => {
      const d = e.date;
      if (!map[d]) map[d] = 0;
      map[d]++;
    });
    return Object.entries(map)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, count]) => ({
        date: new Date(date).toLocaleDateString('en', { month: 'short', day: 'numeric' }),
        count,
      }));
  };

  const barColors = ['#8b5cf6', '#a78bfa', '#c4b5fd', '#7c3aed', '#6d28d9', '#5b21b6', '#9333ea'];

  return (
    <AnimatedPage className="py-2 space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <p className="text-dark-400 text-sm mt-1">Track your sugar journey over time</p>
        </div>
        {/* Range + Tab selectors — top right */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 w-full lg:w-auto">
          <div className="flex flex-wrap gap-2">
            {dayRanges.map((r) => (
              <motion.button
                key={r.value}
                whileTap={{ scale: 0.95 }}
                onClick={() => setDays(r.value)}
                className={`px-3 sm:px-4 py-2 rounded-lg text-xs font-medium transition-all ${
                  days === r.value
                    ? 'bg-royal-500/20 border border-royal-500/40 text-royal-300'
                    : 'bg-white/5 border border-white/10 text-dark-400 hover:text-white'
                }`}
              >
                {r.label}
              </motion.button>
            ))}
          </div>
          <div className="flex gap-1 p-1 bg-white/5 rounded-xl w-full sm:w-auto">
            {['sugar', 'insights'].map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`flex-1 sm:flex-none px-3 sm:px-4 py-2 rounded-lg text-xs font-semibold transition-all capitalize ${
                  tab === t
                    ? 'bg-royal-500/20 text-royal-300 shadow-sm'
                    : 'text-dark-400 hover:text-white'
                }`}
              >
                {t === 'sugar' ? (
                  <span className="flex items-center gap-1.5">
                    <BarChart3 size={14} /> Sugar Log
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5">
                    <Brain size={14} /> AI Insights
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {loading ? (
        <LoadingSpinner text="Fetching history..." />
      ) : tab === 'sugar' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
          {/* Chart — left, wide */}
          <div className="lg:col-span-7">
            {chartData().length > 0 ? (
              <Card className="!p-4 sm:!p-6">
                <h3 className="text-sm text-dark-300 font-semibold mb-4 flex items-center gap-2">
                  <Calendar size={14} /> Daily Sugar Events
                </h3>
                <ResponsiveContainer width="100%" height={320}>
                  <BarChart data={chartData()} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                    <XAxis
                      dataKey="date"
                      tick={{ fontSize: 11, fill: '#6b6b8a' }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fontSize: 11, fill: '#6b6b8a' }}
                      axisLine={false}
                      tickLine={false}
                      allowDecimals={false}
                    />
                    <Tooltip content={<CustomTooltip />} cursor={false} />
                    <Bar dataKey="count" radius={[6, 6, 0, 0]} maxBarSize={40}>
                      {chartData().map((_, i) => (
                        <Cell key={i} fill={barColors[i % barColors.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            ) : (
              <Card className="!p-8 text-center">
                <p className="text-dark-400 text-sm">No sugar logs in this period</p>
              </Card>
            )}
          </div>

          {/* Sugar Event List — right */}
          <div className="lg:col-span-5">
            <Card className="!p-4">
              <h3 className="text-sm font-semibold text-dark-300 mb-3">Recent Events</h3>
              <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1 custom-scrollbar">
                {sugarHistory.length === 0 ? (
                  <p className="text-xs text-dark-500 text-center py-6">No events recorded</p>
                ) : (
                  sugarHistory.slice(0, 20).map((event, i) => (
                    <motion.div
                      key={event._id || i}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.03 }}
                      className="glass-sm p-3 flex items-center gap-3"
                    >
                      <div className="w-9 h-9 rounded-lg bg-sugar-500/10 flex items-center justify-center text-base">
                        {event.itemType === 'CHAI' ? '🍵' : event.itemType === 'COFFEE' ? '☕' : event.itemType === 'COLD_DRINK' ? '🥤' : event.itemType === 'SWEETS' ? '🍬' : event.itemType === 'CHOCOLATE' ? '🍫' : event.itemType === 'ICE_CREAM' ? '🍦' : event.itemType === 'JUICE' ? '🧃' : event.itemType === 'PACKAGED_SNACK' ? '📦' : '🍽️'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-white font-medium truncate">
                          {event.itemType.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
                        </p>
                        <p className="text-[11px] text-dark-500">
                          {new Date(event.timestamp).toLocaleDateString('en', { month: 'short', day: 'numeric' })} · {event.timeOfDay?.toLowerCase()}
                        </p>
                      </div>
                      <span className="text-xs text-dark-500">x{event.quantity || 1}</span>
                    </motion.div>
                  ))
                )}
              </div>
            </Card>
          </div>
        </div>
      ) : (
        /* Insights Tab — grid layout */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {insights.length === 0 ? (
            <Card className="!p-8 text-center col-span-2">
              <p className="text-dark-400 text-sm">No insights yet</p>
            </Card>
          ) : (
            insights.slice(0, 20).map((ins, i) => (
              <motion.div
                key={ins._id || i}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Card className="!p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <div
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: riskColors[ins.riskTag] || '#6b6b8a' }}
                    />
                    <span className="text-xs font-medium" style={{ color: riskColors[ins.riskTag] || '#6b6b8a' }}>
                      {riskLabels[ins.riskTag] || ins.riskTag}
                    </span>
                    <span className="text-[11px] text-dark-600 ml-auto">
                      Risk: {Math.round(ins.riskScore * 100)}%
                    </span>
                  </div>
                  <p className="text-sm text-dark-200 leading-relaxed">{ins.insightText}</p>
                  <p className="text-xs text-dark-500 mt-2 italic">💡 {ins.explanation}</p>
                  <p className="text-[10px] text-dark-600 mt-2">
                    {new Date(ins.createdAt).toLocaleDateString('en', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </p>
                </Card>
              </motion.div>
            ))
          )}
        </div>
      )}
    </AnimatedPage>
  );
}
