import { createContext, useContext, useEffect, useState, useMemo } from 'react';
import type { ReactNode } from 'react';
import api from '../services/api';
import { calculateHealthMetrics, type HealthCalculations } from '../services/calculations';
import { useAuth } from './AuthContext';

interface GoalContextType {
  goal: any;
  setGoal: (goal: any) => void;
  refreshGoal: () => Promise<void>;
  calculations: HealthCalculations;
  weightLogs: any[];
  saveGoal: (form: any) => Promise<void>;
  logWeightProgress: (params: { weight: number; waist: number; neck: number; hip: number; chest: number }) => Promise<void>;
}

const GoalContext = createContext<GoalContextType | undefined>(undefined);

export function GoalProvider({ children }: { children: ReactNode }) {
  const { user, updateUser } = useAuth();
  const [goal, setGoal] = useState<any>(null);
  const [weightLogs, setWeightLogs] = useState<any[]>([]);

  const refreshGoal = async () => {
    if (!user) return;
    try {
      const { data } = await api.get('/goals');
      if (data && data.length > 0) {
        setGoal(data[0]);
        if (data[0].metrics?.weightHistory) {
          setWeightLogs(data[0].metrics.weightHistory);
        }
      }
    } catch (err) {
      console.warn('Goals endpoints are not active in backend yet.', err);
    }
  };

  useEffect(() => {
    refreshGoal();
  }, [user]);

  const calculations = useMemo(() => {
    // Default fallback params
    const defaultParams = {
      gender: goal?.assessment?.gender || 'Male',
      age: goal?.assessment?.age || 26,
      height: goal?.assessment?.height || 175,
      weight: goal?.assessment?.currentWeight || goal?.assessment?.weight || goal?.weight || 72,
      waist: goal?.assessment?.waist || 80,
      neck: goal?.assessment?.neck || 36,
      hip: goal?.assessment?.hip || 90,
      activityLevel: goal?.assessment?.activityLevel || goal?.activityLevel || 'Moderate',
      goal: goal?.type || 'Healthy Lifestyle'
    };

    return calculateHealthMetrics(defaultParams);
  }, [goal]);

  const saveGoal = async (form: any) => {
    // Put updated profile variables
    const { data: updatedUser } = await api.put('/users/me', form);
    if (updatedUser) {
      updateUser(updatedUser);
    }

    const computed = calculateHealthMetrics({
      gender: form.gender,
      age: form.age,
      height: form.height,
      weight: form.weight,
      waist: form.waist,
      neck: form.neck,
      hip: form.hip,
      activityLevel: form.activityLevel,
      goal: form.goal
    });

    const targetPayload = {
      type: form.goal,
      targetCalories: computed.dailyCalories,
      protein: computed.protein,
      carbs: computed.carbs,
      fat: computed.fat,
      waterIntake: computed.waterIntake,
      goalWeight: form.goalWeight,
      assessment: {
        fullName: form.name,
        name: form.name,
        height: form.height,
        weight: form.weight,
        currentWeight: form.weight,
        targetWeight: form.goalWeight,
        goalWeight: form.goalWeight,
        age: form.age,
        gender: form.gender,
        waist: form.waist,
        neck: form.neck,
        hip: form.hip
      }
    };

    const { data } = await api.post('/goals', targetPayload);
    if (data) {
      setGoal(data);
      if (data.metrics?.weightHistory) {
        setWeightLogs(data.metrics.weightHistory);
      }
    }

    // Dispatches storage update triggers
    const keys = ['nutrition-tracker-state-v3', 'nutrition-tracker-state-v2', 'nutrition_state'];
    keys.forEach(key => {
      const trackingState = localStorage.getItem(key);
      if (trackingState) {
        try {
          const parsed = JSON.parse(trackingState);
          parsed.weight = form.weight;
          parsed.bodyFat = computed.bodyFatPercent;
          parsed.waist = form.waist;
          parsed.neck = form.neck;
          parsed.hip = form.hip;
          parsed.leanBodyMass = computed.leanBodyMass;
          localStorage.setItem(key, JSON.stringify(parsed));
        } catch (e) {
          console.warn(e);
        }
      }
    });

    window.dispatchEvent(new Event('nutrition-update'));
  };

  const logWeightProgress = async (params: { weight: number; waist: number; neck: number; hip: number; chest: number }) => {
    const todayStr = new Date().toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    
    // Auto calculated values from Navy formulas
    const computed = calculateHealthMetrics({
      gender: goal?.assessment?.gender || 'Male',
      age: goal?.assessment?.age || 26,
      height: goal?.assessment?.height || 175,
      weight: params.weight,
      waist: params.waist,
      neck: params.neck,
      hip: params.hip,
      activityLevel: goal?.activityLevel || 'Moderate',
      goal: goal?.type || 'Healthy Lifestyle'
    });

    const newLog = {
      date: todayStr,
      weight: params.weight,
      bodyFat: computed.bodyFatPercent,
      waist: params.waist,
      neck: params.neck,
      hip: params.hip,
      chest: params.chest,
      leanBodyMass: computed.leanBodyMass
    };

    const updatedLogs = [...weightLogs, newLog].slice(-15);
    setWeightLogs(updatedLogs);

    if (goal) {
      const { data } = await api.post('/goals', {
        ...goal,
        targetCalories: computed.dailyCalories,
        protein: computed.protein,
        carbs: computed.carbs,
        fat: computed.fat,
        waterIntake: computed.waterIntake,
        metrics: {
          ...goal.metrics,
          weightHistory: updatedLogs
        }
      });
      if (data) {
        setGoal(data);
      }
    }

    try {
      const todayDate = new Date().toISOString().slice(0, 10);
      await api.post(`/progress/daily/${todayDate}`, { weight: params.weight });
    } catch (err) {
      console.warn('Failed to update daily weight log in database', err);
    }

    // Trigger local state updates
    const keys = ['nutrition-tracker-state-v3', 'nutrition-tracker-state-v2', 'nutrition_state'];
    keys.forEach(key => {
      const trackingState = localStorage.getItem(key);
      if (trackingState) {
        try {
          const parsed = JSON.parse(trackingState);
          parsed.weight = params.weight;
          parsed.bodyFat = computed.bodyFatPercent;
          parsed.waist = params.waist;
          parsed.neck = params.neck;
          parsed.hip = params.hip;
          parsed.leanBodyMass = computed.leanBodyMass;
          localStorage.setItem(key, JSON.stringify(parsed));
        } catch (e) {
          console.warn(e);
        }
      }
    });
    window.dispatchEvent(new Event('nutrition-update'));
  };

  return (
    <GoalContext.Provider value={{ goal, setGoal, refreshGoal, calculations, weightLogs, saveGoal, logWeightProgress }}>
      {children}
    </GoalContext.Provider>
  );
}

export function useGoal() {
  const context = useContext(GoalContext);
  if (!context) throw new Error('useGoal must be used within a GoalProvider');
  return context;
}
