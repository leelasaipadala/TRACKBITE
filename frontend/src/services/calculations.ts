export interface HealthCalculations {
  bmi: number;
  bmr: number;
  tdee: number;
  bodyFatPercent: number;
  leanBodyMass: number;
  fatMass: number;
  idealWeight: number;
  healthyWeightMin: number;
  healthyWeightMax: number;
  dailyCalories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  waterIntake: number;
}

/**
 * Calculates all fitness/health metrics based on parameters
 * Height, weight, waist, neck, hip in metric (cm, kg)
 */
export function calculateHealthMetrics(params: {
  gender: string;
  age: number;
  height: number;
  weight: number;
  waist: number;
  neck: number;
  hip?: number;
  activityLevel: string;
  goal: string;
}): HealthCalculations {
  const genderLower = (params.gender || 'male').toLowerCase();
  const height = params.height || 170;
  const weight = params.weight || 70;
  const age = params.age || 25;
  const waist = params.waist || 80;
  const neck = params.neck || 36;
  const hip = params.hip || 90;
  const goalLower = (params.goal || 'healthy lifestyle').toLowerCase();

  // 1. BMI = weight_kg / (height_m ^ 2)
  const bmi = weight / Math.pow(height / 100, 2);

  // 2. BMR (Mifflin-St Jeor)
  let bmr = 0;
  if (genderLower === 'male') {
    bmr = 10 * weight + 6.25 * height - 5 * age + 5;
  } else {
    bmr = 10 * weight + 6.25 * height - 5 * age - 161;
  }

  // 3. TDEE
  let multiplier = 1.2;
  const act = params.activityLevel.toLowerCase();
  if (act.includes('sedentary')) multiplier = 1.2;
  else if (act.includes('light')) multiplier = 1.375;
  else if (act.includes('mod')) multiplier = 1.55;
  else if (act.includes('very')) multiplier = 1.725;
  else if (act.includes('extra')) multiplier = 1.9;

  const tdee = bmr * multiplier;

  // 4. Body Fat % (U.S. Navy Formula)
  let bodyFatPercent = 15; // default fallback
  if (genderLower === 'male') {
    if (waist > neck) {
      // Metric formula: 495 / (1.0324 - 0.19077 * log10(waist - neck) + 0.15456 * log10(height)) - 450
      const logDiff = Math.log10(waist - neck);
      const logHeight = Math.log10(height);
      const val = 1.0324 - 0.19077 * logDiff + 0.15456 * logHeight;
      bodyFatPercent = 495 / val - 450;
    }
  } else {
    // Female: 495 / (1.29579 - 0.35004 * log10(waist + hip - neck) + 0.22100 * log10(height)) - 450
    const waistHipDiff = waist + hip - neck;
    if (waistHipDiff > 0) {
      const logDiff = Math.log10(waistHipDiff);
      const logHeight = Math.log10(height);
      const val = 1.29579 - 0.35004 * logDiff + 0.22100 * logHeight;
      bodyFatPercent = 495 / val - 450;
    }
  }

  // Sanitize Body Fat % boundaries
  if (isNaN(bodyFatPercent) || bodyFatPercent < 2) {
    bodyFatPercent = genderLower === 'male' ? 12 : 22;
  }
  if (bodyFatPercent > 65) bodyFatPercent = 45;

  // 5. Lean Body Mass & Fat Mass
  const fatMass = weight * (bodyFatPercent / 100);
  const leanBodyMass = weight - fatMass;

  // 6. Ideal Weight (Devine Formula)
  // height in inches
  const heightInches = height / 2.54;
  let idealWeight = 50;
  if (genderLower === 'male') {
    idealWeight = 50.0 + 2.3 * Math.max(0, heightInches - 60);
  } else {
    idealWeight = 45.5 + 2.3 * Math.max(0, heightInches - 60);
  }

  // 7. Healthy Weight Range (BMI 18.5 - 24.9)
  const healthyWeightMin = 18.5 * Math.pow(height / 100, 2);
  const healthyWeightMax = 24.9 * Math.pow(height / 100, 2);

  // 8. Daily Calories Target Calculation
  let dailyCalories = tdee;
  if (
    goalLower.includes('bulk') ||
    goalLower.includes('surplus') ||
    (goalLower.includes('gain') && !goalLower.includes('loss'))
  ) {
    // Calorie Surplus for Weight Gain, Lean Bulk, Muscle Gain
    if (goalLower.includes('lean')) {
      dailyCalories = tdee + 350;
    } else {
      dailyCalories = tdee + 400;
    }
  } else if (
    goalLower.includes('loss') ||
    goalLower.includes('deficit') ||
    goalLower.includes('cut')
  ) {
    // Calorie Deficit for Weight Loss, Fat Loss
    dailyCalories = tdee - 500;
  } else {
    // Maintenance for Healthy Lifestyle, Body Recomposition, Maintain Weight
    dailyCalories = tdee;
  }
  if (dailyCalories < 1200) dailyCalories = 1200;

  // 9. Macros Targets
  // Protein: 2.0g per kg
  let protein = weight * 2.0;
  if (goalLower.includes('gain') || goalLower.includes('bulk')) {
    protein = weight * 2.2;
  }
  // Fat: 25% of daily calories
  let fat = (dailyCalories * 0.25) / 9;
  // Carbs: remaining calories
  let carbs = (dailyCalories - (protein * 4) - (fat * 9)) / 4;

  if (carbs < 50) {
    carbs = 50;
    fat = (dailyCalories - (protein * 4) - (carbs * 4)) / 9;
  }

  // 10. Fiber: 14g per 1000 kcal
  const fiber = (dailyCalories / 1000) * 14;

  // 11. Water: 35ml per kg of weight
  const waterIntake = weight * 0.035;

  return {
    bmi: Number(bmi.toFixed(1)),
    bmr: Math.round(bmr),
    tdee: Math.round(tdee),
    bodyFatPercent: Number(bodyFatPercent.toFixed(1)),
    leanBodyMass: Number(leanBodyMass.toFixed(1)),
    fatMass: Number(fatMass.toFixed(1)),
    idealWeight: Number(idealWeight.toFixed(1)),
    healthyWeightMin: Number(healthyWeightMin.toFixed(1)),
    healthyWeightMax: Number(healthyWeightMax.toFixed(1)),
    dailyCalories: Math.round(dailyCalories),
    protein: Math.round(protein),
    carbs: Math.round(carbs),
    fat: Math.round(fat),
    fiber: Math.round(fiber),
    waterIntake: Number(waterIntake.toFixed(2))
  };
}
