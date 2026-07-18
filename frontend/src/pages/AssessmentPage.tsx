import { useMemo, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  Sparkles, 
  Activity, 
  Apple, 
  Flame, 
  CheckCircle2, 
  BookOpen, 
  Droplets, 
  Target, 
  ShieldAlert, 
  ChevronRight, 
  Heart 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useGoal } from '../context/GoalContext';
import api from '../services/api';
import { 
  calculateDietMetrics, 
  goalOptions, 
  type AssessmentData, 
  type GoalKey, 
  generateWeeklyPlan 
} from '../services/dietPlanning';

const activityLevels = ['Sedentary', 'Lightly Active', 'Moderately Active', 'Very Active', 'Athlete'];
const dietPreferences = ['Vegetarian', 'Vegan', 'Eggetarian', 'Non-Vegetarian'];
const workoutPreferences = ['Gym', 'Home Workout', 'Walking', 'Running', 'Yoga', 'No Exercise'];

export default function AssessmentPage() {
  const navigate = useNavigate();
  const { login, user } = useAuth();
  const { refreshGoal } = useGoal();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState<AssessmentData>({
    fullName: user?.name || '',
    age: 28,
    gender: 'Female',
    height: 165,
    currentWeight: 68,
    targetWeight: 60,
    activityLevel: 'Moderately Active',
    dietPreference: 'Vegetarian',
    medicalConditions: ['None'],
    allergies: ['None'],
    workoutPreference: 'Gym',
  });

  const [goal, setGoal] = useState<GoalKey>('weight loss');

  // Lifestyle targets (Step 6)
  const [morningRoutine, setMorningRoutine] = useState('Hydrate First');
  const [sleepTarget, setSleepTarget] = useState(8);
  const [stepsTarget, setStepsTarget] = useState(8000);
  const [workoutMinutesTarget, setWorkoutMinutesTarget] = useState(45);
  const [recoveryFocus, setRecoveryFocus] = useState('Stretch & Sleep');

  // Reminders (Step 8)
  const [mealReminders, setMealReminders] = useState(true);
  const [workoutReminders, setWorkoutReminders] = useState(true);

  // Allergies & Conditions state (Step 3 & 4)
  const [allergiesText, setAllergiesText] = useState('');
  const [conditionsText, setConditionsText] = useState('');

  const persistToBackend = async (currentForm: AssessmentData, currentGoal: GoalKey) => {
    try {
      const parsedAllergies = allergiesText.split(',').map(s => s.trim()).filter(Boolean);
      const parsedConditions = conditionsText.split(',').map(s => s.trim()).filter(Boolean);

      const finalForm = {
        ...currentForm,
        allergies: parsedAllergies.length ? parsedAllergies : ['None'],
        medicalConditions: parsedConditions.length ? parsedConditions : ['None'],
      };

      const computed = calculateDietMetrics(finalForm, currentGoal);

      const payload = {
        type: currentGoal,
        targetCalories: computed.dailyCalories,
        protein: computed.protein,
        carbs: computed.carbs,
        fat: computed.fat,
        waterIntake: computed.water,
        assessment: finalForm,
        metrics: computed,
        weeklyPlan: generateWeeklyPlan(finalForm, currentGoal, computed),
      };

      // 1. Save goal assessment to backend
      try {
        await api.post('/goals', payload);
      } catch (err) {
        console.warn('Backend goals API failed or not connected, skipping goal save to DB', err);
      }

      // 2. Update user profile to backend
      try {
        await api.put('/users/me', {
          name: finalForm.fullName,
          age: finalForm.age,
          gender: finalForm.gender,
          height: finalForm.height,
          weight: finalForm.currentWeight,
          goalWeight: finalForm.targetWeight,
          activityLevel: finalForm.activityLevel,
          dietPreference: finalForm.dietPreference,
          medicalConditions: finalForm.medicalConditions.join(', '),
          allergies: finalForm.allergies.join(', '),
        });
      } catch (err) {
        console.warn('Backend user profile update failed or not connected, skipping profile save to DB', err);
      }

      // 3. Update active AuthContext user
      if (user) {
        login({ ...user, name: finalForm.fullName }, localStorage.getItem('token') || '');
      }

      // 4. Refresh global goals context in memory
      try {
        await refreshGoal();
      } catch (err) {
        console.warn('Failed to refresh GoalContext in memory', err);
      }

    } catch (error) {
      console.warn('Persist to backend error:', error);
    }
  };

  useEffect(() => {
    api.get('/users/me')
      .then(({ data }) => {
        if (data && data.weight > 0) {
          setForm({
            fullName: data.name || '',
            age: data.age || 28,
            gender: data.gender || 'Female',
            height: data.height || 165,
            currentWeight: data.weight || 68,
            targetWeight: data.goalWeight || 60,
            activityLevel: data.activityLevel || 'Moderately Active',
            dietPreference: data.dietPreference || 'Vegetarian',
            medicalConditions: data.medicalConditions ? data.medicalConditions.split(', ') : ['None'],
            allergies: data.allergies ? data.allergies.split(', ') : ['None'],
            workoutPreference: data.workoutPreference || 'Gym',
          });
          if (data.allergies) setAllergiesText(data.allergies);
          if (data.medicalConditions) setConditionsText(data.medicalConditions);
        }
      })
      .catch((err) => console.warn('Failed to load profile on onboarding mount:', err));

    api.get('/goals')
      .then(({ data }) => {
        if (data && data.length > 0) {
          const currentGoal = data[0];
          setGoal(currentGoal.type || 'weight loss');
        }
      })
      .catch((err) => console.warn('Failed to load goal on onboarding mount:', err));
  }, []);

  const handleChange = (field: keyof AssessmentData, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const computedMetrics = useMemo(() => calculateDietMetrics(form, goal), [form, goal]);

  const totalSteps = 8;
  const completionPercentage = Math.round(((step + 1) / totalSteps) * 100);

  const nextStep = () => {
    if (step < totalSteps - 1) {
      setStep((prev) => prev + 1);
    }
  };

  const prevStep = () => {
    if (step > 0) {
      setStep((prev) => prev - 1);
    }
  };

  const skipStep = () => {
    // Skip is allowed for Step 2 (Index 2: Diet Preference - optional) and Step 3 (Index 3: Medical/Allergies - optional)
    if (step === 2 || step === 3) {
      nextStep();
    }
  };

  const saveAsDraft = async () => {
    const draftData = {
      form,
      goal,
      mealReminders,
      workoutReminders,
      setupComplete: false
    };
    localStorage.setItem('setup-draft', JSON.stringify(draftData));
    localStorage.setItem('setup-complete', 'false');
    
    // Save draft data directly to backend database as well
    await persistToBackend(form, goal);
    navigate('/dashboard');
  };

  const saveAssessment = async () => {
    setLoading(true);
    try {
      await persistToBackend(form, goal);

      // Save complete setup status to LocalStorage
      localStorage.setItem('setup-complete', 'true');
      localStorage.removeItem('setup-draft');

      // Initialize nutrition log state with setup targets
      const initialTrackingState = {
        entries: [],
        water: 0,
        weight: form.currentWeight,
        workoutMinutes: 0,
        steps: 0,
        sleepHours: sleepTarget,
        mood: 'Energetic',
        energy: 'High',
        history: {},
        customFoods: [],
        streakCount: 0,
        longestStreak: 0,
        lastStreakUpdateDate: '',
        workoutDays: ['Monday', 'Wednesday', 'Friday'],
        reminders: {
          mealReminders,
          workoutReminders,
        }
      };
      localStorage.setItem('nutrition-tracker-state-v2', JSON.stringify(initialTrackingState));

      navigate('/dashboard');
    } catch (error) {
      alert('Assessment could not be saved. Proceeding directly to Dashboard.');
      localStorage.setItem('setup-complete', 'true');
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const stepsList = [
    { label: 'Profile', icon: BookOpen },
    { label: 'Goal', icon: Target },
    { label: 'Diet', icon: Apple },
    { label: 'Health', icon: ShieldAlert },
    { label: 'Activity', icon: Activity },
    { label: 'Habits', icon: Droplets },
    { label: 'Targets', icon: Heart },
    { label: 'Launch', icon: CheckCircle2 },
  ];

  return (
    <div className="min-h-screen bg-transparent dark:text-slate-200 px-4 py-8 md:py-16 transition-colors duration-300">
      <div className="mx-auto max-w-5xl rounded-[2.5rem] border border-[var(--border-color)] bg-[var(--bg-card)]/80 p-6 md:p-10 shadow-2xl backdrop-blur-xl space-y-6 relative overflow-hidden">
        
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-600 dark:text-emerald-400">Step Onboarding Flow</p>
            <h1 className="mt-2 text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">Build your nutrition blueprint</h1>
            <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">Complete the guided wizard to configure your premium health command center.</p>
          </div>
          <div className="self-start md:self-auto rounded-full bg-emerald-50 dark:bg-emerald-950/40 px-4 py-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400 border border-emerald-100/10">
            Step {step + 1} of {totalSteps}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-4 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-medium">
          <span>Completion Progress</span>
          <span className="font-semibold text-emerald-600 dark:text-emerald-400">{completionPercentage}% Completed</span>
        </div>
        <div className="mb-8 h-2 overflow-hidden rounded-full bg-emerald-100/40 dark:bg-slate-800">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${completionPercentage}%` }} 
            transition={{ duration: 0.3 }}
            className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-lime-400" 
          />
        </div>

        {/* Step Icons Indicator (Scrollable on small screens) */}
        <div className="mb-10 flex gap-2 overflow-x-auto pb-3 -mx-4 px-4 scrollbar-none md:grid md:grid-cols-8 md:gap-3 md:mx-0 md:px-0">
          {stepsList.map((item, index) => {
            const Icon = item.icon;
            const isCompleted = step > index;
            const isActive = step === index;
            
            return (
              <div 
                key={item.label} 
                className={`flex-shrink-0 flex items-center gap-2 rounded-2xl border px-3 py-2.5 transition-all duration-300 ${
                  isActive 
                    ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 font-semibold scale-102 shadow-sm shadow-emerald-500/5' 
                    : isCompleted 
                      ? 'border-emerald-200 dark:border-emerald-950 bg-emerald-50/20 dark:bg-emerald-950/10 text-emerald-600 dark:text-emerald-400' 
                      : 'border-slate-100 dark:border-slate-800 bg-white/40 dark:bg-slate-800/20 text-slate-400 dark:text-slate-600'
                }`}
              >
                <div className={`rounded-lg p-1.5 ${
                  isActive || isCompleted 
                    ? 'bg-emerald-600 text-white' 
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                }`}>
                  <Icon size={14} />
                </div>
                <span className="text-xs">{item.label}</span>
              </div>
            );
          })}
        </div>

        {/* Content Wizard Box */}
        <div className="min-h-[340px] flex flex-col justify-between">
          <AnimatePresence mode="wait">
            {/* Step 1: Basic Profile */}
            {step === 0 && (
              <motion.div 
                key="step-profile" 
                initial={{ opacity: 0, x: 15 }} 
                animate={{ opacity: 1, x: 0 }} 
                exit={{ opacity: 0, x: -15 }} 
                className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]"
              >
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                    <BookOpen size={18} className="text-emerald-500" /> Tell us about yourself
                  </h3>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="block space-y-1.5">
                      <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Full Name</span>
                      <input 
                        className="w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 px-4 py-3 outline-none focus:border-emerald-500 transition" 
                        value={form.fullName} 
                        onChange={(e) => handleChange('fullName', e.target.value)} 
                        placeholder="John Doe"
                      />
                    </label>
                    <label className="block space-y-1.5">
                      <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Age</span>
                      <input 
                        type="number" 
                        className="w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 px-4 py-3 outline-none focus:border-emerald-500 transition" 
                        value={form.age} 
                        onChange={(e) => handleChange('age', Number(e.target.value))} 
                      />
                    </label>
                    <label className="block space-y-1.5">
                      <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Gender</span>
                      <select 
                        className="w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 px-4 py-3 outline-none focus:border-emerald-500 transition" 
                        value={form.gender} 
                        onChange={(e) => handleChange('gender', e.target.value)}
                      >
                        <option>Female</option>
                        <option>Male</option>
                        <option>Other</option>
                      </select>
                    </label>
                    <label className="block space-y-1.5">
                      <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Height (cm)</span>
                      <input 
                        type="number" 
                        className="w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 px-4 py-3 outline-none focus:border-emerald-500 transition" 
                        value={form.height} 
                        onChange={(e) => handleChange('height', Number(e.target.value))} 
                      />
                    </label>
                    <label className="block space-y-1.5 sm:col-span-2">
                      <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Current Weight (kg)</span>
                      <input 
                        type="number" 
                        className="w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 px-4 py-3 outline-none focus:border-emerald-500 transition" 
                        value={form.currentWeight} 
                        onChange={(e) => handleChange('currentWeight', Number(e.target.value))} 
                      />
                    </label>
                  </div>
                </div>
                
                <div className="rounded-3xl border border-emerald-100/10 dark:border-emerald-950/20 bg-emerald-50/40 dark:bg-emerald-950/10 p-6 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-semibold"><Sparkles size={16} /> Why this matters</div>
                    <p className="mt-2.5 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                      These details are used to compute your metabolic baseline (BMR) and estimate caloric needs precisely.
                    </p>
                  </div>
                  <div className="mt-6 space-y-2">
                    {['Calorie Target', 'Metabolism Calculation', 'Body Mass Assessment'].map((item) => (
                      <div key={item} className="rounded-xl bg-white dark:bg-slate-800 p-2.5 text-xs text-slate-700 dark:text-slate-300 font-medium border border-emerald-50/5">✓ {item}</div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 2: Goal & Target Weight */}
            {step === 1 && (
              <motion.div 
                key="step-goal" 
                initial={{ opacity: 0, x: 15 }} 
                animate={{ opacity: 1, x: 0 }} 
                exit={{ opacity: 0, x: -15 }} 
                className="space-y-4"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                    <Target size={18} className="text-emerald-500" /> Choose your primary goal
                  </h3>
                  <label className="flex items-center gap-2 text-xs">
                    <span className="font-semibold text-slate-500">Target Weight (kg):</span>
                    <input 
                      type="number" 
                      className="w-20 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-1.5 outline-none focus:border-emerald-500 transition text-center" 
                      value={form.targetWeight} 
                      onChange={(e) => handleChange('targetWeight', Number(e.target.value))} 
                    />
                  </label>
                </div>
                <div className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-3 max-h-[290px] overflow-y-auto pr-1">
                  {goalOptions.map((option) => (
                    <button 
                      key={option.key} 
                      onClick={() => setGoal(option.key)} 
                      className={`rounded-2xl border p-4 text-left transition duration-200 group flex flex-col justify-between ${
                        goal === option.key 
                          ? 'border-emerald-500 bg-emerald-50/40 dark:bg-emerald-950/20 shadow-md shadow-emerald-500/5' 
                          : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900/60'
                      }`}
                    >
                      <div className={`mb-2.5 h-7 w-7 rounded-lg bg-gradient-to-br ${option.accent} flex items-center justify-center text-white text-xs font-bold`}>
                        {option.label[0]}
                      </div>
                      <div>
                        <div className="font-semibold text-sm text-slate-900 dark:text-white group-hover:text-emerald-500 dark:group-hover:text-emerald-400 transition-colors">{option.label}</div>
                        <p className="mt-1 text-xs text-slate-500 leading-normal">{option.description}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Step 3: Diet & Macronutrients Preference (Optional) */}
            {step === 2 && (
              <motion.div 
                key="step-diet" 
                initial={{ opacity: 0, x: 15 }} 
                animate={{ opacity: 1, x: 0 }} 
                exit={{ opacity: 0, x: -15 }} 
                className="space-y-4"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                    <Apple size={18} className="text-emerald-500" /> Dietary preferences (Optional)
                  </h3>
                  <span className="text-xs text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">Skip available</span>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-3">
                    <label className="block space-y-1">
                      <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Diet Type</span>
                      <select 
                        className="w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 px-4 py-3 outline-none focus:border-emerald-500 transition" 
                        value={form.dietPreference} 
                        onChange={(e) => handleChange('dietPreference', e.target.value)}
                      >
                        {dietPreferences.map((level) => <option key={level}>{level}</option>)}
                      </select>
                    </label>

                    <label className="block space-y-1">
                      <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Any Food Allergies?</span>
                      <input 
                        className="w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 px-4 py-3 outline-none focus:border-emerald-500 transition" 
                        placeholder="e.g. Peanuts, Gluten, Dairy (comma separated)" 
                        value={allergiesText}
                        onChange={(e) => setAllergiesText(e.target.value)}
                      />
                    </label>
                  </div>
                  
                  <div className="rounded-3xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 p-5 space-y-3 flex flex-col justify-center">
                    <p className="text-xs font-medium text-slate-500 leading-relaxed">
                      If you have specific restrictions or food allergies, enter them here. This filters recommendations from our food tracker database and planner.
                    </p>
                    <div className="text-xs text-slate-400 dark:text-slate-500 leading-normal">
                      💡 Leave blank or skip if you do not have any specific allergies.
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 4: Medical Conditions (Optional) */}
            {step === 3 && (
              <motion.div 
                key="step-health" 
                initial={{ opacity: 0, x: 15 }} 
                animate={{ opacity: 1, x: 0 }} 
                exit={{ opacity: 0, x: -15 }} 
                className="space-y-4"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                    <ShieldAlert size={18} className="text-rose-500" /> Medical focus (Optional)
                  </h3>
                  <span className="text-xs text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">Skip available</span>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-3">
                    <label className="block space-y-1.5">
                      <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Medical Conditions</span>
                      <textarea 
                        rows={3}
                        className="w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 px-4 py-3 outline-none focus:border-emerald-500 transition resize-none" 
                        placeholder="e.g. Thyroid, Diabetes, Hypertension (comma separated)"
                        value={conditionsText}
                        onChange={(e) => setConditionsText(e.target.value)}
                      />
                    </label>
                  </div>
                  <div className="rounded-3xl border border-rose-100/10 dark:border-rose-950/20 bg-rose-50/10 dark:bg-rose-950/5 p-5 flex flex-col justify-center">
                    <div className="flex items-center gap-2 text-rose-700 dark:text-rose-400 font-semibold text-xs"><ShieldAlert size={14} /> Medical Guidance Note</div>
                    <p className="mt-2 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                      Our system adapts recommendations if you have registered medical conditions. Consult your doctor prior to initiating any rigorous nutritional restrictions.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 5: Activity & Workout Preferences */}
            {step === 4 && (
              <motion.div 
                key="step-activity" 
                initial={{ opacity: 0, x: 15 }} 
                animate={{ opacity: 1, x: 0 }} 
                exit={{ opacity: 0, x: -15 }} 
                className="space-y-4"
              >
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                  <Activity size={18} className="text-emerald-500" /> Activity level & exercise preference
                </h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block space-y-1.5">
                    <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Daily Activity Level</span>
                    <select 
                      className="w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 px-4 py-3 outline-none focus:border-emerald-500 transition" 
                      value={form.activityLevel} 
                      onChange={(e) => handleChange('activityLevel', e.target.value)}
                    >
                      {activityLevels.map((level) => <option key={level}>{level}</option>)}
                    </select>
                  </label>

                  <label className="block space-y-1.5">
                    <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Exercise Setting</span>
                    <select 
                      className="w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 px-4 py-3 outline-none focus:border-emerald-500 transition" 
                      value={form.workoutPreference} 
                      onChange={(e) => handleChange('workoutPreference', e.target.value)}
                    >
                      {workoutPreferences.map((level) => <option key={level}>{level}</option>)}
                    </select>
                  </label>
                  
                  <div className="sm:col-span-2 rounded-2xl bg-emerald-50/20 dark:bg-emerald-950/10 p-4 border border-emerald-100/10 text-xs leading-normal">
                    💡 **Moderately Active** includes moving/standing daily or working out 3–5 times per week. The exercise setting configures your weekly workout plans and recommends specific routines.
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 6: Daily Targets & Lifestyle */}
            {step === 5 && (
              <motion.div 
                key="step-lifestyle" 
                initial={{ opacity: 0, x: 15 }} 
                animate={{ opacity: 1, x: 0 }} 
                exit={{ opacity: 0, x: -15 }} 
                className="space-y-4"
              >
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                  <Droplets size={18} className="text-sky-500" /> Lifestyle routines & target habits
                </h3>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 max-h-[290px] overflow-y-auto pr-1">
                  <label className="block space-y-1">
                    <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Morning Routine Style</span>
                    <select 
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2 outline-none focus:border-emerald-500 text-xs"
                      value={morningRoutine}
                      onChange={(e) => setMorningRoutine(e.target.value)}
                    >
                      <option>Hydrate First</option>
                      <option>Meditation</option>
                      <option>Stretch</option>
                      <option>Morning Run</option>
                      <option>Hearty Breakfast</option>
                    </select>
                  </label>

                  <label className="block space-y-1">
                    <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Hydration Target (Liters)</span>
                    <input 
                      type="number" 
                      step="0.1"
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2 outline-none focus:border-emerald-500 text-xs" 
                      value={computedMetrics.water}
                      readOnly
                    />
                  </label>

                  <label className="block space-y-1">
                    <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Daily Steps Target</span>
                    <input 
                      type="number" 
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2 outline-none focus:border-emerald-500 text-xs" 
                      value={stepsTarget}
                      onChange={(e) => setStepsTarget(Number(e.target.value))}
                    />
                  </label>

                  <label className="block space-y-1">
                    <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Target Sleep (Hours)</span>
                    <input 
                      type="number" 
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2 outline-none focus:border-emerald-500 text-xs" 
                      value={sleepTarget}
                      onChange={(e) => setSleepTarget(Number(e.target.value))}
                    />
                  </label>

                  <label className="block space-y-1">
                    <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Daily Workout Target (Mins)</span>
                    <input 
                      type="number" 
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2 outline-none focus:border-emerald-500 text-xs" 
                      value={workoutMinutesTarget}
                      onChange={(e) => setWorkoutMinutesTarget(Number(e.target.value))}
                    />
                  </label>

                  <label className="block space-y-1">
                    <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Recovery Focus</span>
                    <input 
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2 outline-none focus:border-emerald-500 text-xs" 
                      value={recoveryFocus}
                      onChange={(e) => setRecoveryFocus(e.target.value)}
                    />
                  </label>
                </div>
              </motion.div>
            )}

            {/* Step 7: Calculated Targets Summary */}
            {step === 6 && (
              <motion.div 
                key="step-targets" 
                initial={{ opacity: 0, x: 15 }} 
                animate={{ opacity: 1, x: 0 }} 
                exit={{ opacity: 0, x: -15 }} 
                className="space-y-4"
              >
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                  <Flame size={18} className="text-orange-500" /> Your metabolic & nutrition targets
                </h3>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="md:col-span-2 rounded-[2rem] border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 p-5 grid grid-cols-2 gap-3.5">
                    <div className="rounded-2xl bg-white dark:bg-slate-800 p-3 shadow-sm border border-emerald-50/5">
                      <span className="text-[10px] uppercase font-bold text-slate-400">BMI</span>
                      <p className="text-lg font-bold text-slate-800 dark:text-white mt-1">{computedMetrics.bmi}</p>
                    </div>
                    <div className="rounded-2xl bg-white dark:bg-slate-800 p-3 shadow-sm border border-emerald-50/5">
                      <span className="text-[10px] uppercase font-bold text-slate-400">Daily Calories Target</span>
                      <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400 mt-1">{computedMetrics.dailyCalories} kcal</p>
                    </div>
                    <div className="rounded-2xl bg-white dark:bg-slate-800 p-3 shadow-sm border border-emerald-50/5">
                      <span className="text-[10px] uppercase font-bold text-slate-400">BMR Baseline</span>
                      <p className="text-lg font-bold text-slate-800 dark:text-white mt-1">{computedMetrics.bmr} kcal</p>
                    </div>
                    <div className="rounded-2xl bg-white dark:bg-slate-800 p-3 shadow-sm border border-emerald-50/5">
                      <span className="text-[10px] uppercase font-bold text-slate-400">TDEE Intake</span>
                      <p className="text-lg font-bold text-slate-800 dark:text-white mt-1">{computedMetrics.tdee} kcal</p>
                    </div>

                    {/* Calorie Breakdown Row */}
                    <div className="col-span-2 border-t border-slate-200 dark:border-slate-800 pt-3.5 grid grid-cols-3 gap-2 text-center text-[10px] leading-tight">
                      <div className="rounded-xl bg-white dark:bg-slate-800 p-2 shadow-sm border border-emerald-50/5">
                        <span className="text-[7px] uppercase font-bold text-slate-400">Balanced Calories (Maintenance)</span>
                        <p className="text-xs font-black text-slate-700 dark:text-slate-200 mt-0.5">{computedMetrics.tdee} kcal</p>
                      </div>
                      <div className="rounded-xl bg-white dark:bg-slate-800 p-2 shadow-sm border border-emerald-50/5">
                        <span className="text-[7px] uppercase font-bold text-rose-500">Weight Loss Calories (Calorie Deficit)</span>
                        <p className="text-xs font-black text-rose-500 mt-0.5">{Math.round(Math.max(1200, computedMetrics.tdee - 500))} kcal</p>
                      </div>
                      <div className="rounded-xl bg-white dark:bg-slate-800 p-2 shadow-sm border border-emerald-50/5">
                        <span className="text-[7px] uppercase font-bold text-blue-500">Weight Gain Calories (Calorie Surplus)</span>
                        <p className="text-xs font-black text-blue-500 mt-0.5">{Math.round(computedMetrics.tdee + 400)} kcal</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="rounded-[2rem] border border-emerald-100/10 dark:border-emerald-950/20 bg-emerald-50/40 dark:bg-emerald-950/10 p-5 space-y-2">
                    <span className="text-xs font-semibold text-emerald-800 dark:text-emerald-400 block mb-2">Recommended Macro Split</span>
                    <div className="flex items-center justify-between text-xs font-medium"><span>Protein</span><span className="font-semibold">{computedMetrics.protein}g</span></div>
                    <div className="flex items-center justify-between text-xs font-medium"><span>Carbs</span><span className="font-semibold">{computedMetrics.carbs}g</span></div>
                    <div className="flex items-center justify-between text-xs font-medium"><span>Fats</span><span className="font-semibold">{computedMetrics.fat}g</span></div>
                    <div className="flex items-center justify-between text-xs font-medium"><span>Fiber</span><span className="font-semibold">{computedMetrics.fiber}g</span></div>
                    <div className="flex items-center justify-between text-xs font-medium"><span>Water</span><span className="font-semibold">{computedMetrics.water}L</span></div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 8: Final Launch & Reminders */}
            {step === 7 && (
              <motion.div 
                key="step-launch" 
                initial={{ opacity: 0, x: 15 }} 
                animate={{ opacity: 1, x: 0 }} 
                exit={{ opacity: 0, x: -15 }} 
                className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]"
              >
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                    <CheckCircle2 size={18} className="text-emerald-500" /> Almost there! Setup reminders
                  </h3>
                  <div className="space-y-3">
                    <label className="flex items-center justify-between rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-3 shadow-sm cursor-pointer hover:bg-slate-50 transition">
                      <div>
                        <div className="text-sm font-semibold text-slate-900 dark:text-white">Meal Tracking Reminders</div>
                        <p className="text-xs text-slate-500 mt-0.5">Remind me to log Breakfast, Lunch, and Dinner.</p>
                      </div>
                      <input 
                        type="checkbox" 
                        className="h-5 w-5 rounded accent-emerald-600" 
                        checked={mealReminders}
                        onChange={(e) => setMealReminders(e.target.checked)}
                      />
                    </label>

                    <label className="flex items-center justify-between rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-3 shadow-sm cursor-pointer hover:bg-slate-50 transition">
                      <div>
                        <div className="text-sm font-semibold text-slate-900 dark:text-white">Workout Planning Alerts</div>
                        <p className="text-xs text-slate-500 mt-0.5">Remind me on scheduled training calendar days.</p>
                      </div>
                      <input 
                        type="checkbox" 
                        className="h-5 w-5 rounded accent-emerald-600" 
                        checked={workoutReminders}
                        onChange={(e) => setWorkoutReminders(e.target.checked)}
                      />
                    </label>
                  </div>
                </div>

                <div className="rounded-[2.5rem] border border-emerald-100/10 dark:border-emerald-950/20 bg-emerald-50/40 dark:bg-emerald-950/10 p-6 flex flex-col justify-between">
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5"><Sparkles size={16} className="text-emerald-500" /> Unlock Premium Dashboard</h4>
                    <p className="mt-2.5 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                      Saving this setup configures your personal streak counts, Consistency Scores, calorie gauges, and workout cards.
                    </p>
                  </div>
                  <div className="mt-6 flex flex-col gap-2.5">
                    <div className="rounded-xl bg-white dark:bg-slate-800 p-3 text-xs flex justify-between">
                      <span className="font-semibold text-slate-500">Calorie Target</span>
                      <span className="font-bold text-emerald-700 dark:text-emerald-400">{computedMetrics.dailyCalories} kcal</span>
                    </div>
                    <div className="rounded-xl bg-white dark:bg-slate-800 p-3 text-xs flex justify-between">
                      <span className="font-semibold text-slate-500">Water Goal</span>
                      <span className="font-bold text-emerald-700 dark:text-emerald-400">{computedMetrics.water} Liters</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Action Buttons Footer */}
          <div className="mt-10 border-t border-emerald-100/10 pt-6 flex flex-wrap items-center justify-between gap-3">
            <button 
              onClick={prevStep} 
              disabled={step === 0} 
              className="flex items-center gap-2 rounded-2xl border border-slate-200 dark:border-slate-800 px-5 py-3 text-xs font-semibold text-slate-700 dark:text-slate-300 disabled:cursor-not-allowed disabled:opacity-40 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
            >
              <ArrowLeft size={14} /> Previous
            </button>

            <div className="flex flex-wrap gap-3">
              {/* Skip option on Step 3 and Step 4 */}
              {(step === 2 || step === 3) && (
                <button 
                  onClick={skipStep} 
                  className="rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 px-5 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
                >
                  Skip Section
                </button>
              )}

              <button 
                onClick={saveAsDraft} 
                className="rounded-2xl border border-slate-200 dark:border-slate-800 px-5 py-3 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
              >
                Save as Draft
              </button>

              {step < totalSteps - 1 ? (
                <button 
                  onClick={nextStep} 
                  className="flex items-center gap-1.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 dark:bg-emerald-500 dark:hover:bg-emerald-400 px-6 py-3 text-xs font-semibold text-white shadow-lg shadow-emerald-500/10 transition"
                >
                  Next <ChevronRight size={14} />
                </button>
              ) : (
                <button 
                  onClick={saveAssessment} 
                  disabled={loading} 
                  className="flex items-center gap-2 rounded-2xl bg-emerald-600 hover:bg-emerald-500 dark:bg-emerald-500 dark:hover:bg-emerald-400 px-7 py-3 text-xs font-semibold text-white disabled:opacity-50 shadow-lg shadow-emerald-500/10 transition"
                >
                  {loading ? 'Saving Setup…' : 'Save & Continue'}
                </button>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
