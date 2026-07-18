import { useEffect, useState } from 'react';
import api from '../services/api';

interface Food { _id: string; name: string; calories: number; protein: number; carbs: number; fat: number; fiber: number; category: string; }

export default function FoodPage() {
  const [foods, setFoods] = useState<Food[]>([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    api.get(`/foods?search=${search}&page=${page}&limit=8`).then(({ data }) => setFoods(data.foods)).catch(() => setFoods([]));
  }, [search, page]);

  return (
    <div className="min-h-screen bg-[linear-gradient(135deg,_#f7fff9_0%,_#ebfdf4_100%)] p-6 text-slate-800">
      <div className="mx-auto max-w-6xl rounded-[2rem] border border-emerald-100 bg-white p-8 shadow-sm">
        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-slate-900">Food database</h1>
            <p className="mt-2 text-slate-600">Search, filter, and discover nutrition-rich foods.</p>
          </div>
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search foods" className="w-full max-w-sm rounded-2xl border border-slate-200 px-4 py-3 outline-none lg:w-auto" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {foods.map((food) => (
            <div key={food._id} className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4">
              <div className="font-semibold text-slate-900">{food.name}</div>
              <div className="mt-2 text-sm text-slate-600">{food.category}</div>
              <div className="mt-4 grid grid-cols-2 gap-2 text-sm text-slate-600">
                <div>Calories {food.calories}</div>
                <div>Protein {food.protein}g</div>
                <div>Carbs {food.carbs}g</div>
                <div>Fat {food.fat}g</div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-6 flex justify-between">
          <button onClick={() => setPage((p) => Math.max(1, p - 1))} className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold">Previous</button>
          <button onClick={() => setPage((p) => p + 1)} className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white">Next</button>
        </div>
      </div>
    </div>
  );
}
