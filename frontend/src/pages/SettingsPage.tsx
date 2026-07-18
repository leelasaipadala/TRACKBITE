import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { 
  Settings, 
  Bell, 
  Lock, 
  Trash2, 
  LogOut, 
  Moon, 
  Sun
} from 'lucide-react';
import api from '../services/api';

export default function SettingsPage() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const darkMode = theme === 'dark';

  // Reminders states
  const [mealReminders, setMealReminders] = useState(true);
  const [workoutReminders, setWorkoutReminders] = useState(true);
  const [waterReminders, setWaterReminders] = useState(true);

  // Password inputs
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!oldPassword || !newPassword) {
      alert('Please fill out all fields.');
      return;
    }
    if (newPassword !== confirmPassword) {
      alert('New passwords do not match.');
      return;
    }

    try {
      // Send PUT update request
      await api.put('/users/me', { password: newPassword });
      alert('Password updated successfully!');
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      alert('Failed to change password: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm('WARNING: Are you absolutely sure you want to permanently delete your TRACKBITE account? This action is irreversible.')) {
      return;
    }

    try {
      await api.delete('/users/me');
      alert('Your account has been deleted.');
      logout();
      navigate('/login');
    } catch (err: any) {
      console.warn('Backend delete fail, clearing local auth data only', err);
      logout();
      navigate('/login');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-transparent text-slate-800 dark:text-slate-100 p-4 md:p-6 transition-colors duration-300">
      <div className="mx-auto max-w-4xl rounded-[2.5rem] border border-emerald-100/10 dark:border-slate-800/40 bg-white/70 dark:bg-slate-900/60 p-6 md:p-8 shadow-sm backdrop-blur-xl space-y-6">
        
        <header className="flex items-center gap-3 border-b pb-4">
          <div className="h-10 w-10 rounded-2xl bg-gradient-to-tr from-emerald-500 to-lime-500 flex items-center justify-center text-white shadow-md">
            <Settings size={20} />
          </div>
          <div>
            <h1 className="font-extrabold text-xl text-slate-950 dark:text-white leading-none">Account Settings</h1>
            <span className="text-[10px] text-[var(--text-muted)] font-bold uppercase tracking-wider mt-1 block">Manage Theme, Notifications & Safety</span>
          </div>
        </header>

        <div className="grid gap-6 md:grid-cols-2">
          
          {/* Left Column: Toggles and configurations */}
          <div className="space-y-4">
            
            {/* Theme switcher */}
            <div className="rounded-2xl border p-4 bg-white dark:bg-slate-900 flex items-center justify-between">
              <div className="space-y-1">
                <h3 className="font-bold text-xs flex items-center gap-1.5">
                  {darkMode ? <Moon size={14} className="text-emerald-500" /> : <Sun size={14} className="text-amber-500" />}
                  Theme Mode
                </h3>
                <p className="text-[10px] text-[var(--text-muted)] leading-relaxed">Toggle between bright and premium glass dark views.</p>
              </div>
              <button 
                onClick={toggleTheme}
                className={`rounded-xl px-4 py-2 text-xs font-bold transition duration-205 border ${
                  darkMode 
                    ? 'bg-slate-950 text-white border-slate-700' 
                    : 'bg-emerald-50 border-emerald-100 text-emerald-700'
                }`}
              >
                {darkMode ? 'Dark View' : 'Light View'}
              </button>
            </div>

            {/* Notifications toggles */}
            <div className="rounded-2xl border p-4 bg-white dark:bg-slate-900 space-y-3.5">
              <h3 className="font-bold text-xs flex items-center gap-1.5"><Bell size={14} className="text-emerald-500" /> Reminders Alerts</h3>
              
              <div className="space-y-2 text-xs font-semibold">
                <div className="flex justify-between items-center pb-2 border-b">
                  <span className="text-slate-500">Meal Planning Alarms</span>
                  <button onClick={() => setMealReminders(!mealReminders)} className={`rounded-lg px-2.5 py-1 ${mealReminders ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-655'}`}>
                    {mealReminders ? 'Active' : 'Muted'}
                  </button>
                </div>
                <div className="flex justify-between items-center pb-2 border-b">
                  <span className="text-slate-500">Daily Hydration Alarms</span>
                  <button onClick={() => setWaterReminders(!waterReminders)} className={`rounded-lg px-2.5 py-1 ${waterReminders ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-655'}`}>
                    {waterReminders ? 'Active' : 'Muted'}
                  </button>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Exercise Workout Alerts</span>
                  <button onClick={() => setWorkoutReminders(!workoutReminders)} className={`rounded-lg px-2.5 py-1 ${workoutReminders ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-655'}`}>
                    {workoutReminders ? 'Active' : 'Muted'}
                  </button>
                </div>
              </div>
            </div>

            {/* Logout and Delete Actions */}
            <div className="rounded-2xl border p-4 bg-white dark:bg-slate-900 space-y-3">
              <button 
                onClick={handleLogout}
                className="w-full rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 font-bold text-xs py-3 flex items-center justify-center gap-1.5 transition"
              >
                <LogOut size={14} /> Log out session
              </button>
              <button 
                onClick={handleDeleteAccount}
                className="w-full rounded-xl border border-rose-500/20 bg-rose-500/5 hover:bg-rose-500/10 text-rose-500 font-bold text-xs py-3 flex items-center justify-center gap-1.5 transition"
              >
                <Trash2 size={14} /> Permanently Delete Account
              </button>
            </div>

          </div>

          {/* Right Column Change Password form */}
          <form onSubmit={handleUpdatePassword} className="rounded-2xl border p-6 bg-white dark:bg-slate-900 space-y-4">
            <h3 className="font-bold text-xs flex items-center gap-1.5"><Lock size={14} className="text-emerald-500" /> Change account password</h3>
            
            <div className="space-y-3 text-xs font-semibold">
              <label className="block space-y-1">
                <span>Old password</span>
                <input 
                  type="password"
                  placeholder="••••••••"
                  className="w-full rounded-xl border bg-white dark:bg-slate-800 p-2.5 outline-none"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                />
              </label>
              <label className="block space-y-1">
                <span>New password</span>
                <input 
                  type="password"
                  placeholder="••••••••"
                  className="w-full rounded-xl border bg-white dark:bg-slate-800 p-2.5 outline-none"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </label>
              <label className="block space-y-1">
                <span>Confirm new password</span>
                <input 
                  type="password"
                  placeholder="••••••••"
                  className="w-full rounded-xl border bg-white dark:bg-slate-800 p-2.5 outline-none"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </label>
            </div>

            <button 
              type="submit"
              className="w-full rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs py-3 transition mt-2"
            >
              Update password
            </button>
          </form>

        </div>

      </div>
    </div>
  );
}
