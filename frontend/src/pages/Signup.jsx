import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, UserPlus, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';
import Button from '../components/common/Button';
import { useAuth } from '../context/AuthContext';
import { signup } from '../api/auth';

export default function Signup() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [form, setForm] = useState({ email: '', password: '', confirm: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      toast.error('Please fill in all fields');
      return;
    }
    if (form.password !== form.confirm) {
      toast.error('Passwords do not match');
      return;
    }
    if (form.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    if (!isAuthenticated) {
      toast.error('Start a session first from the welcome page');
      navigate('/welcome');
      return;
    }
    setLoading(true);
    try {
      const res = await signup({ email: form.email, password: form.password });
      toast.success('Account created! 🎉');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-950 noise-bg relative overflow-hidden flex">
      <div className="orb-purple-xl top-[-100px] right-[-80px]" style={{ position: 'absolute' }} />
      <div className="orb-orange-xl bottom-[-50px] left-[-80px]" style={{ position: 'absolute' }} />

      {/* Left — Decorative */}
      <div className="w-[45%] hidden lg:flex flex-col items-center justify-center relative z-10 border-r border-white/5 bg-dark-900/20">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-sugar-500 to-royal-500 flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-sugar-500/30 animate-float">
            <Sparkles size={36} className="text-white" />
          </div>
          <h2 className="font-display text-4xl font-extrabold tracking-tight mb-3">
            Sugar<span className="gradient-text">Sense</span>
          </h2>
          <p className="text-dark-400 text-lg max-w-xs mx-auto">
            Save your progress and sync across devices
          </p>
        </motion.div>
      </div>

      {/* Right — Signup form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-8 lg:px-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="mb-8 sm:mb-10">
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-white">Create Account</h1>
            <p className="text-dark-400 mt-2">Save your progress and sync across devices</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="relative">
              <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-500" />
              <input
                type="email"
                placeholder="Email address"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full pl-11 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-dark-500 focus:outline-none focus:border-royal-500/50 focus:ring-1 focus:ring-royal-500/30 transition-all"
              />
            </div>

            <div className="relative">
              <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-500" />
              <input
                type="password"
                placeholder="Password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full pl-11 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-dark-500 focus:outline-none focus:border-royal-500/50 focus:ring-1 focus:ring-royal-500/30 transition-all"
              />
            </div>

            <div className="relative">
              <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-500" />
              <input
                type="password"
                placeholder="Confirm password"
                value={form.confirm}
                onChange={(e) => setForm({ ...form, confirm: e.target.value })}
                className="w-full pl-11 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-dark-500 focus:outline-none focus:border-royal-500/50 focus:ring-1 focus:ring-royal-500/30 transition-all"
              />
            </div>

            <Button type="submit" variant="sugar" size="xl" className="w-full" loading={loading}>
              <UserPlus size={16} /> Sign Up
            </Button>
          </form>

          <p className="text-sm text-dark-400 mt-8">
            Already have an account?{' '}
            <Link to="/login" className="text-royal-400 hover:text-royal-300 font-medium">
              Log In
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
