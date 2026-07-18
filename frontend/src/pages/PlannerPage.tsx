import { useEffect, useMemo, useState } from 'react';
import api from '../services/api';
import { generateWeeklyPlan, type DayPlan } from '../services/dietPlanning';

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export default function PlannerPage() {
  const [selectedDay, setSelectedDay] = useState('Monday');
  const [plan, setPlan] = useState<DayPlan[]>([]);

  useEffect(() => {
    api.get('/goals').then(({ data }) => {
      const latest = data[0];
      if (latest?.weeklyPlan && latest.weeklyPlan.length) {
        setPlan(latest.weeklyPlan);
      } else if (latest?.assessment && latest.metrics) {
        setPlan(generateWeeklyPlan(latest.assessment, latest.type, latest.metrics));
      }
    }).catch(() => setPlan([]));
  }, []);

  const selectedPlans = useMemo(() => plan.find((day) => day.day === selectedDay) || null, [plan, selectedDay]);

  return (
    <div className="min-h-screen bg-[linear-gradient(135deg,_#f7fff9_0%,_#ebfdf4_100%)] p-6 text-slate-800">
      <div className="mx-auto max-w-6xl rounded-[2rem] border border-emerald-100 bg-white p-8 shadow-sm">
        <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-slate-900">Weekly meal planner</h1>
            <p className="mt-2 text-slate-600">Your personalized meal plan is generated from the assessment and adapts to the selected day.</p>
          </div>
          <button className="rounded-2xl bg-emerald-600 px-5 py-3 font-semibold text-white">Regenerate week</button>
        </div>
        <div className="mb-6 flex flex-wrap gap-3">
          {days.map((day) => (
            <button key={day} onClick={() => setSelectedDay(day)} className={`rounded-full px-4 py-2 text-sm font-semibold ${selectedDay === day ? 'bg-emerald-600 text-white' : 'bg-emerald-50 text-emerald-700'}`}>{day}</button>
          ))}
        </div>
        {!selectedPlans ? <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-8 text-center text-slate-600">No weekly plan is available yet. Complete the assessment to generate one.</div> : (
          <div className="grid gap-4 lg:grid-cols-2">
            {selectedPlans.meals.map((meal) => (
              <div key={meal.id} className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4">
                <div className="mb-3 flex items-center justify-between">
                  <h2 className="font-semibold text-slate-900">{meal.name}</h2>
                  <button className="text-sm font-medium text-emerald-700">Replace</button>
                </div>
                <div className="space-y-2 rounded-2xl bg-white p-3 shadow-sm">
                  <div className="text-sm text-slate-500">{meal.calories} kcal • P {meal.protein}g • C {meal.carbs}g • F {meal.fat}g • Fiber {meal.fiber}g</div>
                  <div className="text-sm text-slate-600">Ingredients: {meal.ingredients.join(', ')}</div>
                  <div className="text-sm text-slate-600">Cooking Time: {meal.cookingTime}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
