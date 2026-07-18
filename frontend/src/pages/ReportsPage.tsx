import { useState, useEffect, useMemo } from 'react';
import { 
  FileText, 
  Download, 
  TrendingUp, 
  BarChart3, 
  Droplets,
  Activity,
  Heart
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid,
  BarChart,
  Bar
} from 'recharts';
import { 
  readNutritionState, 
  getTotals
} from '../services/nutritionTracking';
import api from '../services/api';

export default function ReportsPage() {
  const [historyEntries, setHistoryEntries] = useState<any[]>([]);
  const [timeRange, setTimeRange] = useState<'weekly' | 'monthly'>('weekly');

  useEffect(() => {
    api.get('/progress/daily')
      .then(({ data }) => {
        if (data) {
          const formatted = data.map((log: any) => ({
            date: log.date,
            weight: log.weight || 70,
            bodyFat: log.bodyFat || 18,
            waist: log.waist || 32,
            chest: log.chest || 38,
            hip: log.hip || 36,
            neck: log.neck || 14,
            leanBodyMass: log.leanBodyMass || 57.4,
            calories: log.calories || 0,
            protein: log.protein || 0,
            carbs: log.carbs || 0,
            fat: log.fat || 0,
            water: log.water || 0,
            workoutMinutes: log.workoutMinutes || 0,
            steps: log.steps || 0,
            sleepHours: log.sleepHours || 8,
            bmi: log.weight ? (log.weight / 2.89).toFixed(1) : '23.5'
          }));
          setHistoryEntries(formatted);
        }
      })
      .catch(err => {
        console.warn('Failed to fetch history logs from database, fallback to local storage', err);
        const localState = readNutritionState();
        const formatted = Object.entries(localState.history).map(([date, log]) => {
          const totals = getTotals(log.entries || []);
          return {
            date,
            weight: log.weight || 70,
            bodyFat: log.bodyFat || 18,
            waist: log.waist || 32,
            chest: log.chest || 38,
            hip: log.hip || 36,
            neck: log.neck || 14,
            leanBodyMass: log.leanBodyMass || 57.4,
            calories: totals.calories,
            protein: totals.protein,
            carbs: totals.carbs,
            fat: totals.fat,
            water: log.water || 0,
            workoutMinutes: log.workoutMinutes || 0,
            steps: log.steps || 0,
            sleepHours: log.sleepHours || 8,
            bmi: log.weight ? (log.weight / 2.89).toFixed(1) : '23.5'
          };
        }).sort((a, b) => a.date.localeCompare(b.date));
        setHistoryEntries(formatted);
      });
  }, []);

  const filteredHistory = useMemo(() => {
    const limit = timeRange === 'weekly' ? 7 : 30;
    return historyEntries.slice(-limit);
  }, [historyEntries, timeRange]);

  // Export simulated PDF
  const handleExportPDF = () => {
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>TRACKBITE Progress Summary - ${new Date().toLocaleDateString()}</title>
          <style>
            body { font-family: sans-serif; padding: 30px; color: #f8fafc; background: #0b1220; line-height: 1.6; }
            .header { border-bottom: 2px solid #3b82f6; padding-bottom: 10px; margin-bottom: 20px; }
            h1 { margin: 0; color: #f8fafc; }
            table { width: 100%; border-collapse: collapse; margin-top: 15px; }
            th, td { border: 1px solid #1f2937; padding: 10px; text-align: left; font-size: 12px; }
            th { background: #111827; font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>TRACKBITE Progress Summary Report</h1>
            <p>Generated on ${new Date().toLocaleDateString()}</p>
          </div>
          <h3>Historical Tracking Log</h3>
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Weight</th>
                <th>BMI</th>
                <th>Body Fat %</th>
                <th>Calories</th>
                <th>Protein</th>
                <th>Water (L)</th>
                <th>Workout Mins</th>
              </tr>
            </thead>
            <tbody>
              ${filteredHistory.map(h => `
                <tr>
                  <td>${h.date}</td>
                  <td>${h.weight} kg</td>
                  <td>${h.bmi}</td>
                  <td>${h.bodyFat}%</td>
                  <td>${h.calories} kcal</td>
                  <td>${h.protein}g</td>
                  <td>${h.water} L</td>
                  <td>${h.workoutMinutes} mins</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </body>
      </html>
    `;

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `trackbite_report_${timeRange}.html`;
    link.click();
  };

  // Export simulated Excel
  const handleExportExcel = () => {
    let csv = "Date,Weight (kg),BMI,Body Fat %,Calories (kcal),Protein (g),Carbs (g),Fat (g),Water (L),Workout Minutes,Steps,Sleep Hours\n";
    filteredHistory.forEach(h => {
      csv += `${h.date},${h.weight},${h.bmi},${h.bodyFat},${h.calories},${h.protein},${h.carbs},${h.fat},${h.water},${h.workoutMinutes},${h.steps},${h.sleepHours}\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `trackbite_data_${timeRange}.csv`;
    link.click();
  };

  return (
    <div className="min-h-screen bg-transparent text-[var(--text-primary)] p-4 md:p-6 transition-colors duration-300">
      <div className="mx-auto max-w-7xl space-y-6">
        
        {/* Header */}
        <header className="rounded-3xl border border-[var(--border-color)] bg-[var(--bg-card)] p-6 shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-gradient-to-tr from-blue-500 to-emerald-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
              <BarChart3 size={20} />
            </div>
            <div>
              <h1 className="page-title text-[var(--text-primary)] leading-none">Reports & Analytics</h1>
              <span className="text-[10px] text-[var(--text-muted)] font-bold uppercase tracking-wider mt-1 block">Analyze Long-term Health Trends</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <select 
              className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-sidebar)] text-[var(--text-primary)] text-xs px-3 py-2 outline-none font-bold"
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value as any)}
            >
              <option value="weekly">Last 7 Days</option>
              <option value="monthly">Last 30 Days</option>
            </select>
            <button 
              onClick={handleExportPDF}
              className="flex items-center gap-1 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-3.5 py-2.5 rounded-xl shadow-lg shadow-blue-600/10 transition active:scale-95 cursor-pointer"
            >
              <Download size={13} /> Export PDF
            </button>
            <button 
              onClick={handleExportExcel}
              className="flex items-center gap-1 bg-[var(--bg-sidebar)] hover:bg-[var(--border-color)] text-[var(--text-primary)] border border-[var(--border-color)] font-bold text-xs px-3.5 py-2.5 rounded-xl transition active:scale-95 cursor-pointer"
            >
              <FileText size={13} /> Export Excel
            </button>
          </div>
        </header>

        {filteredHistory.length === 0 ? (
          <div className="rounded-[2rem] bg-[var(--bg-card)] border border-[var(--border-color)] p-12 text-center text-[var(--text-muted)]">
            <p className="text-sm font-semibold">No progress data logged yet. Log meals, weight, or water on the dashboard to build your analytics dashboard!</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            
            {/* Weight, BMI, Body Fat Trends */}
            <div className="rounded-[2rem] border border-[var(--border-color)] bg-[var(--bg-card)] p-6 space-y-4 shadow-xl">
              <h3 className="card-title text-[var(--text-primary)] flex items-center gap-2">
                <TrendingUp size={16} className="text-blue-500" /> Body Composition Trends (Weight & BMI)
              </h3>
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={filteredHistory}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                    <XAxis dataKey="date" stroke="var(--text-muted)" fontSize={10} tickLine={false} />
                    <YAxis stroke="var(--text-muted)" fontSize={10} tickLine={false} />
                    <Tooltip contentStyle={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }} />
                    <Line type="monotone" dataKey="weight" stroke="#3B82F6" strokeWidth={2.5} name="Weight (kg)" />
                    <Line type="monotone" dataKey="bodyFat" stroke="#10B981" strokeWidth={1.5} name="Body Fat %" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Calories & Protein Trend */}
            <div className="rounded-[2rem] border border-[var(--border-color)] bg-[var(--bg-card)] p-6 space-y-4 shadow-xl">
              <h3 className="card-title text-[var(--text-primary)] flex items-center gap-2">
                <Heart size={16} className="text-rose-500" /> Calories & Protein Trend
              </h3>
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={filteredHistory}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                    <XAxis dataKey="date" stroke="var(--text-muted)" fontSize={10} tickLine={false} />
                    <YAxis stroke="var(--text-muted)" fontSize={10} tickLine={false} />
                    <Tooltip contentStyle={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }} />
                    <Bar dataKey="calories" fill="#3B82F6" radius={[4, 4, 0, 0]} name="Calories (kcal)" />
                    <Bar dataKey="protein" fill="#0EA5E9" radius={[4, 4, 0, 0]} name="Protein (g)" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Water Trend */}
            <div className="rounded-[2rem] border border-[var(--border-color)] bg-[var(--bg-card)] p-6 space-y-4 shadow-xl">
              <h3 className="card-title text-[var(--text-primary)] flex items-center gap-2">
                <Droplets size={16} className="text-sky-500" /> Daily Water Intake (Liters)
              </h3>
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={filteredHistory}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                    <XAxis dataKey="date" stroke="var(--text-muted)" fontSize={10} tickLine={false} />
                    <YAxis stroke="var(--text-muted)" fontSize={10} tickLine={false} />
                    <Tooltip contentStyle={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }} />
                    <Line type="monotone" dataKey="water" stroke="#0ea5e9" strokeWidth={2.5} name="Water (L)" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Workouts minutes */}
            <div className="rounded-[2rem] border border-[var(--border-color)] bg-[var(--bg-card)] p-6 space-y-4 shadow-xl">
              <h3 className="card-title text-[var(--text-primary)] flex items-center gap-2">
                <Activity size={16} className="text-violet-500" /> Workout Duration (Minutes)
              </h3>
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={filteredHistory}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                    <XAxis dataKey="date" stroke="var(--text-muted)" fontSize={10} tickLine={false} />
                    <YAxis stroke="var(--text-muted)" fontSize={10} tickLine={false} />
                    <Tooltip contentStyle={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }} />
                    <Bar dataKey="workoutMinutes" fill="#8B5CF6" radius={[4, 4, 0, 0]} name="Workouts (mins)" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Logged Meal History details table */}
            <div className="md:col-span-2 rounded-[2.5rem] border border-[var(--border-color)] bg-[var(--bg-card)] p-6 md:p-8 space-y-4 shadow-xl">
              <h3 className="section-title text-[var(--text-primary)]">Historical Tracking Details</h3>
              <table>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Weight</th>
                    <th>BMI</th>
                    <th>Calories</th>
                    <th>Protein</th>
                    <th>Water</th>
                    <th>Sleep</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredHistory.map((h, idx) => (
                    <tr key={idx}>
                      <td>{h.date}</td>
                      <td>{h.weight} kg</td>
                      <td>{h.bmi}</td>
                      <td>{h.calories} kcal</td>
                      <td>{h.protein}g</td>
                      <td>{h.water} L</td>
                      <td>{h.sleepHours} hrs</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
