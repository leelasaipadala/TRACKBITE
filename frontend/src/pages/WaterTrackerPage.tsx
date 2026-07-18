import { useState, useEffect, useMemo } from 'react';
import { 
  Droplet, 
  Trash2, 
  Bell, 
  BellOff, 
  TrendingUp,
  Flame
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip 
} from 'recharts';
import { 
  readNutritionState, 
  saveNutritionState,
  buildWeeklyWaterTrend
} from '../services/nutritionTracking';
import api from '../services/api';

interface WaterLogEvent {
  id: string;
  amount: number; // in Liters
  time: string;
}

export default function WaterTrackerPage() {
  const [state, setState] = useState(() => readNutritionState());
  const [todayLogs, setTodayLogs] = useState<WaterLogEvent[]>([]);
  const [remindersActive, setRemindersActive] = useState(true);

  // Sync state
  useEffect(() => {
    saveNutritionState(state);
  }, [state]);

  const fetchTodayWater = async () => {
    try {
      const todayDate = new Date().toISOString().slice(0, 10);
      const { data } = await api.get(`/progress/daily/${todayDate}`);
      if (data && data.water !== undefined) {
        setState(prev => ({ ...prev, water: data.water }));
      }
    } catch (err) {
      console.warn('Failed to load water from database', err);
    }
  };

  // Synchronize state when custom event is fired from other pages
  useEffect(() => {
    fetchTodayWater();
    const handleSync = () => {
      setState(readNutritionState());
    };
    window.addEventListener('nutrition-update', handleSync);
    return () => window.removeEventListener('nutrition-update', handleSync);
  }, []);

  const weeklyTrend = useMemo(() => buildWeeklyWaterTrend(state.history), [state.history]);

  // Add water helper
  const handleAddWater = async (amountLiters: number) => {
    const nextWater = state.water + amountLiters;
    setState(prev => ({
      ...prev,
      water: nextWater
    }));

    const newLog: WaterLogEvent = {
      id: `${Date.now()}`,
      amount: amountLiters,
      time: new Date().toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })
    };
    setTodayLogs(prev => [newLog, ...prev]);

    try {
      const todayDate = new Date().toISOString().slice(0, 10);
      await api.post(`/progress/daily/${todayDate}`, { water: nextWater });
    } catch (err) {
      console.warn('Failed to save water to database', err);
    }

    // Dispatch update event
    window.dispatchEvent(new Event('nutrition-update'));
  };

  const handleDeleteLog = async (id: string, amount: number) => {
    const nextWater = Math.max(0, state.water - amount);
    setTodayLogs(prev => prev.filter(log => log.id !== id));
    setState(prev => ({
      ...prev,
      water: nextWater
    }));

    try {
      const todayDate = new Date().toISOString().slice(0, 10);
      await api.post(`/progress/daily/${todayDate}`, { water: nextWater });
    } catch (err) {
      console.warn('Failed to save water to database', err);
    }

    window.dispatchEvent(new Event('nutrition-update'));
  };

  const targetWater = 2.8;
  const progressPercent = Math.min(100, Math.round((state.water / targetWater) * 100));

  return (
    <div className="min-h-screen bg-transparent text-[var(--text-primary)] p-4 md:p-6 transition-colors duration-300">
      <div className="mx-auto max-w-6xl space-y-6">
        
        {/* Header */}
        <header className="rounded-3xl border border-[var(--border-color)] bg-[var(--bg-card)] p-6 shadow-xl flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-gradient-to-tr from-blue-500 to-indigo-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
              <Droplet size={20} />
            </div>
            <div>
              <h1 className="page-title text-[var(--text-primary)] leading-none">Water Tracker</h1>
              <span className="text-[10px] text-[var(--text-muted)] font-bold uppercase tracking-wider mt-1 block">Log & Monitor Daily Hydration</span>
            </div>
          </div>

          <button 
            onClick={() => setRemindersActive(!remindersActive)}
            className={`flex items-center gap-1.5 font-bold text-xs px-4 py-2.5 rounded-xl border transition ${
              remindersActive 
                ? 'bg-blue-500/10 border-blue-500/30 text-blue-600 dark:text-blue-400' 
                : 'bg-[var(--bg-sidebar)] border-[var(--border-color)] text-[var(--text-secondary)]'
            }`}
          >
            {remindersActive ? <Bell size={13} /> : <BellOff size={13} />}
            <span>Reminders {remindersActive ? 'Active' : 'Disabled'}</span>
          </button>
        </header>

        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
          
          {/* Main Hydration Progress Widget */}
          <div className="space-y-6">
            
            {/* Progress gauge card */}
            <div className="rounded-[2.5rem] border border-[var(--border-color)] bg-[var(--bg-card)]/80 backdrop-blur-md p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl card-hover-lift">
              <div className="space-y-3">
                <div className="label-text text-blue-500 flex items-center gap-1.5"><Flame size={13} /> Daily Goal</div>
                <h2 className="text-4xl font-extrabold text-[var(--text-primary)]">{state.water.toFixed(2)} <span className="text-xl font-medium text-[var(--text-muted)]">/ {targetWater} Liters</span></h2>
                <p className="small-text text-[var(--text-secondary)] leading-relaxed max-w-sm">
                  Drinking sufficient water enhances energy levels, supports joint health, and speeds up your calorie-burning metabolism.
                </p>

                {/* Quick Add Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-3">
                  {[
                    { label: '+250 ml', val: 0.25 },
                    { label: '+500 ml', val: 0.50 },
                    { label: '+750 ml', val: 0.75 },
                    { label: '+1.0 L', val: 1.00 }
                  ].map(btn => (
                    <button
                      key={btn.label}
                      onClick={() => handleAddWater(btn.val)}
                      className="rounded-xl border border-blue-500/20 bg-blue-500/10 hover:bg-blue-500/20 text-blue-500 dark:text-blue-400 text-xs font-bold py-2.5 transition active:scale-95"
                    >
                      {btn.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Progress Ring */}
              <div className="h-44 w-44 relative flex items-center justify-center">
                <svg className="h-full w-full transform -rotate-90">
                  <circle
                    stroke="var(--border-color)"
                    fill="transparent"
                    strokeWidth={10}
                    r={68}
                    cx={88}
                    cy={88}
                  />
                  <circle
                    stroke="#3b82f6"
                    fill="transparent"
                    strokeWidth={10}
                    strokeDasharray={427 + ' ' + 427}
                    style={{ strokeDashoffset: 427 - (progressPercent / 100) * 427 }}
                    strokeLinecap="round"
                    r={68}
                    cx={88}
                    cy={88}
                  />
                </svg>
                <div className="absolute flex flex-col items-center justify-center text-center">
                  <span className="text-3xl font-black text-[var(--text-primary)]">{progressPercent}%</span>
                  <span className="text-[9px] text-[var(--text-muted)] uppercase font-bold tracking-wider">Hydrated</span>
                </div>
              </div>
            </div>

            {/* Weekly water reports trend Recharts */}
            <div className="rounded-[2.5rem] border border-[var(--border-color)] bg-[var(--bg-card)]/80 backdrop-blur-md p-6 md:p-8 space-y-4 shadow-xl card-hover-lift">
              <h3 className="section-title text-[var(--text-primary)] flex items-center gap-1.5"><TrendingUp size={16} className="text-blue-500" /> Weekly Hydration Trend</h3>
              <div className="h-52">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weeklyTrend}>
                    <XAxis dataKey="day" stroke="var(--text-muted)" fontSize={10} tickLine={false} />
                    <YAxis stroke="var(--text-muted)" fontSize={10} tickLine={false} />
                    <Tooltip contentStyle={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }} />
                    <Bar dataKey="water" fill="#3B82F6" radius={[4, 4, 0, 0]} name="Water (Liters)" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>

          {/* Right Column sidebar: streak cards and log events */}
          <div className="space-y-6">
            {/* Water Streak milestone card */}
            <div className="rounded-[2rem] border border-[var(--border-color)] bg-[var(--bg-card)]/80 backdrop-blur-md p-6 flex flex-col justify-between gap-3 shadow-xl card-hover-lift">
              <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider block">Hydration Streak</span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-4xl font-black text-blue-500">💧 {state.water >= targetWater ? state.streakCount : Math.max(0, state.streakCount - 1)}</span>
                <span className="text-xs text-[var(--text-secondary)] font-bold">days met</span>
              </div>
              <p className="text-[10px] text-[var(--text-secondary)] font-semibold">Keep meeting your 2.8L daily target to maintain your streak!</p>
            </div>

            {/* Today events logs history list */}
            <div className="rounded-[2rem] border border-[var(--border-color)] bg-[var(--bg-card)]/80 backdrop-blur-md p-6 space-y-4 shadow-xl card-hover-lift">
              <h3 className="card-title text-[var(--text-primary)] flex items-center gap-1.5"><Droplet size={15} className="text-blue-500" /> Hydration logs</h3>
              <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                {todayLogs.map(log => (
                  <div key={log.id} className="p-3 border border-[var(--border-color)] rounded-xl bg-[var(--bg-sidebar)] flex items-center justify-between gap-3 text-xs">
                    <div>
                      <div className="font-bold text-[var(--text-primary)]">Logged {log.amount * 1000} ml</div>
                      <span className="text-[10px] text-[var(--text-muted)] block mt-0.5">{log.time}</span>
                    </div>
                    <button 
                      onClick={() => handleDeleteLog(log.id, log.amount)}
                      className="p-1.5 text-rose-500 hover:bg-rose-500/10 rounded-lg transition"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                ))}
                {todayLogs.length === 0 && (
                  <p className="text-xs text-[var(--text-muted)] text-center py-6">No water logs added today yet.</p>
                )}
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
