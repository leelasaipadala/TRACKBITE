import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Sparkles, UserPlus, LogOut } from 'lucide-react';

export default function DemoBanner() {
  const { isDemoMode, exitDemoMode } = useAuth();
  const navigate = useNavigate();

  if (!isDemoMode) return null;

  return (
    <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white px-4 py-2.5 text-xs sm:text-sm font-medium shadow-lg flex items-center justify-between gap-3 sticky top-0 z-50 backdrop-blur-md border-b border-emerald-400/30">
      <div className="flex items-center gap-2 max-w-4xl truncate">
        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/20 text-emerald-100 flex-shrink-0 animate-pulse">
          <Sparkles size={12} />
        </span>
        <span className="truncate">
          <strong className="font-bold">Demo Mode:</strong> You are currently exploring TrackBite read-only. Create a free account to save your custom progress!
        </span>
      </div>

      <div className="flex items-center gap-2 flex-shrink-0">
        <button
          onClick={() => navigate('/register')}
          className="bg-white text-emerald-800 hover:bg-emerald-50 px-3 py-1 rounded-full text-xs font-bold transition shadow-sm flex items-center gap-1.5 cursor-pointer"
        >
          <UserPlus size={13} />
          <span>Create Account</span>
        </button>

        <button
          onClick={() => {
            exitDemoMode();
            navigate('/login');
          }}
          className="bg-emerald-800/60 hover:bg-emerald-900/80 text-emerald-100 px-2.5 py-1 rounded-full text-xs transition flex items-center gap-1 cursor-pointer border border-emerald-500/40"
          title="Exit Demo Mode"
        >
          <LogOut size={12} />
          <span className="hidden sm:inline">Exit</span>
        </button>
      </div>
    </div>
  );
}
