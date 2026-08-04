import { useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { 
  LayoutDashboard, 
  Settings, 
  User, 
  Menu, 
  X, 
  LogOut, 
  Sun, 
  Moon, 
  BarChart3,
  Droplets,
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import TrackBiteLogo from './TrackBiteLogo';

export default function Layout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const darkMode = theme === 'dark';

  const menuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'My Profile', path: '/profile', icon: User },
    { name: 'Reports & Analytics', path: '/reports', icon: BarChart3 },
    { name: 'Water Tracker', path: '/water', icon: Droplets },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const currentPathName = menuItems.find(item => item.path === location.pathname)?.name || 'TRACKBITE Skeuo Tracker';

  return (
    <div className={`min-h-screen flex transition-colors duration-300 relative overflow-hidden ${darkMode ? 'bg-slate-950 text-slate-100' : 'bg-[#EAEFF5] text-slate-900'}`}>
      {/* Skeuomorphic High Performance Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.02]" style={{
          backgroundImage: `
            linear-gradient(to right, currentColor 1px, transparent 1px),
            linear-gradient(to bottom, currentColor 1px, transparent 1px)
          `,
          backgroundSize: '32px 32px'
        }} />
      </div>

      {/* Desktop Skeuomorphic Sidebar */}
      <aside className={`hidden lg:flex flex-col w-72 sticky top-0 h-screen border-r transition-all duration-300 ${
        darkMode 
          ? 'bg-slate-900 border-slate-800' 
          : 'bg-gradient-to-b from-[#F8FAFC] to-[#E2E8F0] border-slate-300'
      } shadow-[6px_0_18px_rgba(0,0,0,0.06)] z-20`}>
        {/* Brand Header */}
        <div className="p-6 flex items-center gap-3.5 border-b border-slate-300/60 dark:border-slate-800 shadow-[inset_0_-1px_1px_rgba(255,255,255,0.7)] dark:shadow-none">
          <div className="p-2.5 rounded-2xl bg-gradient-to-br from-white to-slate-200 dark:from-slate-800 dark:to-slate-900 border border-slate-300 dark:border-slate-700 shadow-[2px_3px_6px_rgba(0,0,0,0.1),inset_0_1px_0_#fff]">
            <TrackBiteLogo size={30} />
          </div>
          <div>
            <h1 className="font-extrabold text-lg tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5">
              TRACKBITE
              <Sparkles size={14} className="text-emerald-500" />
            </h1>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-extrabold tracking-widest uppercase">SKEUOMORPHIC AI</span>
          </div>
        </div>

        {/* Tactile Navigation Links */}
        <nav className="flex-1 p-4 space-y-2.5 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => 
                  `flex items-center gap-3.5 px-4 py-3 rounded-xl font-bold text-sm transition-all duration-150 group ${
                    isActive 
                      ? 'bg-gradient-to-b from-emerald-400 via-emerald-500 to-emerald-600 text-white border border-emerald-600 shadow-[0_4px_0_#047857,0_6px_12px_rgba(16,185,129,0.35),inset_0_1px_1px_rgba(255,255,255,0.5)] translate-y-[-1px]' 
                      : darkMode 
                        ? 'text-slate-400 hover:text-white hover:bg-slate-800/80 border border-transparent' 
                        : 'text-slate-700 hover:text-slate-900 hover:bg-slate-200/60 border border-transparent'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon size={19} className={`transition-transform duration-150 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} />
                    <span>{item.name}</span>
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* User Footer & Theme Toggle */}
        <div className="p-4 border-t border-slate-300/60 dark:border-slate-800 space-y-3">
          {/* Theme Toggler Button */}
          <button 
            onClick={toggleTheme}
            className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl font-bold text-sm skeuo-btn-secondary"
          >
            <span>Appearance</span>
            {darkMode ? <Sun size={17} className="text-amber-400" /> : <Moon size={17} className="text-slate-700" />}
          </button>

          {/* User Profile Card */}
          <div className="p-3 rounded-xl skeuo-inset flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 text-white font-extrabold text-sm flex items-center justify-center border border-emerald-600 shadow-[0_2px_4px_rgba(0,0,0,0.15)]">
              {user?.name ? user.name[0].toUpperCase() : 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-extrabold truncate leading-none mb-1 text-slate-900 dark:text-white">{user?.name || 'User'}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate leading-none">{user?.email || 'user@example.com'}</p>
            </div>
            <button 
              onClick={handleLogout}
              className="p-2 rounded-lg text-rose-500 hover:bg-rose-500/10 transition-colors"
              title="Logout"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Main Section */}
      <div className="flex-1 flex flex-col min-w-0 relative z-10">
        <header className={`lg:hidden flex items-center justify-between px-6 py-4 border-b z-30 sticky top-0 transition-colors duration-300 ${
          darkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-[#EAEFF5]/90 border-slate-300'
        } backdrop-blur-xl shadow-md`}>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setMobileOpen(true)}
              className="p-2 rounded-xl skeuo-btn-secondary"
            >
              <Menu size={18} />
            </button>
            <h2 className="font-extrabold text-base">{currentPathName}</h2>
          </div>
          
          <button 
            onClick={toggleTheme}
            className="p-2 rounded-xl skeuo-btn-secondary"
          >
            {darkMode ? <Sun size={18} className="text-amber-400" /> : <Moon size={18} />}
          </button>
        </header>

        {/* Mobile Sidebar Modal */}
        <AnimatePresence>
          {mobileOpen && (
            <>
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setMobileOpen(false)}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
              />

              <motion.aside 
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 220 }}
                className={`fixed inset-y-0 left-0 w-72 flex flex-col z-50 shadow-2xl lg:hidden ${
                  darkMode ? 'bg-slate-900 border-r border-slate-800 text-slate-100' : 'bg-[#EAEFF5] border-r border-slate-300 text-slate-900'
                }`}
              >
                <div className="p-6 flex items-center justify-between border-b border-slate-300 dark:border-slate-800">
                  <div className="flex items-center gap-3">
                    <TrackBiteLogo size={28} />
                    <h1 className="font-extrabold text-sm tracking-tight">TRACKBITE</h1>
                  </div>
                  <button 
                    onClick={() => setMobileOpen(false)}
                    className="p-1.5 rounded-lg skeuo-btn-secondary"
                  >
                    <X size={18} />
                  </button>
                </div>

                <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                  {menuItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <NavLink
                        key={item.path}
                        to={item.path}
                        onClick={() => setMobileOpen(false)}
                        className={({ isActive }) => 
                          `flex items-center gap-3.5 px-4 py-3 rounded-xl font-bold text-sm transition-all duration-150 ${
                            isActive 
                              ? 'bg-gradient-to-b from-emerald-400 to-emerald-600 text-white shadow-md' 
                              : darkMode 
                                ? 'text-slate-400 hover:bg-slate-800' 
                                : 'text-slate-700 hover:bg-slate-200'
                          }`
                        }
                      >
                        <Icon size={18} />
                        <span>{item.name}</span>
                      </NavLink>
                    );
                  })}
                </nav>

                <div className="p-4 border-t border-slate-300 dark:border-slate-800">
                  <div className="p-3 rounded-xl skeuo-inset flex items-center gap-3">
                    <div className="h-9 w-9 rounded-xl bg-emerald-500 text-white font-extrabold flex items-center justify-center">
                      {user?.name ? user.name[0].toUpperCase() : 'U'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold truncate mb-1">{user?.name || 'User'}</p>
                      <p className="text-xs text-slate-500 truncate">{user?.email || 'user@example.com'}</p>
                    </div>
                    <button 
                      onClick={handleLogout}
                      className="p-2 rounded-lg text-rose-500"
                    >
                      <LogOut size={16} />
                    </button>
                  </div>
                </div>
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        {/* Content Body */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
