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
  X,
  Footprints,
  Moon,
  Activity,
  Check,
} from 'lucide-react';
import toast from 'react-hot-toast';
import AnimatedPage from '../components/common/AnimatedPage';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import { useAuth } from '../context/AuthContext';
import { connectHealth } from '../api/health';

export default function Profile() {
  const navigate = useNavigate();
  const { anonymousId, logout } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [permissions, setPermissions] = useState({
    steps: true,
    sleep: true,
    heartRate: false,
  });

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
      action: () => setShowModal(true),
    },
    {
      icon: Award,
      label: 'View All Badges',
      desc: 'Your achievements',
      color: 'text-gold-400',
      bg: 'bg-gold-500/10',
      action: () => navigate('/badges'),
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

      {/* Health Permissions Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="w-full max-w-md bg-dark-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
          >
            <div className="flex items-center justify-between p-5 border-b border-white/5">
              <h3 className="font-semibold text-white">Health Permissions</h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 rounded-lg hover:bg-white/5 text-dark-400 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <p className="text-sm text-dark-400">
                Manage which health data SugarSense can access to improve your risk predictions.
              </p>

              <div className="space-y-3">
                {[
                  { key: 'steps', label: 'Steps', icon: Footprints, color: 'text-mint-400', desc: 'Daily step count' },
                  { key: 'sleep', label: 'Sleep', icon: Moon, color: 'text-royal-400', desc: 'Sleep duration' },
                  { key: 'heartRate', label: 'Heart Rate', icon: Activity, color: 'text-red-400', desc: 'Average BPM' },
                ].map((p) => (
                  <motion.button
                    key={p.key}
                    whileTap={{ scale: 0.98 }}
                    onClick={() =>
                      setPermissions({ ...permissions, [p.key]: !permissions[p.key] })
                    }
                    className={`w-full flex items-center gap-3 p-4 rounded-xl border transition-all ${permissions[p.key]
                        ? 'bg-royal-500/10 border-royal-500/30'
                        : 'bg-white/5 border-white/10 opacity-60'
                      }`}
                  >
                    <p.icon size={20} className={p.color} />
                    <div className="flex-1 text-left">
                      <p className="text-sm font-medium text-white">{p.label}</p>
                      <p className="text-xs text-dark-500">{p.desc}</p>
                    </div>
                    <div
                      className={`w-5 h-5 rounded-md flex items-center justify-center transition-all ${permissions[p.key]
                          ? 'bg-royal-500 border-royal-500'
                          : 'bg-transparent border border-dark-500'
                        }`}
                    >
                      {permissions[p.key] && <Check size={12} className="text-white" />}
                    </div>
                  </motion.button>
                ))}
              </div>

              <div className="pt-4 flex gap-3">
                <Button variant="secondary" className="flex-1" onClick={() => setShowModal(false)}>
                  Cancel
                </Button>
                <Button
                  className="flex-1"
                  loading={connecting}
                  onClick={async () => {
                    setConnecting(true);
                    try {
                      await connectHealth(permissions);
                      toast.success('Permissions updated successfully');
                      setShowModal(false);
                    } catch (err) {
                      toast.error('Failed to update permissions');
                    } finally {
                      setConnecting(false);
                    }
                  }}
                >
                  Save Changes
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatedPage>
  );
}
