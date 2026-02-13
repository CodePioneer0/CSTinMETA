import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, User, Ruler, Weight, Calendar, Sparkles, Activity, Moon, Footprints, Check } from 'lucide-react';
import toast from 'react-hot-toast';
import Button from '../components/common/Button';
import { useAuth } from '../context/AuthContext';
import { completeOnboarding } from '../api/auth';
import { connectHealth } from '../api/health';

const genders = [
  { value: 'MALE', label: 'Male', emoji: '👨' },
  { value: 'FEMALE', label: 'Female', emoji: '👩' },
  { value: 'OTHER', label: 'Other', emoji: '🧑' },
];

export default function Onboarding() {
  const navigate = useNavigate();
  const { markOnboarded } = useAuth();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    dob: '',
    gender: '',
    height: '',
    weight: '',
    permissions: {
      steps: true,
      sleep: true,
      heartRate: false,
    },
  });

  const steps = [
    {
      title: 'Date of Birth',
      subtitle: 'We use this to personalize advice',
      icon: Calendar,
      field: 'dob',
    },
    {
      title: 'Gender',
      subtitle: 'Helps calculate your BMI accurately',
      icon: User,
      field: 'gender',
    },
    {
      title: 'Height',
      subtitle: 'Enter your height in centimeters',
      icon: Ruler,
      field: 'height',
    },
    {
      title: 'Weight',
      subtitle: 'Enter your weight in kilograms',
      icon: Weight,
      field: 'weight',
    },
    {
      title: 'Health Permissions',
      subtitle: 'Sync data for better predictions',
      icon: Activity,
      field: 'permissions',
    },
  ];

  const canProceed = () => {
    const val = form[steps[step].field];
    if (!val) return false;
    if (steps[step].field === 'height' && (Number(val) < 50 || Number(val) > 300)) return false;
    if (steps[step].field === 'weight' && (Number(val) < 10 || Number(val) > 400)) return false;
    return true;
  };

  const handleNext = async () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      setLoading(true);
      try {
        await connectHealth(form.permissions);
        await completeOnboarding({
          dob: form.dob,
          gender: form.gender,
          height: Number(form.height),
          weight: Number(form.weight),
        });
        markOnboarded();
        toast.success('Welcome aboard! 🎉');
        navigate('/');
      } catch (err) {
        // Even if health sync fails, we proceed
        console.error('Health sync error:', err);
        try {
          await completeOnboarding({
            dob: form.dob,
            gender: form.gender,
            height: Number(form.height),
            weight: Number(form.weight),
          });
          markOnboarded();
          toast.success('Welcome aboard! 🎉');
          navigate('/');
        } catch (innerErr) {
          toast.error(innerErr.response?.data?.message || 'Something went wrong');
        }
      } finally {
        setLoading(false);
      }
    }
  };

  const slideVariants = {
    enter: (direction) => ({ x: direction > 0 ? 200 : -200, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (direction) => ({ x: direction < 0 ? 200 : -200, opacity: 0 }),
  };

  const currentStep = steps[step];

  return (
    <div className="min-h-screen bg-dark-950 noise-bg relative overflow-hidden flex">
      <div className="orb-purple-xl top-[-100px] right-[-100px]" style={{ position: 'absolute' }} />
      <div className="orb-orange top-[60%] left-[-50px]" style={{ position: 'absolute' }} />

      {/* Left — Decorative panel */}
      <div className="w-[400px] xl:w-[480px] flex flex-col justify-center px-12 xl:px-16 border-r border-white/5 bg-dark-900/30 relative z-10">
        <div className="mb-8">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-royal-500 to-sugar-500 flex items-center justify-center shadow-lg shadow-royal-500/25 mb-6">
            <Sparkles size={22} className="text-white" />
          </div>
          <h2 className="font-display text-3xl font-bold text-white mb-3">
            Let's personalize<br />your experience
          </h2>
          <p className="text-dark-400 text-sm leading-relaxed">
            We need a few details to calculate your BMI and give you accurate sugar risk predictions.
          </p>
        </div>

        {/* Progress steps */}
        <div className="space-y-3">
          {steps.map((s, i) => (
            <div
              key={i}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${i === step
                ? 'bg-royal-500/10 border border-royal-500/30'
                : i < step
                  ? 'opacity-60'
                  : 'opacity-30'
                }`}
            >
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${i < step
                ? 'bg-mint-500/20 text-mint-400'
                : i === step
                  ? 'bg-royal-500/20 text-royal-400'
                  : 'bg-white/5 text-dark-500'
                }`}>
                {i < step ? '✓' : i + 1}
              </div>
              <span className={`text-sm font-medium ${i === step ? 'text-white' : 'text-dark-400'}`}>
                {s.title}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Right — Form content */}
      <div className="flex-1 flex flex-col justify-center px-16 xl:px-24 relative z-10">
        <div className="max-w-md">
          {/* Progress bar */}
          <div className="flex gap-2 mb-8">
            {steps.map((_, i) => (
              <div
                key={i}
                className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${i <= step ? 'bg-gradient-to-r from-royal-500 to-sugar-500' : 'bg-dark-700'
                  }`}
              />
            ))}
          </div>

          <p className="text-xs text-dark-500 font-medium mb-2 uppercase tracking-wider">
            STEP {step + 1} OF {steps.length}
          </p>

          {/* Content */}
          <AnimatePresence mode="wait" custom={1}>
            <motion.div
              key={step}
              custom={1}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3, ease: 'easeInOut' }}
            >
              <div className="mb-8">
                <div className="w-14 h-14 rounded-xl bg-royal-500/10 border border-royal-500/20 flex items-center justify-center mb-5">
                  <currentStep.icon size={26} className="text-royal-400" />
                </div>
                <h2 className="font-display text-3xl font-bold text-white mb-2">
                  {currentStep.title}
                </h2>
                <p className="text-dark-400">{currentStep.subtitle}</p>
              </div>

              {/* Input fields */}
              <div className="mb-8">
                {currentStep.field === 'dob' && (
                  <input
                    type="date"
                    value={form.dob}
                    onChange={(e) => setForm({ ...form, dob: e.target.value })}
                    max={new Date().toISOString().split('T')[0]}
                    className="w-full glass-sm px-5 py-4 text-white bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-royal-500/50 focus:ring-1 focus:ring-royal-500/30 transition-all text-lg [color-scheme:dark]"
                  />
                )}

                {currentStep.field === 'gender' && (
                  <div className="grid grid-cols-3 gap-4">
                    {genders.map((g) => (
                      <motion.button
                        key={g.value}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setForm({ ...form, gender: g.value })}
                        className={`flex flex-col items-center gap-3 p-6 rounded-xl border transition-all duration-200 ${form.gender === g.value
                          ? 'bg-royal-500/10 border-royal-500/50 shadow-lg shadow-royal-500/10'
                          : 'bg-white/5 border-white/10 hover:border-white/20'
                          }`}
                      >
                        <span className="text-3xl">{g.emoji}</span>
                        <span className={`text-sm font-medium ${form.gender === g.value ? 'text-royal-400' : 'text-dark-300'}`}>
                          {g.label}
                        </span>
                      </motion.button>
                    ))}
                  </div>
                )}

                {currentStep.field === 'height' && (
                  <div className="relative">
                    <input
                      type="number"
                      value={form.height}
                      onChange={(e) => setForm({ ...form, height: e.target.value })}
                      placeholder="170"
                      min="50"
                      max="300"
                      className="w-full glass-sm px-5 py-4 text-white bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-royal-500/50 focus:ring-1 focus:ring-royal-500/30 transition-all text-3xl font-bold placeholder:text-dark-600 pr-16"
                    />
                    <span className="absolute right-5 top-1/2 -translate-y-1/2 text-dark-400 text-sm font-medium">
                      cm
                    </span>
                  </div>
                )}

                {currentStep.field === 'weight' && (
                  <div className="relative">
                    <input
                      type="number"
                      value={form.weight}
                      onChange={(e) => setForm({ ...form, weight: e.target.value })}
                      placeholder="65"
                      min="10"
                      max="400"
                      className="w-full glass-sm px-5 py-4 text-white bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-royal-500/50 focus:ring-1 focus:ring-royal-500/30 transition-all text-3xl font-bold placeholder:text-dark-600 pr-16"
                    />
                    <span className="absolute right-5 top-1/2 -translate-y-1/2 text-dark-400 text-sm font-medium">
                      kg
                    </span>
                  </div>
                )}


                {currentStep.field === 'permissions' && (
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
                          setForm({
                            ...form,
                            permissions: { ...form.permissions, [p.key]: !form.permissions[p.key] }
                          })
                        }
                        className={`w-full flex items-center gap-3 p-4 rounded-xl border transition-all ${form.permissions[p.key]
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
                          className={`w-5 h-5 rounded-md flex items-center justify-center transition-all ${form.permissions[p.key]
                            ? 'bg-royal-500 border-royal-500'
                            : 'bg-transparent border border-dark-500'
                            }`}
                        >
                          {form.permissions[p.key] && <Check size={12} className="text-white" />}
                        </div>
                      </motion.button>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex gap-3">
            {step > 0 && (
              <Button variant="secondary" size="lg" onClick={() => setStep(step - 1)}>
                <ChevronLeft size={18} />
              </Button>
            )}
            <Button
              size="lg"
              className="flex-1"
              onClick={handleNext}
              loading={loading}
              disabled={!canProceed()}
            >
              {step < steps.length - 1 ? (
                <>
                  Continue <ChevronRight size={18} />
                </>
              ) : (
                'Complete Setup'
              )}
            </Button>
          </div>
        </div>
      </div>
    </div >
  );
}
