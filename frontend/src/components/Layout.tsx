import { useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { 
  LayoutDashboard, 
  Settings, 
  User, 
  Apple, 
  Menu, 
  X, 
  LogOut, 
  Sun, 
  Moon, 
  BarChart3,
  Droplets
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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

  const currentPathName = menuItems.find(item => item.path === location.pathname)?.name || 'Smart Diet Planner';

  return (
    <div className={`min-h-screen flex transition-colors duration-300 relative overflow-hidden ${darkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-800'}`}>
      {/* Animated Floating Background Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-emerald-500/10 dark:bg-emerald-500/5 blur-[120px] animate-blob-1" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-500/10 dark:bg-blue-500/5 blur-[120px] animate-blob-2" />
        <div className="absolute top-[30%] right-[20%] w-[35%] h-[35%] rounded-full bg-lime-500/10 dark:bg-lime-500/5 blur-[100px] animate-blob-1" style={{ animationDelay: '-4s' }} />
      </div>

      {/* Desktop Sidebar */}
      <aside className={`hidden lg:flex flex-col w-72 sticky top-0 h-screen border-r transition-colors duration-300 ${
        darkMode 
          ? 'bg-slate-900/80 border-slate-800/60' 
          : 'bg-white/80 border-emerald-100/60'
      } backdrop-blur-xl z-20`}>
        <div className="p-6 flex items-center gap-3 border-b border-emerald-100/20">
          <div className="h-10 w-10 rounded-2xl bg-gradient-to-tr from-emerald-500 to-lime-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
            <Apple size={20} />
          </div>
          <div>
            <h1 className="font-semibold text-lg leading-none tracking-tight">NutriVibe</h1>
            <span className="text-xs text-emerald-500 font-medium tracking-wider uppercase">Diet Planner</span>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => 
                  `flex items-center gap-3.5 px-4 py-3 rounded-2xl font-medium transition-all duration-200 group ${
                    isActive 
                      ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20' 
                      : darkMode 
                        ? 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200' 
                        : 'text-slate-600 hover:bg-emerald-50/50 hover:text-emerald-800'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon size={18} className={`transition-transform duration-200 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} />
                    <span>{item.name}</span>
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        <div className="p-4 border-t border-emerald-100/10 space-y-3">
          {/* Theme Toggler */}
          <button 
            onClick={toggleTheme}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl font-medium transition-all duration-200 ${
              darkMode ? 'bg-slate-800/80 hover:bg-slate-800 text-slate-300' : 'bg-emerald-50 hover:bg-emerald-100/50 text-emerald-800'
            }`}
          >
            <span className="text-sm">Theme Mode</span>
            {darkMode ? <Sun size={18} className="text-amber-400" /> : <Moon size={18} className="text-emerald-700" />}
          </button>

          {/* User Info & Logout */}
          <div className={`p-3 rounded-2xl flex items-center gap-3 ${darkMode ? 'bg-slate-800/40' : 'bg-emerald-50/30'}`}>
            <div className="h-9 w-9 rounded-full bg-emerald-500 flex items-center justify-center text-white font-semibold text-sm">
              {user?.name ? user.name[0].toUpperCase() : 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate leading-none mb-1">{user?.name || 'User'}</p>
              <p className="text-xs text-[var(--text-muted)] truncate leading-none">{user?.email || 'user@example.com'}</p>
            </div>
            <button 
              onClick={handleLogout}
              className="p-2 rounded-xl text-rose-500 hover:bg-rose-500/10 transition-colors"
              title="Logout"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Header & Sidebar */}
      <div className="flex-1 flex flex-col min-w-0 relative z-10">
        <header className={`lg:hidden flex items-center justify-between px-6 py-4 border-b z-30 sticky top-0 transition-colors duration-300 ${
          darkMode ? 'bg-slate-900/90 border-slate-800/80' : 'bg-white/90 border-emerald-100/60'
        } backdrop-blur-xl`}>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setMobileOpen(true)}
              className={`p-2 rounded-xl border transition-colors ${
                darkMode ? 'border-slate-800 text-slate-300 hover:bg-slate-800' : 'border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <Menu size={18} />
            </button>
            <h2 className="font-semibold text-md">{currentPathName}</h2>
          </div>
          
          <button 
            onClick={toggleTheme}
            className={`p-2 rounded-xl border transition-colors ${
              darkMode ? 'border-slate-800 text-amber-400 hover:bg-slate-800' : 'border-slate-200 text-emerald-800 hover:bg-slate-100'
            }`}
          >
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </header>

        {/* Mobile Navigation Drawer Overlay */}
        <AnimatePresence>
          {mobileOpen && (
            <>
              {/* Backdrop */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setMobileOpen(false)}
                className="fixed inset-0 bg-black/45 backdrop-blur-sm z-40 lg:hidden"
              />

              {/* Drawer */}
              <motion.aside 
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 220 }}
                className={`fixed inset-y-0 left-0 w-72 flex flex-col z-50 shadow-2xl lg:hidden transition-colors duration-300 ${
                  darkMode ? 'bg-slate-900 border-r border-slate-800 text-slate-100' : 'bg-white border-r border-emerald-100 text-slate-800'
                }`}
              >
                <div className="p-6 flex items-center justify-between border-b border-emerald-100/10">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-lime-500 flex items-center justify-center text-white shadow-sm">
                      <Apple size={18} />
                    </div>
                    <div>
                      <h1 className="font-semibold text-sm leading-none tracking-tight">NutriVibe</h1>
                      <span className="text-[10px] text-emerald-500 font-medium uppercase tracking-wider">Planner</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => setMobileOpen(false)}
                    className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    <X size={18} />
                  </button>
                </div>

                <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
                  {menuItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <NavLink
                        key={item.path}
                        to={item.path}
                        onClick={() => setMobileOpen(false)}
                        className={({ isActive }) => 
                          `flex items-center gap-3.5 px-4 py-3 rounded-2xl font-medium transition-all duration-200 ${
                            isActive 
                              ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20' 
                              : darkMode 
                                ? 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200' 
                                : 'text-slate-600 hover:bg-emerald-50/50 hover:text-emerald-800'
                          }`
                        }
                      >
                        <Icon size={18} />
                        <span>{item.name}</span>
                      </NavLink>
                    );
                  })}
                </nav>

                <div className="p-4 border-t border-emerald-100/10 space-y-3">
                  <div className={`p-3 rounded-2xl flex items-center gap-3 ${darkMode ? 'bg-slate-800/40' : 'bg-emerald-50/30'}`}>
                    <div className="h-9 w-9 rounded-full bg-emerald-500 flex items-center justify-center text-white font-semibold text-sm">
                      {user?.name ? user.name[0].toUpperCase() : 'U'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold truncate leading-none mb-1">{user?.name || 'User'}</p>
                      <p className="text-xs text-[var(--text-muted)] truncate leading-none">{user?.email || 'user@example.com'}</p>
                    </div>
                    <button 
                      onClick={handleLogout}
                      className="p-2 rounded-xl text-rose-500 hover:bg-rose-500/10 transition-colors"
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
