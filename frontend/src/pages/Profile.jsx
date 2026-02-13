import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  User,
  Mail,
  Shield,
  LogOut,
  ChevronRight,
  Sparkles,
  Award,
  Info,
} from 'lucide-react';
import toast from 'react-hot-toast';
import AnimatedPage from '../components/common/AnimatedPage';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import { useAuth } from '../context/AuthContext';

export default function Profile() {
  const navigate = useNavigate();
  const { anonymousId, logout } = useAuth();

  const handleLogout = () => {
    logout();
    toast.success('Logged out');
    navigate('/welcome');
  };

  const menuItems = [
    {
      icon: Shield,
      label: 'Health Permissions',
      desc: 'Manage data access',
      color: 'text-mint-400',
      bg: 'bg-mint-500/10',
      action: () => navigate('/health'),
    },
    {
      icon: Award,
      label: 'View All Badges',
      desc: 'Your achievements',
      color: 'text-gold-400',
      bg: 'bg-gold-500/10',
      action: () => navigate('/history'),
    },
    {
      icon: Mail,
      label: 'Create Account',
      desc: 'Save progress across devices',
      color: 'text-royal-400',
      bg: 'bg-royal-500/10',
      action: () => navigate('/signup'),
    },
  ];

  return (
    <AnimatedPage className="py-2 space-y-6">
      <div>
        <p className="text-dark-400 text-sm mt-1">Manage your account and preferences</p>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Left — User Card + Actions */}
        <div className="col-span-5 space-y-5">
          {/* User Card */}
          <Card className="!p-6">
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-royal-500 to-sugar-500 flex items-center justify-center shadow-lg shadow-royal-500/20">
                <User size={28} className="text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-display font-bold text-lg text-white">SugarSense User</h3>
                <p className="text-xs text-dark-500 truncate mt-1">
                  ID: {anonymousId?.slice(0, 16)}...
                </p>
              </div>
              <Sparkles size={20} className="text-royal-400" />
            </div>
          </Card>

          {/* About */}
          <Card className="!p-5">
            <div className="flex items-center gap-2 mb-3">
              <Info size={16} className="text-dark-400" />
              <h3 className="text-sm font-semibold text-dark-300">About SugarSense</h3>
            </div>
            <p className="text-sm text-dark-400 leading-relaxed">
              SugarSense uses AI and machine learning to help you understand how sugar affects
              your body. Track your intake, get personalized insights, and build healthier habits
              through gamification.
            </p>
            <p className="text-xs text-dark-600 mt-3">
              Built by Team CSTinMETA · v1.0.0
            </p>
          </Card>

          {/* Logout */}
          <Button
            variant="danger"
            size="lg"
            className="w-full"
            onClick={handleLogout}
          >
            <LogOut size={16} /> Log Out
          </Button>
        </div>

        {/* Right — Menu Items */}
        <div className="col-span-7">
          <h3 className="text-sm font-semibold text-dark-300 mb-4 uppercase tracking-wider">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-3">
            {menuItems.map((item, i) => (
              <motion.button
                key={i}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                whileTap={{ scale: 0.98 }}
                onClick={item.action}
                className="glass-sm p-5 flex flex-col items-start gap-3 glass-hover text-left"
              >
                <div className={`w-12 h-12 rounded-xl ${item.bg} flex items-center justify-center`}>
                  <item.icon size={22} className={item.color} />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">{item.label}</p>
                  <p className="text-xs text-dark-500 mt-0.5">{item.desc}</p>
                </div>
                <ChevronRight size={16} className="text-dark-500 self-end" />
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    </AnimatedPage>
  );
}
