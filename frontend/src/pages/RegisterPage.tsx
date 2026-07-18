import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon } from 'lucide-react';
import api from '../services/api';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const darkMode = theme === 'dark';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data } = await api.post('/auth/register', { name, email, password });
      login(data.user, data.token);
      navigate('/assessment');
    } catch (error: any) {
      console.error('Registration failed details:', error);
      const serverMsg = error.response?.data?.message || error.response?.data?.error || (error.response?.data?.errors ? error.response.data.errors.map((e: any) => e.msg).join(', ') : '');
      const errMsg = serverMsg || error.message || 'Unknown network error';
      alert(`Registration Failed: ${errMsg}\n\nTroubleshooting:\n- Make sure both the backend and frontend are running using 'npm run dev'\n- Verify your database connection.`);
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
        <h1 className="page-title text-[var(--text-primary)]">Create your account</h1>
        <p className="mt-2 body-text text-[var(--text-secondary)]">Join the future of personalized nutrition.</p>
        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <input className="w-full rounded-2xl border border-[var(--border-color)] bg-[var(--bg-sidebar)] text-[var(--text-primary)] px-4 py-3 outline-none ring-0 placeholder-[var(--text-muted)] focus:border-emerald-500" placeholder="Full name" value={name} onChange={(e) => setName(e.target.value)} />
          <input className="w-full rounded-2xl border border-[var(--border-color)] bg-[var(--bg-sidebar)] text-[var(--text-primary)] px-4 py-3 outline-none ring-0 placeholder-[var(--text-muted)] focus:border-emerald-500" placeholder="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input className="w-full rounded-2xl border border-[var(--border-color)] bg-[var(--bg-sidebar)] text-[var(--text-primary)] px-4 py-3 outline-none ring-0 placeholder-[var(--text-muted)] focus:border-emerald-500" placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <button className="w-full rounded-2xl bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-bold px-4 py-3 shadow-lg transition duration-200" type="submit">Register</button>
        </form>
        <div className="mt-4 body-text text-[var(--text-secondary)]">Already have an account? <Link className="font-bold text-emerald-600 hover:text-emerald-500 transition" to="/login">Login</Link></div>
      </div>
    </div>
  );
}
