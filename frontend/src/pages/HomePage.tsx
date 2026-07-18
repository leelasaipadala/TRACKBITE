import { motion } from 'framer-motion';
import { ArrowRight, Apple, ShieldCheck, Sparkles, Utensils, Droplets, BarChart3, Sun, Moon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

const features = [
  { title: 'Personalized Nutrition', text: 'Daily calorie targets designed around your goals and activity level.', icon: Apple },
  { title: 'Smart Meal Planning', text: 'Build balanced meals for every day with effortless swaps and favorites.', icon: Utensils },
  { title: 'Hydration & Progress', text: 'Track water, milestones, and progress through elegant visual insights.', icon: Droplets },
];

const testimonials = [
  { name: 'Maya Chen', quote: 'The planner feels premium, intuitive, and genuinely helped me stay consistent.' },
  { name: 'Jordan Rivera', quote: 'I love the weekly plan and smart grocery generation. It saves me so much time.' },
];

const faqs = [
  { q: 'Is it suitable for beginners?', a: 'Yes. The interface is designed to be simple while still supporting advanced nutrition planning.' },
  { q: 'Can I manage my own meals?', a: 'Absolutely. You can save favorites, replace meals, and build a customized weekly plan.' },
];

export default function HomePage() {
  const { theme, toggleTheme } = useTheme();
  const darkMode = theme === 'dark';

  return (
    <div className="min-h-screen relative overflow-hidden bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors duration-300">
      {/* Animated Background Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-emerald-500/10 dark:bg-emerald-500/5 blur-[120px] animate-blob-1" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-500/10 dark:bg-blue-500/5 blur-[120px] animate-blob-2" />
        <div className="absolute top-[30%] right-[20%] w-[35%] h-[35%] rounded-full bg-lime-500/10 dark:bg-lime-500/5 blur-[100px] animate-blob-1" style={{ animationDelay: '-4s' }} />
      </div>

      <header className="sticky top-0 z-20 border-b border-emerald-100/70 dark:border-slate-800/40 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl relative z-10">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
          <div className="flex items-center gap-2 text-lg font-semibold text-emerald-700 dark:text-emerald-400"><Sparkles size={20} /> NutriVibe Diet Planner</div>
          <nav className="hidden gap-6 text-sm font-medium text-slate-600 dark:text-slate-300 md:flex">
            <a href="#features" className="hover:text-emerald-600 dark:hover:text-emerald-400">Features</a>
            <a href="#faq" className="hover:text-emerald-600 dark:hover:text-emerald-400">FAQ</a>
            <a href="#about" className="hover:text-emerald-600 dark:hover:text-emerald-400">About</a>
          </nav>
          <div className="flex items-center gap-3">
            {/* Theme switcher */}
            <button 
              onClick={toggleTheme}
              className="p-2 rounded-full border border-emerald-200 dark:border-slate-800 hover:bg-emerald-50 dark:hover:bg-slate-900 transition text-emerald-700 dark:text-amber-400 cursor-pointer mr-1"
              title="Toggle Theme"
            >
              {darkMode ? <Sun size={16} /> : <Moon size={16} />}
            </button>
            <Link to="/login" className="rounded-full border border-emerald-200 dark:border-slate-800 px-4 py-2 text-sm font-semibold text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-slate-900 transition">Login</Link>
            <Link to="/register" className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-emerald-200 dark:shadow-none hover:scale-[1.03] transition">Get Started</Link>
          </div>
        </div>
      </header>

      <main className="relative z-10">
        <section className="mx-auto grid max-w-7xl gap-10 px-6 py-20 lg:grid-cols-[1.1fr_0.9fr] lg:px-8 lg:py-28">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }} className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 dark:border-slate-850 bg-white/80 dark:bg-slate-900/80 px-3 py-1 text-sm font-medium text-emerald-700 dark:text-emerald-400 shadow-sm">
              <ShieldCheck size={16} /> Premium wellness planning for modern lifestyles
            </div>
            <h1 className="text-4xl font-semibold leading-tight text-slate-900 dark:text-white sm:text-5xl lg:text-6xl">
              Transform your routine with intelligent nutrition guidance.
            </h1>
            <p className="max-w-xl text-lg text-slate-600 dark:text-slate-350">
              Build a diet plan that fits your body, your goals, and your schedule with beautiful dashboards and smart recommendations.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/register" className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-6 py-3 font-semibold text-white shadow-lg shadow-emerald-200 transition hover:scale-[1.02]">Start Free <ArrowRight size={18} /></Link>
              <Link to="/dashboard" className="rounded-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-6 py-3 font-semibold text-slate-700 dark:text-slate-300 shadow-sm hover:scale-[1.02] transition">Explore Dashboard</Link>
            </div>
            <div className="flex gap-5 pt-3 text-sm text-slate-700 dark:text-slate-400">
              <div><span className="font-semibold text-slate-900 dark:text-white">12k+</span> active users</div>
              <div><span className="font-semibold text-slate-900 dark:text-white">97%</span> satisfaction</div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }} className="rounded-[2rem] border border-white/70 dark:border-slate-800/40 bg-white/70 dark:bg-slate-900/60 p-6 shadow-[0_30px_80px_-20px_rgba(16,185,129,0.25)] dark:shadow-none backdrop-blur-xl">
            <div className="rounded-[1.5rem] border border-emerald-100/10 bg-gradient-to-br from-emerald-600 via-emerald-500 to-emerald-400 dark:from-emerald-700 dark:to-emerald-550 p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-emerald-100">Today’s snapshot</p>
                  <h2 className="mt-2 text-3xl font-semibold">2,150 kcal</h2>
                </div>
                <div className="rounded-2xl bg-white/20 p-3"><BarChart3 size={24} /></div>
              </div>
              <div className="mt-8 grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl bg-white/15 p-3">Protein 145g</div>
                <div className="rounded-2xl bg-white/15 p-3">Carbs 220g</div>
                <div className="rounded-2xl bg-white/15 p-3">Fat 63g</div>
              </div>
            </div>
          </motion.div>
        </section>

        <section id="features" className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
          <div className="mb-10 flex items-end justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-600 dark:text-emerald-400">Features</p>
              <h2 className="mt-2 text-3xl font-semibold text-slate-900 dark:text-white">Everything you need to eat better, feel better.</h2>
            </div>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return <motion.div key={feature.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }} className="rounded-[1.5rem] border border-emerald-100/10 dark:border-slate-800/40 bg-white dark:bg-slate-900/40 p-6 shadow-sm card-hover-lift">
                <div className="mb-4 inline-flex rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 p-3 text-emerald-600 dark:text-emerald-400"><Icon size={20} /></div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white">{feature.title}</h3>
                <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-350">{feature.text}</p>
              </motion.div>;
            })}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
          <div className="rounded-[2rem] border border-emerald-100/10 dark:border-slate-800/40 bg-white/80 dark:bg-slate-900/40 p-8 shadow-sm backdrop-blur-xl">
            <div className="grid gap-10 lg:grid-cols-2">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-600 dark:text-emerald-400">Why choose us</p>
                <h2 className="mt-2 text-3xl font-semibold text-slate-900 dark:text-white">Designed for consistency, not complexity.</h2>
                <p className="mt-4 text-slate-600 dark:text-slate-350">From daily goals to weekly food planning, every section is built to help you stay on track without friction.</p>
              </div>
              <div className="grid gap-4">
                {['Adaptive calorie targets', 'Beautiful daily and weekly insights', 'Personalized meal and grocery planning'].map((item) => (
                  <div key={item} className="rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 p-4 text-sm font-medium text-emerald-700 dark:text-emerald-400 border border-emerald-100/10">{item}</div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
          <div className="grid gap-6 lg:grid-cols-2">
            {testimonials.map((item) => (
              <div key={item.name} className="rounded-[1.5rem] border border-slate-200 dark:border-slate-800/40 bg-white dark:bg-slate-900/40 p-6 shadow-sm card-hover-lift">
                <p className="text-slate-600 dark:text-slate-350">“{item.quote}”</p>
                <div className="mt-4 font-semibold text-slate-900 dark:text-white">{item.name}</div>
              </div>
            ))}
          </div>
        </section>

        <section id="faq" className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
          <div className="rounded-[2rem] border border-emerald-100/10 dark:border-slate-800/40 bg-gradient-to-br from-emerald-50/30 to-white/10 dark:from-emerald-950/20 dark:to-slate-900/10 p-8 shadow-sm backdrop-blur-xl">
            <h2 className="text-3xl font-semibold text-slate-900 dark:text-white">Frequently asked questions</h2>
            <div className="mt-8 grid gap-4">
              {faqs.map((faq) => (
                <div key={faq.q} className="rounded-2xl border border-emerald-100/10 dark:border-slate-800/40 bg-white dark:bg-slate-900/60 p-4 shadow-sm">
                  <div className="font-semibold text-slate-900 dark:text-white">{faq.q}</div>
                  <div className="mt-2 text-sm text-slate-600 dark:text-slate-350">{faq.a}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-emerald-100/40 dark:border-slate-800/40 bg-white/70 dark:bg-slate-900/70 px-6 py-8 text-sm text-slate-600 dark:text-slate-400 backdrop-blur-xl relative z-10">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>© 2026 NutriVibe</div>
          <div className="flex gap-4">
            <a href="#features" className="hover:text-emerald-600 dark:hover:text-emerald-400">Features</a>
            <a href="#faq" className="hover:text-emerald-600 dark:hover:text-emerald-400">FAQ</a>
            <a href="/login" className="hover:text-emerald-600 dark:hover:text-emerald-400">Login</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
