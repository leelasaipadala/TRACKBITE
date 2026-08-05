import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowRight, 
  ShieldCheck, 
  Utensils, 
  Droplets, 
  BarChart3, 
  Sparkles,
  Zap,
  Lock,
  Smartphone,
  Target,
  Brain,
  Star,
  ChevronDown,
  Activity,
  Flame,
  Scale,
  CheckCircle2,
  Mail,
  PieChart as PieChartIcon,
  Play
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import TrackBiteLogo from '../components/TrackBiteLogo';

function GithubIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  );
}

function LinkedinIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

export default function HomePage() {
  const { enterDemoMode } = useAuth();
  const navigate = useNavigate();
  const [activeShowcaseTab, setActiveShowcaseTab] = useState<
    'Dashboard' | 'Profile' | 'Nutrition' | 'Meal Logger' | 'Reports' | 'Water' | 'AI Coach'
  >('Dashboard');
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const handleStartDemo = () => {
    enterDemoMode();
    navigate('/dashboard');
  };

  const showcaseTabs = [
    'Dashboard',
    'Profile',
    'Nutrition',
    'Meal Logger',
    'Reports',
    'Water',
    'AI Coach',
  ] as const;

  const features = [
    {
      title: 'Meal Tracking',
      text: 'Effortlessly log breakfast, lunch, dinner, and snacks with detailed calorie & macronutrient breakdowns.',
      icon: Utensils,
      color: 'from-emerald-500 to-teal-500',
    },
    {
      title: 'Nutrition Analytics',
      text: 'Visualize protein, carbs, fats, fiber, and micronutrients with sleek interactive charts and weekly trends.',
      icon: PieChartIcon,
      color: 'from-teal-500 to-cyan-500',
    },
    {
      title: 'Water Tracking',
      text: 'Maintain optimal hydration levels with customizable cup logging, intake goals, and reminder alerts.',
      icon: Droplets,
      color: 'from-blue-500 to-emerald-500',
    },
    {
      title: 'Progress Reports',
      text: 'Track body weight trends, Navy body fat calculations, waist measurements, and lean body mass growth.',
      icon: BarChart3,
      color: 'from-emerald-400 to-emerald-600',
    },
    {
      title: 'Goal Management',
      text: 'Set adaptive health targets based on your BMR, TDEE, activity level, and weight transformation goals.',
      icon: Target,
      color: 'from-emerald-500 to-lime-500',
    },
    {
      title: 'AI Coach',
      text: 'Receive instant intelligent nutrition advice, macro optimization tips, and personalized meal adjustments.',
      icon: Brain,
      color: 'from-teal-400 to-emerald-500',
    },
  ];

  const statistics = [
    { value: '100+', label: 'Healthy Meals Database', icon: Utensils },
    { value: '20+', label: 'Health & Macro Metrics', icon: Activity },
    { value: '100%', label: 'Responsive Design', icon: Smartphone },
    { value: 'AI', label: 'Intelligent Coaching', icon: Brain },
    { value: 'Fast', label: 'Real-time Calculations', icon: Zap },
    { value: 'Secure', label: 'JWT & Data Protection', icon: Lock },
  ];

  const timelineSteps = [
    {
      step: '01',
      title: 'Create Account',
      desc: 'Sign up in seconds or launch instant Demo Mode to explore read-only.',
    },
    {
      step: '02',
      title: 'Complete Health Profile',
      desc: 'Input your height, weight, age, activity level, and fitness objectives.',
    },
    {
      step: '03',
      title: 'Receive Personalized Goals',
      desc: 'Our engine computes your exact BMR, TDEE, and optimal macro distribution.',
    },
    {
      step: '04',
      title: 'Track Meals & Hydration',
      desc: 'Log food entries and water intake effortlessly using rich starter databases.',
    },
    {
      step: '05',
      title: 'Monitor Progress',
      desc: 'Review weekly weight logs, Navy body fat calculations, and performance metrics.',
    },
    {
      step: '06',
      title: 'Achieve Healthy Lifestyle',
      desc: 'Build lasting healthy habits guided by intelligent AI recommendations.',
    },
  ];

  const whyPillars = [
    { title: 'Lightning Fast', desc: 'Instant page transitions and zero-lag meal logging.', icon: Zap },
    { title: 'AI Powered', desc: 'Smart algorithms that adapt macronutrients to your daily progress.', icon: Brain },
    { title: '100% Responsive', desc: 'Flawlessly optimized for Desktop, Laptop, Tablet, and Mobile.', icon: Smartphone },
    { title: 'Bank-Grade Security', desc: 'JWT token authentication & encrypted MongoDB storage.', icon: Lock },
    { title: 'Modern Dark UI', desc: 'Glassmorphism aesthetic built for premium user engagement.', icon: Sparkles },
    { title: 'Science-Backed Math', desc: 'Proven Mifflin-St Jeor & US Navy circumference formulas.', icon: Scale },
  ];

  const testimonials = [
    {
      name: 'Sarah Jenkins',
      role: 'Fitness Enthusiast',
      stars: 5,
      quote: 'TrackBite feels like a premium startup application. The macro breakdowns and AI recommendations completely transformed my nutrition consistency!',
    },
    {
      name: 'Marcus Chen',
      role: 'Software Engineer',
      stars: 5,
      quote: 'The dark theme glassmorphism UI is absolutely stunning. Being able to try Demo Mode before registering made me an instant fan!',
    },
    {
      name: 'Elena Rostova',
      role: 'Nutrition Specialist',
      stars: 5,
      quote: 'Extremely well architected! The water tracker, BMR/TDEE calculations, and progress reports give complete clarity on health goals.',
    },
  ];

  const faqs = [
    {
      q: 'Can I test TrackBite without creating an account?',
      a: 'Yes! Simply click "Try Demo" to explore every page and feature in read-only mode with pre-filled sample data. No registration or credit card required.',
    },
    {
      q: 'How does TrackBite calculate my daily calorie targets?',
      a: 'We use the Mifflin-St Jeor formula to compute your Basal Metabolic Rate (BMR), adjusted for your activity multiplier and primary goal (Weight Loss, Maintenance, or Muscle Gain).',
    },
    {
      q: 'Is my data secure?',
      a: 'Security is paramount. TrackBite utilizes JWT (JSON Web Token) authentication with password hashing and isolated user databases.',
    },
    {
      q: 'How does the AI Coach work?',
      a: 'The AI Coach analyzes your current day calorie deficit, macronutrient ratio, hydration levels, and exercise output to provide personalized suggestions.',
    },
    {
      q: 'Is TrackBite mobile friendly?',
      a: 'TrackBite is 100% responsive and optimized across mobile phones, tablets, laptops, and ultra-wide desktop screens.',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-emerald-500 selection:text-slate-950 relative overflow-x-hidden">
      {/* Background Lighting & Glow Effects */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-[20%] -left-[10%] w-[55vw] h-[55vw] rounded-full bg-emerald-500/10 blur-[140px] animate-pulse" />
        <div className="absolute top-[40%] -right-[15%] w-[50vw] h-[50vw] rounded-full bg-teal-500/10 blur-[160px]" />
        <div className="absolute -bottom-[20%] left-[20%] w-[60vw] h-[60vw] rounded-full bg-emerald-600/5 blur-[180px]" />
        <div 
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: `
              linear-gradient(to right, #ffffff 1px, transparent 1px),
              linear-gradient(to bottom, #ffffff 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      {/* SECTION 1: Sticky Glass Navbar */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-slate-950/80 border-b border-slate-800/80 transition-all duration-300">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="p-2 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-slate-950 shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-transform duration-300 group-hover:scale-105">
              <TrackBiteLogo size={24} />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-black tracking-tight text-white flex items-center gap-1.5">
                TRACKBITE <span className="text-emerald-400 font-extrabold text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30">AI</span>
              </span>
            </div>
          </Link>

          <nav className="hidden items-center gap-8 text-sm font-medium text-slate-300 lg:flex">
            <a href="#home" className="hover:text-emerald-400 transition-colors">Home</a>
            <a href="#features" className="hover:text-emerald-400 transition-colors">Features</a>
            <a href="#showcase" className="hover:text-emerald-400 transition-colors">Dashboard</a>
            <a href="#how-it-works" className="hover:text-emerald-400 transition-colors">How It Works</a>
            <a href="#why-us" className="hover:text-emerald-400 transition-colors">Why Us</a>
            <a href="#faq" className="hover:text-emerald-400 transition-colors">FAQ</a>
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={handleStartDemo}
              className="px-4 py-2 text-sm font-semibold rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20 transition flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <Play size={14} className="fill-emerald-400" />
              <span>Try Demo</span>
            </button>

            <Link
              to="/login"
              className="px-4 py-2 text-sm font-semibold text-slate-300 hover:text-white transition hidden sm:inline-block"
            >
              Login
            </Link>

            <Link
              to="/register"
              className="px-5 py-2 text-sm font-bold rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-[0_0_20px_rgba(16,185,129,0.4)] hover:shadow-[0_0_30px_rgba(16,185,129,0.6)] hover:scale-[1.03] active:scale-[0.98] transition duration-200"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* SECTION 2: Hero Section */}
      <section id="home" className="relative z-10 mx-auto max-w-7xl px-6 pt-16 pb-24 lg:px-8 lg:pt-24 lg:pb-32">
        <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
          {/* Left Column Copy */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-6 space-y-6"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-xs font-bold text-emerald-400 backdrop-blur-md shadow-[0_0_15px_rgba(16,185,129,0.15)]">
              <Sparkles size={14} className="text-emerald-400" />
              <span>✨ AI Powered Nutrition Platform</span>
            </div>

            <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl leading-[1.1]">
              TRACKBITE AI <br />
              <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-500 bg-clip-text text-transparent">
                Smarter Nutrition. Healthier Lifestyle.
              </span>
            </h1>

            <p className="text-lg text-slate-350 leading-relaxed max-w-xl">
              Track your meals. Monitor calories. Analyze health. Build healthy habits. Receive intelligent nutrition insights. All inside one modern platform.
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <Link
                to="/register"
                className="px-7 py-3.5 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-extrabold text-base shadow-[0_0_25px_rgba(16,185,129,0.4)] hover:shadow-[0_0_35px_rgba(16,185,129,0.7)] hover:scale-[1.03] transition flex items-center gap-2"
              >
                <span>Get Started</span>
                <ArrowRight size={18} />
              </Link>

              <button
                onClick={handleStartDemo}
                className="px-7 py-3.5 rounded-full bg-slate-900 border border-slate-700/80 text-white font-bold text-base hover:bg-slate-850 hover:border-emerald-500/50 transition flex items-center gap-2 cursor-pointer shadow-lg group"
              >
                <Play size={16} className="text-emerald-400 fill-emerald-400 group-hover:scale-110 transition-transform" />
                <span>Try Demo</span>
              </button>
            </div>

            <div className="flex items-center gap-6 pt-4 text-xs sm:text-sm text-slate-400 border-t border-slate-800/80">
              <div className="flex items-center gap-2">
                <ShieldCheck size={18} className="text-emerald-400" />
                <span>No Credit Card Required</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 size={18} className="text-emerald-400" />
                <span>Instant Demo Access</span>
              </div>
            </div>
          </motion.div>

          {/* Right Column Real Dashboard Visual Mockup with Floating Micro Cards */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="lg:col-span-6 relative"
          >
            <div className="relative rounded-3xl border border-slate-800/80 bg-slate-900/80 p-5 shadow-[0_0_50px_rgba(0,0,0,0.8),0_0_30px_rgba(16,185,129,0.15)] backdrop-blur-2xl overflow-hidden group">
              {/* App Top Window Bar */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                  <span className="text-xs text-slate-400 font-mono ml-2">trackbite.io/dashboard</span>
                </div>
                <div className="text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                  LIVE DEMO PREVIEW
                </div>
              </div>

              {/* Real Dashboard Mockup Content */}
              <div className="space-y-4 text-xs">
                {/* Summary Header */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800/80">
                    <p className="text-slate-400 font-medium">Daily Target</p>
                    <p className="text-lg font-black text-white mt-1">2,150 <span className="text-xs font-normal text-slate-400">kcal</span></p>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800/80">
                    <p className="text-slate-400 font-medium">Consumed</p>
                    <p className="text-lg font-black text-emerald-400 mt-1">1,860 <span className="text-xs font-normal text-slate-400">kcal</span></p>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800/80">
                    <p className="text-slate-400 font-medium">Remaining</p>
                    <p className="text-lg font-black text-teal-300 mt-1">290 <span className="text-xs font-normal text-slate-400">kcal</span></p>
                  </div>
                </div>

                {/* Macro Progress Bars */}
                <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80 space-y-3">
                  <div className="flex justify-between font-semibold">
                    <span className="text-slate-300">Macro Breakdown</span>
                    <span className="text-emerald-400">86% Goal Met</span>
                  </div>
                  
                  <div className="space-y-2">
                    <div>
                      <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                        <span>Protein (145g goal)</span>
                        <span className="text-white font-bold">140g</span>
                      </div>
                      <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full" style={{ width: '96%' }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                        <span>Carbs (220g goal)</span>
                        <span className="text-white font-bold">144g</span>
                      </div>
                      <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-teal-400 to-cyan-400 rounded-full" style={{ width: '65%' }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                        <span>Fats (63g goal)</span>
                        <span className="text-white font-bold">57g</span>
                      </div>
                      <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-amber-400 to-emerald-500 rounded-full" style={{ width: '90%' }} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Animated Cards Around Dashboard */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute -top-4 -right-4 p-3 rounded-2xl bg-slate-900/90 border border-emerald-500/40 shadow-2xl backdrop-blur-xl flex items-center gap-2.5"
              >
                <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
                  <Flame size={18} />
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase">Calories</p>
                  <p className="text-xs font-black text-white">2,150 kcal</p>
                </div>
              </motion.div>

              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                className="absolute top-1/2 -left-6 p-3 rounded-2xl bg-slate-900/90 border border-teal-500/40 shadow-2xl backdrop-blur-xl flex items-center gap-2.5"
              >
                <div className="p-2 rounded-xl bg-teal-500/20 text-teal-400">
                  <Activity size={18} />
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase">Protein</p>
                  <p className="text-xs font-black text-white">145g Target</p>
                </div>
              </motion.div>

              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 3.8, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
                className="absolute -bottom-4 left-1/3 p-3 rounded-2xl bg-slate-900/90 border border-blue-500/40 shadow-2xl backdrop-blur-xl flex items-center gap-2.5"
              >
                <div className="p-2 rounded-xl bg-blue-500/20 text-blue-400">
                  <Droplets size={18} />
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase">Hydration</p>
                  <p className="text-xs font-black text-white">2.4L / 2.5L</p>
                </div>
              </motion.div>

              <motion.div
                animate={{ scale: [1, 1.03, 1] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
                className="absolute top-1/3 -right-6 p-3 rounded-2xl bg-slate-900/90 border border-emerald-400/40 shadow-2xl backdrop-blur-xl flex items-center gap-2.5"
              >
                <div className="p-2 rounded-xl bg-emerald-400/20 text-emerald-300">
                  <Brain size={18} />
                </div>
                <div>
                  <p className="text-[10px] text-emerald-400 font-bold uppercase">AI Coach</p>
                  <p className="text-xs font-bold text-slate-200">Optimal Macro Balance!</p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FEATURE 3: Statistics Section */}
      <section className="relative z-10 border-y border-slate-800/80 bg-slate-900/40 py-16 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-3 lg:grid-cols-6">
            {statistics.map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.08 }}
                  className="flex flex-col items-center text-center p-4 rounded-2xl bg-slate-900/60 border border-slate-800/60 hover:border-emerald-500/40 transition group"
                >
                  <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 mb-2 group-hover:scale-110 transition-transform">
                    <Icon size={20} />
                  </div>
                  <span className="text-3xl font-black text-white tracking-tight">{stat.value}</span>
                  <span className="text-xs font-semibold text-slate-400 mt-1">{stat.label}</span>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FEATURE 4: Premium Features Grid */}
      <section id="features" className="relative z-10 mx-auto max-w-7xl px-6 py-24 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-400 bg-emerald-500/10 px-3.5 py-1 rounded-full border border-emerald-500/30">
            Platform Capabilities
          </span>
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            Everything you need for total nutritional mastery.
          </h2>
          <p className="text-slate-400 text-base">
            Engineered with modern glassmorphism UI, science-backed formulas, and intelligent AI coaching.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="relative rounded-3xl border border-slate-800 bg-slate-900/60 p-8 shadow-xl hover:border-emerald-500/50 transition-all duration-300 hover:-translate-y-1.5 group overflow-hidden"
              >
                <div className={`mb-6 inline-flex rounded-2xl bg-gradient-to-br ${feature.color} p-3.5 text-slate-950 shadow-lg group-hover:scale-110 transition-transform`}>
                  <Icon size={24} />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{feature.text}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* FEATURE 5: How It Works Timeline */}
      <section id="how-it-works" className="relative z-10 border-t border-slate-800/80 bg-slate-900/30 py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-400 bg-emerald-500/10 px-3.5 py-1 rounded-full border border-emerald-500/30">
              Simple Workflow
            </span>
            <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
              How TrackBite Transforms Your Health
            </h2>
            <p className="text-slate-400 text-base">
              From initial assessment to long-term habits in 6 seamless steps.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {timelineSteps.map((step, idx) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.08 }}
                className="p-6 rounded-3xl border border-slate-800 bg-slate-900/80 relative space-y-3 hover:border-emerald-500/40 transition"
              >
                <span className="text-3xl font-black text-emerald-400/30">{step.step}</span>
                <h3 className="text-lg font-bold text-white">{step.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURE 6: Interactive Dashboard Showcase */}
      <section id="showcase" className="relative z-10 mx-auto max-w-7xl px-6 py-24 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
          <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-400 bg-emerald-500/10 px-3.5 py-1 rounded-full border border-emerald-500/30">
            Interactive Product Preview
          </span>
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            Explore Every Angle of TrackBite
          </h2>
          <p className="text-slate-400 text-base">
            Click through the tabs below to preview the authentic live views inside our SaaS platform.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {showcaseTabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveShowcaseTab(tab)}
              className={`px-5 py-2.5 rounded-full text-xs font-extrabold transition-all cursor-pointer ${
                activeShowcaseTab === tab
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-[0_0_20px_rgba(16,185,129,0.4)] scale-105'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Display Area */}
        <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-8 shadow-2xl backdrop-blur-2xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeShowcaseTab}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              {activeShowcaseTab === 'Dashboard' && (
                <div className="space-y-6 text-sm">
                  <div className="flex justify-between items-center pb-4 border-b border-slate-800">
                    <div>
                      <h3 className="text-xl font-bold text-white">Daily Dashboard Overview</h3>
                      <p className="text-xs text-slate-400">Calorie budget, macronutrient progress, and daily consistency score.</p>
                    </div>
                    <button onClick={handleStartDemo} className="px-4 py-1.5 rounded-full bg-emerald-500 text-slate-950 text-xs font-bold hover:scale-105 transition cursor-pointer">
                      Launch Demo Mode
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-center">
                      <p className="text-xs text-slate-400">Calories Goal</p>
                      <p className="text-2xl font-extrabold text-emerald-400 mt-1">2,150 kcal</p>
                    </div>
                    <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-center">
                      <p className="text-xs text-slate-400">Protein Target</p>
                      <p className="text-2xl font-extrabold text-teal-300 mt-1">145 g</p>
                    </div>
                    <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-center">
                      <p className="text-xs text-slate-400">Water Logged</p>
                      <p className="text-2xl font-extrabold text-blue-400 mt-1">2,250 ml</p>
                    </div>
                    <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-center">
                      <p className="text-xs text-slate-400">Consistency Score</p>
                      <p className="text-2xl font-extrabold text-emerald-400 mt-1">94% Excellent</p>
                    </div>
                  </div>
                </div>
              )}

              {activeShowcaseTab === 'Profile' && (
                <div className="space-y-6 text-sm">
                  <div className="flex justify-between items-center pb-4 border-b border-slate-800">
                    <div>
                      <h3 className="text-xl font-bold text-white">User Health & Biometric Profile</h3>
                      <p className="text-xs text-slate-400">Age, body weight, Navy body fat calculations, and target weights.</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                      <p className="text-xs text-slate-400">Current Weight</p>
                      <p className="text-xl font-bold text-white mt-1">68.0 kg</p>
                    </div>
                    <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                      <p className="text-xs text-slate-400">Goal Weight</p>
                      <p className="text-xl font-bold text-emerald-400 mt-1">62.0 kg</p>
                    </div>
                    <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                      <p className="text-xs text-slate-400">Navy Body Fat %</p>
                      <p className="text-xl font-bold text-teal-300 mt-1">21.5%</p>
                    </div>
                    <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                      <p className="text-xs text-slate-400">Lean Body Mass</p>
                      <p className="text-xl font-bold text-white mt-1">53.4 kg</p>
                    </div>
                  </div>
                </div>
              )}

              {activeShowcaseTab === 'Nutrition' && (
                <div className="space-y-6 text-sm">
                  <div className="flex justify-between items-center pb-4 border-b border-slate-800">
                    <div>
                      <h3 className="text-xl font-bold text-white">Macronutrient & Micronutrient Analysis</h3>
                      <p className="text-xs text-slate-400">Comprehensive breakdown of Fiber, Sodium, Potassium, Calcium, Iron & Vitamins.</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                      <p className="text-xs text-slate-400">Dietary Fiber</p>
                      <p className="text-lg font-bold text-white mt-1">24g / 30g goal</p>
                    </div>
                    <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                      <p className="text-xs text-slate-400">Calcium</p>
                      <p className="text-lg font-bold text-white mt-1">710 mg</p>
                    </div>
                    <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                      <p className="text-xs text-slate-400">Vitamin C</p>
                      <p className="text-lg font-bold text-white mt-1">74 mg (100%)</p>
                    </div>
                  </div>
                </div>
              )}

              {activeShowcaseTab === 'Meal Logger' && (
                <div className="space-y-6 text-sm">
                  <div className="flex justify-between items-center pb-4 border-b border-slate-800">
                    <div>
                      <h3 className="text-xl font-bold text-white">Smart Meal Logger</h3>
                      <p className="text-xs text-slate-400">Log Breakfast, Lunch, Evening Snack, Dinner, and Post Workout meals.</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    {[
                      { meal: 'Breakfast', food: 'Oats with Berries & Protein', cal: '450 kcal', p: '32g P' },
                      { meal: 'Lunch', food: 'Grilled Chicken Quinoa Bowl', cal: '580 kcal', p: '48g P' },
                      { meal: 'Evening Snack', food: 'Greek Yogurt & Almonds', cal: '220 kcal', p: '18g P' },
                      { meal: 'Dinner', food: 'Salmon with Roasted Vegetables', cal: '610 kcal', p: '42g P' },
                    ].map((m) => (
                      <div key={m.meal} className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex justify-between items-center">
                        <div>
                          <span className="text-xs font-bold text-emerald-400">{m.meal}: </span>
                          <span className="text-white font-medium">{m.food}</span>
                        </div>
                        <div className="text-xs font-mono text-slate-300">
                          {m.cal} | <span className="text-teal-300 font-bold">{m.p}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeShowcaseTab === 'Reports' && (
                <div className="space-y-6 text-sm">
                  <div className="flex justify-between items-center pb-4 border-b border-slate-800">
                    <div>
                      <h3 className="text-xl font-bold text-white">Reports & Progress Tracking</h3>
                      <p className="text-xs text-slate-400">Weekly weight loss trend, streak counts, and milestone badges.</p>
                    </div>
                  </div>
                  <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 flex justify-between items-center">
                    <div>
                      <p className="text-xs text-slate-400">Current Logging Streak</p>
                      <p className="text-2xl font-black text-emerald-400 mt-1">🔥 14 Days Active</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-slate-400">Total Weight Loss</p>
                      <p className="text-2xl font-black text-teal-300 mt-1">-4.5 kg Achieved</p>
                    </div>
                  </div>
                </div>
              )}

              {activeShowcaseTab === 'Water' && (
                <div className="space-y-6 text-sm">
                  <div className="flex justify-between items-center pb-4 border-b border-slate-800">
                    <div>
                      <h3 className="text-xl font-bold text-white">Water & Hydration Tracker</h3>
                      <p className="text-xs text-slate-400">Track daily hydration targets, quick cup additions, and water balance.</p>
                    </div>
                  </div>
                  <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 text-center space-y-3">
                    <p className="text-xs text-slate-400">Hydration Progress</p>
                    <p className="text-3xl font-black text-blue-400">2,250 ml / 2,500 ml</p>
                    <p className="text-xs text-emerald-400 font-bold">90% Daily Target Reached (9 Cups)</p>
                  </div>
                </div>
              )}

              {activeShowcaseTab === 'AI Coach' && (
                <div className="space-y-6 text-sm">
                  <div className="flex justify-between items-center pb-4 border-b border-slate-800">
                    <div>
                      <h3 className="text-xl font-bold text-white">AI Assistant & Nutrition Coach</h3>
                      <p className="text-xs text-slate-400">Real-time macro guidance and automated health advice.</p>
                    </div>
                  </div>
                  <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                    <div className="flex items-center gap-2 text-emerald-400 font-bold">
                      <Brain size={18} />
                      <span>AI Insights Recommendation:</span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      "Great job reaching 140g protein today! To finish your daily calorie budget, consider adding 150ml of almond milk or a small apple."
                    </p>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* FEATURE 7: Why TrackBite */}
      <section id="why-us" className="relative z-10 border-t border-slate-800/80 bg-slate-900/30 py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-400 bg-emerald-500/10 px-3.5 py-1 rounded-full border border-emerald-500/30">
              Built Different
            </span>
            <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
              Why Engineers & Health Enthusiasts Choose TrackBite
            </h2>
            <p className="text-slate-400 text-base">
              Designed for consistency, not complexity.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {whyPillars.map((pillar, idx) => {
              const Icon = pillar.icon;
              return (
                <motion.div
                  key={pillar.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.08 }}
                  className="p-6 rounded-3xl border border-slate-800 bg-slate-900/70 space-y-3 hover:border-emerald-500/40 transition"
                >
                  <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-400 w-fit">
                    <Icon size={22} />
                  </div>
                  <h3 className="text-lg font-bold text-white">{pillar.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{pillar.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FEATURE 9: Testimonials */}
      <section className="relative z-10 mx-auto max-w-7xl px-6 py-24 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-400 bg-emerald-500/10 px-3.5 py-1 rounded-full border border-emerald-500/30">
            User Testimonials
          </span>
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            Loved by Health-Conscious Individuals
          </h2>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {testimonials.map((item, idx) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="p-8 rounded-3xl border border-slate-800 bg-slate-900/60 space-y-4 backdrop-blur-xl flex flex-col justify-between hover:border-emerald-500/40 transition"
            >
              <div className="flex gap-1 text-amber-400">
                {[...Array(item.stars)].map((_, i) => (
                  <Star key={i} size={16} className="fill-amber-400" />
                ))}
              </div>
              <p className="text-sm text-slate-350 leading-relaxed italic">"{item.quote}"</p>
              <div>
                <p className="text-sm font-bold text-white">{item.name}</p>
                <p className="text-xs text-emerald-400">{item.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FEATURE 10: FAQ Accordion */}
      <section id="faq" className="relative z-10 border-t border-slate-800/80 bg-slate-900/40 py-24">
        <div className="mx-auto max-w-4xl px-6 lg:px-8">
          <div className="text-center mb-16 space-y-4">
            <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-400 bg-emerald-500/10 px-3.5 py-1 rounded-full border border-emerald-500/30">
              Got Questions?
            </span>
            <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={faq.q}
                  className="rounded-2xl border border-slate-800 bg-slate-900/80 overflow-hidden transition"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full p-5 text-left flex justify-between items-center font-bold text-white text-base cursor-pointer hover:text-emerald-400 transition"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      size={20}
                      className={`text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180 text-emerald-400' : ''}`}
                    />
                  </button>
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="px-5 pb-5 text-xs text-slate-350 leading-relaxed border-t border-slate-800/50 pt-3"
                      >
                        {faq.a}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FEATURE 11: Final CTA */}
      <section className="relative z-10 mx-auto max-w-7xl px-6 py-24 lg:px-8">
        <div className="rounded-3xl border border-emerald-500/30 bg-gradient-to-br from-emerald-950/60 via-slate-900 to-teal-950/60 p-12 text-center shadow-[0_0_60px_rgba(16,185,129,0.2)] backdrop-blur-2xl space-y-8 relative overflow-hidden">
          <div className="max-w-2xl mx-auto space-y-4">
            <h2 className="text-3xl font-extrabold text-white sm:text-5xl tracking-tight">
              Ready to Start Your Healthy Journey?
            </h2>
            <p className="text-slate-350 text-base">
              Join thousands of users tracking nutrition, calories, and health metrics with TrackBite AI.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/register"
              className="px-8 py-3.5 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-extrabold text-base shadow-[0_0_30px_rgba(16,185,129,0.5)] hover:scale-105 transition"
            >
              Get Started Free
            </Link>

            <button
              onClick={handleStartDemo}
              className="px-8 py-3.5 rounded-full bg-slate-900 border border-slate-700 text-white font-bold text-base hover:bg-slate-800 transition flex items-center gap-2 cursor-pointer"
            >
              <Play size={16} className="text-emerald-400 fill-emerald-400" />
              <span>Try Demo Mode</span>
            </button>
          </div>
        </div>
      </section>

      {/* FEATURE 12: Footer */}
      <footer className="relative z-10 border-t border-slate-800/80 bg-slate-950 px-6 py-12 text-xs text-slate-400 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-2 font-bold text-white">
            <TrackBiteLogo size={20} />
            <span>TRACKBITE AI © {new Date().getFullYear()}</span>
          </div>

          <div className="flex flex-wrap gap-6 text-slate-400">
            <a href="#features" className="hover:text-emerald-400 transition">Features</a>
            <a href="#showcase" className="hover:text-emerald-400 transition">Dashboard</a>
            <a href="#faq" className="hover:text-emerald-400 transition">FAQ</a>
            <Link to="/login" className="hover:text-emerald-400 transition">Login</Link>
            <Link to="/register" className="hover:text-emerald-400 transition">Register</Link>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-emerald-400 transition p-2 bg-slate-900 rounded-full border border-slate-800">
              <GithubIcon size={16} />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="hover:text-emerald-400 transition p-2 bg-slate-900 rounded-full border border-slate-800">
              <LinkedinIcon size={16} />
            </a>
            <a href="mailto:contact@trackbite.io" className="hover:text-emerald-400 transition p-2 bg-slate-900 rounded-full border border-slate-800">
              <Mail size={16} />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
