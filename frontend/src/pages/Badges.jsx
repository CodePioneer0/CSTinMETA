import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Award, Lock, ChevronLeft } from 'lucide-react';
import AnimatedPage from '../components/common/AnimatedPage';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { getDashboard } from '../api/dashboard';

const badgeConfig = {
    FIRST_LOG: { emoji: '🎯', label: 'First Log', desc: 'Logged your first sugar event' },
    DAY_3_STREAK: { emoji: '🔥', label: '3-Day Streak', desc: '3 consecutive days of logging' },
    DAY_7_STREAK: { emoji: '⚡', label: '7-Day Streak', desc: 'A full week of tracking!' },
    DAY_30_STREAK: { emoji: '🏆', label: '30-Day Streak', desc: 'A whole month champion!' },
    QUICK_FIXER: { emoji: '⏱️', label: 'Quick Fixer', desc: 'Completed recommended action within 30 min' },
    HEALTH_HERO: { emoji: '❤️', label: 'Health Hero', desc: 'Synced health data for 7 days' },
    SUGAR_FREE: { emoji: '🚫', label: 'Sugar Free', desc: 'No sugar intake for 24 hours' },
    LEVEL_UP: { emoji: '🆙', label: 'Level Up', desc: 'Reached Level 5' },
};

export default function Badges() {
    const navigate = useNavigate();
    const [earnedBadges, setEarnedBadges] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchBadges();
    }, []);

    const fetchBadges = async () => {
        try {
            const res = await getDashboard();
            setEarnedBadges(res.data.badges || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <LoadingSpinner text="Loading achievements..." />;

    const totalBadges = Object.keys(badgeConfig).length;
    const earnedCount = earnedBadges.length;
    const progress = Math.round((earnedCount / totalBadges) * 100);

    return (
        <AnimatedPage className="py-2 space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
                    <ChevronLeft size={20} />
                </Button>
                <div>
                    <h1 className="font-display text-2xl font-bold text-white flex items-center gap-2">
                        <Award className="text-gold-400" /> Achievements
                    </h1>
                    <p className="text-dark-400 text-sm">
                        You've earned {earnedCount} of {totalBadges} badges
                    </p>
                </div>
            </div>

            {/* Progress Bar */}
            <Card className="!p-6">
                <div className="flex justify-between items-end mb-2">
                    <span className="text-sm font-semibold text-white">Collection Progress</span>
                    <span className="text-2xl font-bold text-gold-400">{progress}%</span>
                </div>
                <div className="h-3 bg-dark-700 rounded-full overflow-hidden">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 1, ease: 'easeOut' }}
                        className="h-full bg-gradient-to-r from-gold-500 to-amber-300 rounded-full"
                    />
                </div>
            </Card>

            {/* Badges Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(badgeConfig).map(([key, badge], i) => {
                    const isEarned = earnedBadges.includes(key);
                    return (
                        <motion.div
                            key={key}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                        >
                            <Card className={`!p-4 h-full border transition-all ${isEarned
                                    ? 'border-gold-500/30 bg-gold-500/5'
                                    : 'border-white/5 bg-white/2 opacity-60'
                                }`}>
                                <div className="flex items-center gap-4">
                                    <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-2xl shadow-lg ${isEarned
                                            ? 'bg-gradient-to-br from-gold-500/20 to-amber-500/20 border border-gold-500/30 shadow-gold-500/10'
                                            : 'bg-white/5 border border-white/10'
                                        }`}>
                                        {isEarned ? badge.emoji : <Lock size={20} className="text-dark-500" />}
                                    </div>
                                    <div className="flex-1">
                                        <h3 className={`font-semibold ${isEarned ? 'text-white' : 'text-dark-400'}`}>
                                            {badge.label}
                                        </h3>
                                        <p className="text-xs text-dark-500 mt-1 leading-relaxed">
                                            {badge.desc}
                                        </p>
                                    </div>
                                    {isEarned && (
                                        <div className="px-2 py-1 rounded-md bg-gold-500/20 border border-gold-500/30 text-[10px] font-bold text-gold-400 uppercase tracking-wider">
                                            Earned
                                        </div>
                                    )}
                                </div>
                            </Card>
                        </motion.div>
                    );
                })}
            </div>
        </AnimatedPage>
    );
}
