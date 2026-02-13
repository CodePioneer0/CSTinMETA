import { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Footprints, Moon, Activity, Check, Smartphone } from 'lucide-react';
import toast from 'react-hot-toast';
import AnimatedPage from '../components/common/AnimatedPage';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import { connectHealth, syncHealth } from '../api/health';

export default function HealthSync() {
  const [permissions, setPermissions] = useState({
    steps: true,
    sleep: true,
    heartRate: false,
  });
  const [healthData, setHealthData] = useState({
    steps: '',
    sleepMinutes: '',
    avgHeartRate: '',
  });
  const [syncing, setSyncing] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [synced, setSynced] = useState(false);

  const handleConnect = async () => {
    setConnecting(true);
    try {
      await connectHealth(permissions);
      toast.success('Health permissions saved');
    } catch (err) {
      toast.error('Failed to save permissions');
    } finally {
      setConnecting(false);
    }
  };

  const handleSync = async () => {
    if (!healthData.steps) {
      toast.error('Steps is required');
      return;
    }
    setSyncing(true);
    try {
      await syncHealth({
        steps: Number(healthData.steps),
        sleepMinutes: healthData.sleepMinutes ? Number(healthData.sleepMinutes) : undefined,
        avgHeartRate: healthData.avgHeartRate ? Number(healthData.avgHeartRate) : undefined,
        source: 'SIMULATED',
      });
      toast.success('Health data synced! 🏃');
      setSynced(true);
    } catch (err) {
      toast.error('Failed to sync health data');
    } finally {
      setSyncing(false);
    }
  };

  const permissionItems = [
    { key: 'steps', label: 'Steps', icon: Footprints, color: 'text-mint-400', desc: 'Daily step count' },
    { key: 'sleep', label: 'Sleep', icon: Moon, color: 'text-royal-400', desc: 'Sleep duration' },
    { key: 'heartRate', label: 'Heart Rate', icon: Activity, color: 'text-red-400', desc: 'Average BPM' },
  ];

  return (
    <AnimatedPage className="py-2 space-y-6">
      <div>
        <p className="text-dark-400 text-sm mt-1">
          Sync your health data for more accurate sugar risk predictions
        </p>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Left — Permissions */}
        <Card className="!p-6 col-span-5">
          <div className="flex items-center gap-2 mb-5">
            <Smartphone size={18} className="text-royal-400" />
            <h3 className="font-semibold text-base text-white">Health Permissions</h3>
          </div>
          <div className="space-y-3">
            {permissionItems.map((p) => (
              <motion.button
                key={p.key}
                whileTap={{ scale: 0.98 }}
                onClick={() =>
                  setPermissions({ ...permissions, [p.key]: !permissions[p.key] })
                }
                className={`w-full flex items-center gap-3 p-4 rounded-xl border transition-all ${
                  permissions[p.key]
                    ? 'bg-white/5 border-royal-500/30'
                    : 'bg-white/2 border-white/8 opacity-60'
                }`}
              >
                <p.icon size={20} className={p.color} />
                <div className="flex-1 text-left">
                  <p className="text-sm font-medium text-white">{p.label}</p>
                  <p className="text-xs text-dark-500">{p.desc}</p>
                </div>
                <div
                  className={`w-5 h-5 rounded-md flex items-center justify-center transition-all ${
                    permissions[p.key]
                      ? 'bg-royal-500 border-royal-500'
                      : 'bg-transparent border border-dark-500'
                  }`}
                >
                  {permissions[p.key] && <Check size={12} className="text-white" />}
                </div>
              </motion.button>
            ))}
          </div>
          <Button
            variant="secondary"
            size="md"
            className="w-full mt-5"
            onClick={handleConnect}
            loading={connecting}
          >
            Save Permissions
          </Button>
        </Card>

        {/* Right — Manual Sync */}
        <Card className="!p-6 col-span-7">
          <h3 className="font-semibold text-base text-white mb-5">Sync Today's Health Data</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="text-xs text-dark-400 mb-1.5 block font-medium">Steps *</label>
              <div className="relative">
                <Footprints size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-dark-500" />
                <input
                  type="number"
                  value={healthData.steps}
                  onChange={(e) => setHealthData({ ...healthData, steps: e.target.value })}
                  placeholder="e.g. 8500"
                  className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-dark-600 focus:outline-none focus:border-royal-500/50 text-sm"
                />
              </div>
            </div>

            <div>
              <label className="text-xs text-dark-400 mb-1.5 block font-medium">Sleep (minutes)</label>
              <div className="relative">
                <Moon size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-dark-500" />
                <input
                  type="number"
                  value={healthData.sleepMinutes}
                  onChange={(e) => setHealthData({ ...healthData, sleepMinutes: e.target.value })}
                  placeholder="e.g. 420"
                  className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-dark-600 focus:outline-none focus:border-royal-500/50 text-sm"
                />
              </div>
            </div>

            <div>
              <label className="text-xs text-dark-400 mb-1.5 block font-medium">Avg Heart Rate (bpm)</label>
              <div className="relative">
                <Activity size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-dark-500" />
                <input
                  type="number"
                  value={healthData.avgHeartRate}
                  onChange={(e) => setHealthData({ ...healthData, avgHeartRate: e.target.value })}
                  placeholder="e.g. 72"
                  className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-dark-600 focus:outline-none focus:border-royal-500/50 text-sm"
                />
              </div>
            </div>
          </div>

          <Button
            size="lg"
            className="w-full mt-6"
            onClick={handleSync}
            loading={syncing}
          >
            {synced ? (
              <>
                <Check size={16} /> Data Synced!
              </>
            ) : (
              'Sync Health Data'
            )}
          </Button>
        </Card>
      </div>

      <p className="text-xs text-dark-600 text-center">
        Health data improves the accuracy of your sugar risk predictions powered by our ML model
      </p>
    </AnimatedPage>
  );
}
