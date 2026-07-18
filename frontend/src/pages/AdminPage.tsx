import { useEffect, useState } from 'react';
import api from '../services/api';

export default function AdminPage() {
  const [stats, setStats] = useState({ users: 0, foods: 0, recipes: 0 });

  useEffect(() => {
    api.get('/admin/stats').then(({ data }) => setStats(data)).catch(() => setStats({ users: 0, foods: 0, recipes: 0 }));
  }, []);

  return (
    <div className="min-h-screen bg-[linear-gradient(135deg,_#f7fff9_0%,_#ebfdf4_100%)] p-6 text-slate-800">
      <div className="mx-auto max-w-6xl rounded-[2rem] border border-emerald-100 bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-semibold text-slate-900">Admin panel</h1>
        <p className="mt-2 text-slate-600">Overview of users, foods, and recipes.</p>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {Object.entries(stats).map(([key, value]) => (
            <div key={key} className="rounded-[1.5rem] border border-emerald-100 bg-emerald-50 p-5">
              <div className="text-sm uppercase tracking-[0.2em] text-emerald-700">{key}</div>
              <div className="mt-3 text-3xl font-semibold text-slate-900">{value}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
