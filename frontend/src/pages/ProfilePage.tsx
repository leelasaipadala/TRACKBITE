import { useEffect, useState, useMemo } from 'react';
import { User, Droplet, Flame, Compass } from 'lucide-react';
import { useGoal } from '../context/GoalContext';
import { calculateHealthMetrics } from '../services/calculations';

export default function ProfilePage() {
  const { goal, saveGoal } = useGoal();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: '',
    age: 26,
    gender: 'Male',
    height: 175,
    weight: 72,
    goalWeight: 68,
    goal: 'Weight Loss',
    activityLevel: 'Moderate',
    dietPreference: 'Vegetarian',
    medicalConditions: 'None',
    allergies: 'None',
    workoutPreference: 'Home Workout (No Equipment)',
    waist: 80,
    neck: 36,
    hip: 90
  });

  // Populate form with global GoalContext state on mount or change
  useEffect(() => {
    if (goal) {
      setForm({
        name: goal.assessment?.name || goal.name || '',
        age: goal.assessment?.age || 26,
        gender: goal.assessment?.gender || 'Male',
        height: goal.assessment?.height || 175,
        weight: goal.assessment?.weight || 72,
        goalWeight: goal.goalWeight || 68,
        goal: goal.type || 'Weight Loss',
        activityLevel: goal.activityLevel || 'Moderate',
        dietPreference: goal.dietPreference || 'Vegetarian',
        medicalConditions: goal.medicalConditions || 'None',
        allergies: goal.allergies || 'None',
        workoutPreference: goal.workoutPreference || 'Home Workout (No Equipment)',
        waist: goal.assessment?.waist || 80,
        neck: goal.assessment?.neck || 36,
        hip: goal.assessment?.hip || 90
      });
    }
  }, [goal]);

  // Live metrics preview as user types
  const liveMetrics = useMemo(() => {
    return calculateHealthMetrics(form);
  }, [form]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await saveGoal(form);
      alert('NutriVibe profile details and fitness targets updated successfully!');
    } catch (error: any) {
      console.error('Failed to save profile:', error);
      alert('Failed to save profile details: ' + (error.response?.data?.message || error.message));
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (key: string, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="min-h-screen bg-transparent p-4 md:p-6 transition-colors duration-300 page-transition-container">
      <div className="mx-auto max-w-7xl space-y-6">
        
        <header className="rounded-3xl border border-[var(--border-color)] bg-[var(--bg-card)]/80 backdrop-blur-md p-6 shadow-xl flex items-center gap-3">
          <div className="h-10 w-10 rounded-2xl bg-gradient-to-tr from-emerald-500 to-green-600 flex items-center justify-center text-white shadow-lg">
            <User size={20} />
          </div>
          <div>
            <h1 className="font-extrabold text-xl leading-none text-[var(--text-primary)]">My Profile & Goals</h1>
            <span className="text-[10px] text-[var(--text-muted)] font-bold uppercase tracking-wider mt-1 block">Adjust Personal Nutrition Assessment</span>
          </div>
        </header>

        <div className="grid gap-6 lg:grid-cols-[1fr_400px]">
          
          {/* Onboarding edit form */}
          <form onSubmit={handleSave} className="rounded-3xl border border-[var(--border-color)] bg-[var(--bg-card)]/80 backdrop-blur-md p-6 md:p-8 space-y-6 card-hover-lift">
            <h3 className="font-extrabold text-[var(--text-primary)] text-sm tracking-wide uppercase border-b border-[var(--border-color)] pb-3">Personal Details</h3>
            
            <div className="grid gap-5 md:grid-cols-2 text-xs font-semibold">
              <label className="block space-y-2">
                <span className="text-[var(--text-secondary)]">Full Name</span>
                <input className="w-full rounded-xl border border-[var(--border-color)] bg-transparent px-4 py-3 text-[var(--text-primary)] outline-none focus:border-emerald-500 transition" value={form.name} onChange={(e) => handleInputChange('name', e.target.value)} required />
              </label>

              <label className="block space-y-2">
                <span className="text-[var(--text-secondary)]">Primary Goal</span>
                <select className="w-full rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] px-4 py-3 text-[var(--text-primary)] outline-none focus:border-emerald-500 transition" value={form.goal} onChange={(e) => handleInputChange('goal', e.target.value)}>
                  <option>Weight Loss</option>
                  <option>Fat Loss</option>
                  <option>Weight Gain</option>
                  <option>Lean Bulk</option>
                  <option>Muscle Gain</option>
                  <option>Body Recomposition</option>
                  <option>Healthy Lifestyle</option>
                </select>
              </label>

              <label className="block space-y-2">
                <span className="text-[var(--text-secondary)]">Age</span>
                <input type="number" className="w-full rounded-xl border border-[var(--border-color)] bg-transparent px-4 py-3 text-[var(--text-primary)] outline-none text-center focus:border-emerald-500" value={form.age} onChange={(e) => handleInputChange('age', Number(e.target.value))} />
              </label>

              <label className="block space-y-2">
                <span className="text-[var(--text-secondary)]">Gender</span>
                <select className="w-full rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] px-4 py-3 text-[var(--text-primary)] outline-none focus:border-emerald-500" value={form.gender} onChange={(e) => handleInputChange('gender', e.target.value)}>
                  <option>Male</option>
                  <option>Female</option>
                </select>
              </label>

              <div className="grid grid-cols-3 gap-2.5 md:col-span-2 border-t border-b border-[var(--border-color)] py-4 my-2">
                <label className="block space-y-2">
                  <span className="text-[var(--text-secondary)]">Height (cm)</span>
                  <input type="number" className="w-full rounded-xl border border-[var(--border-color)] bg-transparent px-3 py-3 text-[var(--text-primary)] outline-none text-center focus:border-emerald-500" value={form.height} onChange={(e) => handleInputChange('height', Number(e.target.value))} />
                </label>
                <label className="block space-y-2">
                  <span className="text-[var(--text-secondary)]">Weight (kg)</span>
                  <input type="number" className="w-full rounded-xl border border-[var(--border-color)] bg-transparent px-3 py-3 text-[var(--text-primary)] outline-none text-center focus:border-emerald-500" value={form.weight} onChange={(e) => handleInputChange('weight', Number(e.target.value))} />
                </label>
                <label className="block space-y-2">
                  <span className="text-[var(--text-secondary)]">Target Weight (kg)</span>
                  <input type="number" className="w-full rounded-xl border border-[var(--border-color)] bg-transparent px-3 py-3 text-[var(--text-primary)] outline-none text-center focus:border-emerald-500" value={form.goalWeight} onChange={(e) => handleInputChange('goalWeight', Number(e.target.value))} />
                </label>
              </div>

              {/* U.S. Navy measurements input section */}
              <div className="grid grid-cols-3 gap-2.5 md:col-span-2 border-b border-[var(--border-color)] pb-4 mb-2">
                <label className="block space-y-2">
                  <span className="text-[var(--text-secondary)]">Waist (cm)</span>
                  <input type="number" className="w-full rounded-xl border border-[var(--border-color)] bg-transparent px-3 py-3 text-[var(--text-primary)] outline-none text-center focus:border-emerald-500" value={form.waist} onChange={(e) => handleInputChange('waist', Number(e.target.value))} />
                </label>
                <label className="block space-y-2">
                  <span className="text-[var(--text-secondary)]">Neck (cm)</span>
                  <input type="number" className="w-full rounded-xl border border-[var(--border-color)] bg-transparent px-3 py-3 text-[var(--text-primary)] outline-none text-center focus:border-emerald-500" value={form.neck} onChange={(e) => handleInputChange('neck', Number(e.target.value))} />
                </label>
                {form.gender.toLowerCase() === 'female' ? (
                  <label className="block space-y-2">
                    <span className="text-[var(--text-secondary)]">Hip (cm)</span>
                    <input type="number" className="w-full rounded-xl border border-[var(--border-color)] bg-transparent px-3 py-3 text-[var(--text-primary)] outline-none text-center focus:border-emerald-500" value={form.hip} onChange={(e) => handleInputChange('hip', Number(e.target.value))} />
                  </label>
                ) : (
                  <div className="flex items-center justify-center text-[10px] text-[var(--text-muted)] pt-6">Hip (Not required for Men)</div>
                )}
              </div>

              <label className="block space-y-2">
                <span className="text-[var(--text-secondary)]">Activity Level</span>
                <select className="w-full rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] px-4 py-3 text-[var(--text-primary)] outline-none focus:border-emerald-500" value={form.activityLevel} onChange={(e) => handleInputChange('activityLevel', e.target.value)}>
                  <option>Sedentary</option>
                  <option>Lightly Active</option>
                  <option>Moderate</option>
                  <option>Very Active</option>
                  <option>Extra Active</option>
                </select>
              </label>

              <label className="block space-y-2">
                <span className="text-[var(--text-secondary)]">Diet Preference</span>
                <select className="w-full rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] px-4 py-3 text-[var(--text-primary)] outline-none focus:border-emerald-500" value={form.dietPreference} onChange={(e) => handleInputChange('dietPreference', e.target.value)}>
                  <option>Vegetarian</option>
                  <option>Non Vegetarian</option>
                  <option>Vegan</option>
                </select>
              </label>

              <label className="block space-y-2">
                <span className="text-[var(--text-secondary)]">Workout Preference</span>
                <select className="w-full rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] px-4 py-3 text-[var(--text-primary)] outline-none focus:border-emerald-500" value={form.workoutPreference} onChange={(e) => handleInputChange('workoutPreference', e.target.value)}>
                  <option>Home Workout (No Equipment)</option>
                  <option>Home Workout (With Equipment)</option>
                  <option>Gym Workout</option>
                </select>
              </label>

              <label className="block space-y-2">
                <span className="text-[var(--text-secondary)]">Medical Conditions</span>
                <input className="w-full rounded-xl border border-[var(--border-color)] bg-transparent px-4 py-3 text-[var(--text-primary)] outline-none focus:border-emerald-500" value={form.medicalConditions} onChange={(e) => handleInputChange('medicalConditions', e.target.value)} />
              </label>

              <label className="block space-y-2 md:col-span-2">
                <span className="text-[var(--text-secondary)]">Food Allergies</span>
                <input className="w-full rounded-xl border border-[var(--border-color)] bg-transparent px-4 py-3 text-[var(--text-primary)] outline-none focus:border-emerald-500" value={form.allergies} onChange={(e) => handleInputChange('allergies', e.target.value)} />
              </label>
            </div>

            <button type="submit" disabled={saving} className="btn-premium w-full py-4 active:scale-95">
              {saving ? 'Updating profile details...' : 'Save Profile & Targets'}
            </button>
          </form>

          {/* Right Column: Live Goal Preview */}
          <div className="space-y-6">
            <div className="rounded-[24px] border border-[var(--border-color)] bg-[var(--bg-card)]/80 backdrop-blur-md p-6 shadow-xl space-y-6 card-hover-lift">
              <h3 className="font-extrabold text-[var(--text-primary)] text-sm tracking-wide uppercase flex items-center gap-1.5 border-b border-[var(--border-color)] pb-3">
                <Compass size={16} className="text-emerald-500" /> Live Target Assessment
              </h3>

              <div className="grid grid-cols-2 gap-4 text-xs font-semibold">
                
                {/* BMI Card */}
                <div className="p-3 border border-[var(--border-color)] rounded-2xl bg-[var(--bg-card)] space-y-1 hover:scale-[1.03] transition-transform duration-200">
                  <span className="text-[var(--text-muted)] block text-[9px] uppercase tracking-wider">BMI</span>
                  <span className="text-lg font-black text-[var(--text-primary)]">{liveMetrics.bmi}</span>
                </div>

                {/* Body Fat % Navy Card */}
                <div className="p-3 border border-[var(--border-color)] rounded-2xl bg-[var(--bg-card)] space-y-1 hover:scale-[1.03] transition-transform duration-200">
                  <span className="text-[var(--text-muted)] block text-[9px] uppercase tracking-wider">Body Fat (Navy)</span>
                  <span className="text-lg font-black text-emerald-500">{liveMetrics.bodyFatPercent}%</span>
                </div>

                {/* BMR Card */}
                <div className="p-3 border border-[var(--border-color)] rounded-2xl bg-[var(--bg-card)] space-y-1 hover:scale-[1.03] transition-transform duration-200">
                  <span className="text-[var(--text-muted)] block text-[9px] uppercase tracking-wider">BMR</span>
                  <span className="text-lg font-black text-[var(--text-primary)]">{liveMetrics.bmr} kcal</span>
                </div>

                {/* TDEE Card */}
                <div className="p-3 border border-[var(--border-color)] rounded-2xl bg-[var(--bg-card)] space-y-1 hover:scale-[1.03] transition-transform duration-200">
                  <span className="text-[var(--text-muted)] block text-[9px] uppercase tracking-wider">TDEE</span>
                  <span className="text-lg font-black text-[var(--text-primary)]">{liveMetrics.tdee} kcal</span>
                </div>

                {/* LBM Card */}
                <div className="p-3 border border-[var(--border-color)] rounded-2xl bg-[var(--bg-card)] space-y-1 hover:scale-[1.03] transition-transform duration-200">
                  <span className="text-[var(--text-muted)] block text-[9px] uppercase tracking-wider">Lean Mass</span>
                  <span className="text-lg font-black text-[var(--text-primary)]">{liveMetrics.leanBodyMass} kg</span>
                </div>

                {/* Fat Mass Card */}
                <div className="p-3 border border-[var(--border-color)] rounded-2xl bg-[var(--bg-card)] space-y-1 hover:scale-[1.03] transition-transform duration-200">
                  <span className="text-[var(--text-muted)] block text-[9px] uppercase tracking-wider">Fat Mass</span>
                  <span className="text-lg font-black text-rose-500">{liveMetrics.fatMass} kg</span>
                </div>

                {/* Ideal Weight Card */}
                <div className="p-3 border border-[var(--border-color)] rounded-2xl bg-[var(--bg-card)] space-y-1 hover:scale-[1.03] transition-transform duration-200">
                  <span className="text-[var(--text-muted)] block text-[9px] uppercase tracking-wider">Ideal Weight</span>
                  <span className="text-lg font-black text-[var(--text-primary)]">{liveMetrics.idealWeight} kg</span>
                </div>

                {/* Healthy Range Card */}
                <div className="p-3 border border-[var(--border-color)] rounded-2xl bg-[var(--bg-card)] space-y-1 hover:scale-[1.03] transition-transform duration-200">
                  <span className="text-[var(--text-muted)] block text-[9px] uppercase tracking-wider">Healthy Range</span>
                  <span className="text-[10px] font-black text-[var(--text-primary)]">{liveMetrics.healthyWeightMin} - {liveMetrics.healthyWeightMax} kg</span>
                </div>

              </div>

              {/* Targets Summary */}
              <div className="border-t border-[var(--border-color)] pt-4 space-y-3.5 text-xs font-semibold">
                
                <div className="flex justify-between items-center bg-[var(--bg-card)] p-2.5 rounded-xl border border-[var(--border-color)]">
                  <span className="text-[var(--text-secondary)] flex items-center gap-1.5"><Flame size={14} className="text-orange-500" /> Daily Target Calories</span>
                  <span className="text-lg font-black text-[var(--text-primary)]">{liveMetrics.dailyCalories} kcal</span>
                </div>

                <div className="grid grid-cols-3 gap-2 bg-[var(--bg-card)] p-2 rounded-xl border border-[var(--border-color)] text-center">
                  <div>
                    <span className="text-[8px] uppercase text-[var(--text-muted)] tracking-wider font-bold">Protein</span>
                    <span className="block font-black text-[var(--text-primary)] mt-0.5">{liveMetrics.protein}g</span>
                  </div>
                  <div>
                    <span className="text-[8px] uppercase text-[var(--text-muted)] tracking-wider font-bold">Carbs</span>
                    <span className="block font-black text-[var(--text-primary)] mt-0.5">{liveMetrics.carbs}g</span>
                  </div>
                  <div>
                    <span className="text-[8px] uppercase text-[var(--text-muted)] tracking-wider font-bold">Fat</span>
                    <span className="block font-black text-[var(--text-primary)] mt-0.5">{liveMetrics.fat}g</span>
                  </div>
                </div>

                <div className="flex justify-between items-center border-t border-[var(--border-color)] pt-3 text-[11px]">
                  <span className="text-[var(--text-muted)]">Target Fiber Goal</span>
                  <span className="font-bold text-[var(--text-primary)]">{liveMetrics.fiber} g</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-[var(--text-muted)] flex items-center gap-1"><Droplet size={12} className="text-blue-400" /> Target Water Intake</span>
                  <span className="font-bold text-[var(--text-primary)]">{liveMetrics.waterIntake} Liters</span>
                </div>

              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
