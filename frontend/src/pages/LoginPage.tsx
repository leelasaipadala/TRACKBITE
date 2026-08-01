import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon, AlertCircle, Loader2 } from 'lucide-react';
import api from '../services/api';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const darkMode = theme === 'dark';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    if (!password) {
      setErrorMsg('Please enter your password.');
      return;
    }

    setLoading(true);

    try {
      const { data } = await api.post('/auth/login', { email: cleanEmail, password });
      
      // Temporarily store token so the profile API call succeeds
      localStorage.setItem('token', data.token);
      
      let profile = null;
      try {
        const profileRes = await api.get('/users/me');
        profile = profileRes.data;
      } catch (profileErr) {
        console.warn('Could not fetch user profile details:', profileErr);
      }

      login(data.user, data.token);
      
      if (profile && profile.weight > 0) {
        navigate('/dashboard');
      } else {
        navigate('/assessment');
      }
    } catch (error: any) {
      console.error('Login failed details:', error);
      const serverErrors = error.response?.data?.errors;
      let msg = '';
      if (Array.isArray(serverErrors) && serverErrors.length > 0) {
        msg = serverErrors.map((e: any) => e.msg || e.message).filter(Boolean).join('. ');
      } else {
        msg = error.response?.data?.message || error.response?.data?.error || error.message || 'Invalid email or password. Please check your credentials and try again.';
      }
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--bg-body)] relative overflow-hidden p-6">
      {/* Animated Background Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-emerald-500/10 dark:bg-emerald-500/5 blur-[120px] animate-blob-1" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-500/10 dark:bg-blue-500/5 blur-[120px] animate-blob-2" />
      </div>

      {/* Floating Theme Toggle */}
      <button 
        onClick={toggleTheme}
        className="absolute top-6 right-6 p-3 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] hover:bg-[var(--border-color)] text-[var(--text-primary)] dark:text-amber-400 transition shadow-lg relative z-20 cursor-pointer"
        title="Toggle Theme"
      >
        {darkMode ? <Sun size={18} /> : <Moon size={18} />}
      </button>

      <div className="w-full max-w-md rounded-[2.5rem] border border-[var(--border-color)] bg-[var(--bg-card)]/80 backdrop-blur-xl p-8 shadow-2xl relative z-10">
        <h1 className="page-title text-[var(--text-primary)]">Welcome back</h1>
        <p className="mt-2 body-text text-[var(--text-secondary)]">Log in to continue your smart diet journey.</p>

        {errorMsg && (
          <div className="mt-4 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-sm flex items-start gap-3 animate-fade-in">
            <AlertCircle className="shrink-0 w-5 h-5 mt-0.5" />
            <div className="flex-1">
              <span>{errorMsg}</span>
            </div>
          </div>
        )}

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <input 
            className="w-full rounded-2xl border border-[var(--border-color)] bg-[var(--bg-sidebar)] text-[var(--text-primary)] px-4 py-3 outline-none ring-0 placeholder-[var(--text-muted)] focus:border-emerald-500 transition" 
            placeholder="Email" 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            disabled={loading}
          />
          <input 
            className="w-full rounded-2xl border border-[var(--border-color)] bg-[var(--bg-sidebar)] text-[var(--text-primary)] px-4 py-3 outline-none ring-0 placeholder-[var(--text-muted)] focus:border-emerald-500 transition" 
            placeholder="Password" 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            disabled={loading}
          />
          <button 
            className="w-full rounded-2xl bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-bold px-4 py-3 shadow-lg transition duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60" 
            type="submit"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Logging in...</span>
              </>
            ) : (
              'Login'
            )}
          </button>
        </form>
        <div className="mt-4 body-text text-[var(--text-secondary)]">Don’t have an account? <Link className="font-bold text-emerald-600 hover:text-emerald-500 transition" to="/register">Create one</Link></div>
      </div>
    </div>
  );
}

