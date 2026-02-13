import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart, Footprints, Moon, Activity, Check, Smartphone } from 'lucide-react';
import toast from 'react-hot-toast';
import AnimatedPage from '../components/common/AnimatedPage';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import { Link } from 'react-router-dom';
import { syncHealth, getPermissions, connectHealth } from '../api/health';

export default function HealthSync() {
  const [healthData, setHealthData] = useState({
    steps: '',
    sleepMinutes: '',
    avgHeartRate: '',
  });
  const [syncing, setSyncing] = useState(false);
  const [synced, setSynced] = useState(false);
  const [permissions, setPermissions] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [connecting, setConnecting] = useState(false);

  // Local permissions state for the modal
  const [modalPermissions, setModalPermissions] = useState({
    steps: false,
    sleep: false,
    heartRate: false,
  });

  useEffect(() => {
    fetchPermissions();
  }, []);

  const fetchPermissions = async () => {
    try {
      const res = await getPermissions();
      const perms = res.data.permissions || { steps: false, sleep: false, heartRate: false };
      setPermissions(perms);
      setModalPermissions(perms);
    } catch (err) {
      console.error(err);
      setPermissions({ steps: false, sleep: false, heartRate: false });
    } finally {
      setLoading(false);
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

  if (loading) return <div className="text-center py-10 text-dark-400">Loading sync options...</div>;

  return (
    <AnimatedPage className="py-2 space-y-6">
      <div>
        <p className="text-dark-400 text-sm mt-1">
          Sync your health data for more accurate sugar risk predictions
        </p>
      </div>

      <div className="max-w-2xl mx-auto">
        <Card className="!p-6">
          <h3 className="font-semibold text-base text-white mb-5">Sync Today's Health Data</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className={`col-span-2 relative ${!permissions?.steps && 'opacity-60 grayscale'}`}>
              <label className="text-xs text-dark-400 mb-1.5 block font-medium flex justify-between">
                <span>Steps *</span>
                {!permissions?.steps && <span className="text-[10px] text-red-400 uppercase tracking-wider font-bold">Locked</span>}
              </label>
              <div className="relative">
                <Footprints size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-dark-500" />
                <input
                  type="number"
                  disabled={!permissions?.steps}
                  value={healthData.steps}
                  onChange={(e) => setHealthData({ ...healthData, steps: e.target.value })}
                  placeholder={permissions?.steps ? "e.g. 8500" : "Permission required"}
                  className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-dark-600 focus:outline-none focus:border-royal-500/50 text-sm disabled:cursor-not-allowed"
                />
              </div>
            </div>

            <div className={`relative ${!permissions?.sleep && 'opacity-60 grayscale'}`}>
              <label className="text-xs text-dark-400 mb-1.5 block font-medium flex justify-between">
                <span>Sleep (mins)</span>
                {!permissions?.sleep && <span className="text-[10px] text-red-400 uppercase tracking-wider font-bold">Locked</span>}
              </label>
              <div className="relative">
                <Moon size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-dark-500" />
                <input
                  type="number"
                  disabled={!permissions?.sleep}
                  value={healthData.sleepMinutes}
                  onChange={(e) => setHealthData({ ...healthData, sleepMinutes: e.target.value })}
                  placeholder={permissions?.sleep ? "e.g. 420" : "Locked"}
                  className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-dark-600 focus:outline-none focus:border-royal-500/50 text-sm disabled:cursor-not-allowed"
                />
              </div>
            </div>

            <div className={`relative ${!permissions?.heartRate && 'opacity-60 grayscale'}`}>
              <label className="text-xs text-dark-400 mb-1.5 block font-medium flex justify-between">
                <span>Avg Heart Rate</span>
                {!permissions?.heartRate && <span className="text-[10px] text-red-400 uppercase tracking-wider font-bold">Locked</span>}
              </label>
              <div className="relative">
                <Activity size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-dark-500" />
                <input
                  type="number"
                  disabled={!permissions?.heartRate}
                  value={healthData.avgHeartRate}
                  onChange={(e) => setHealthData({ ...healthData, avgHeartRate: e.target.value })}
                  placeholder={permissions?.heartRate ? "e.g. 72" : "Locked"}
                  className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-dark-600 focus:outline-none focus:border-royal-500/50 text-sm disabled:cursor-not-allowed"
                />
              </div>
            </div>
          </div>

          {(!permissions?.steps || !permissions?.sleep || !permissions?.heartRate) && (
            <div className="mt-4 p-3 rounded-lg bg-royal-500/10 border border-royal-500/20 text-xs text-royal-300 flex items-center justify-between">
              <span>Some fields are locked due to missing permissions.</span>
              <button onClick={() => setShowModal(true)} className="font-bold hover:underline">Manage Access →</button>
            </div>
          )}

          <Button
            size="lg"
            className="w-full mt-4"
            onClick={handleSync}
            loading={syncing}
            disabled={loading || !permissions?.steps}
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
                disabled={connecting}
              >
                <div className="w-5 h-5 flex items-center justify-center">×</div>
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
                      setModalPermissions({ ...modalPermissions, [p.key]: !modalPermissions[p.key] })
                    }
                    className={`w-full flex items-center gap-3 p-4 rounded-xl border transition-all ${modalPermissions[p.key]
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
                      className={`w-5 h-5 rounded-md flex items-center justify-center transition-all ${modalPermissions[p.key]
                        ? 'bg-royal-500 border-royal-500'
                        : 'bg-transparent border border-dark-500'
                        }`}
                    >
                      {modalPermissions[p.key] && <Check size={12} className="text-white" />}
                    </div>
                  </motion.button>
                ))}
              </div>

              <div className="pt-4 flex gap-3">
                <Button variant="secondary" className="flex-1" onClick={() => setShowModal(false)} disabled={connecting}>
                  Cancel
                </Button>
                <Button
                  className="flex-1"
                  loading={connecting}
                  onClick={async () => {
                    setConnecting(true);
                    try {
                      await connectHealth(modalPermissions);
                      setPermissions(modalPermissions);
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
      )
      }
    </AnimatedPage >
  );
}
