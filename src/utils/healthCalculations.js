export const calculateBMI = (heightCm, weightKg) => {
  const heightM = heightCm / 100;
  return weightKg / (heightM * heightM);
};

export const getAgeGroup = (age) => {
  if (age < 55) return 'UNDER_55';
  if (age < 65) return 'SENIOR_55_65';
  if (age < 75) return 'SENIOR_65_75';
  return 'SENIOR_75_PLUS';
};

export const calculateBMR = (weightKg, heightCm, age, gender) => {
  // Mifflin-St Jeor Equation
  if (gender === 'male') {
    return 10 * weightKg + 6.25 * heightCm - 5 * age + 5;
  } else {
    return 10 * weightKg + 6.25 * heightCm - 5 * age - 161;
  }
};

export const calculateTDEE = (bmr, activityLevel) => {
  const activityMultipliers = {
    sedentary: 1.2,
    lightlyActive: 1.375,
    moderatelyActive: 1.55,
    veryActive: 1.725,
    extremelyActive: 1.9
  };
  return bmr * (activityMultipliers[activityLevel] || 1.2);
};

export const calculateHeartRateZones = (age, restingHR = 60) => {
  const maxHR = 220 - age;
  return {
    zone1: Math.round((maxHR - restingHR) * 0.5 + restingHR),
    zone2: Math.round((maxHR - restingHR) * 0.6 + restingHR),
    zone3: Math.round((maxHR - restingHR) * 0.7 + restingHR),
    zone4: Math.round((maxHR - restingHR) * 0.8 + restingHR),
    zone5: Math.round((maxHR - restingHR) * 0.9 + restingHR)
  };
};

export const calculateBodyFatPercentage = (bmi, age, gender) => {
  // Simplified calculation - in practice, use more accurate methods
  let basePercentage = gender === 'male' ? 15 : 25;
  basePercentage += (bmi - 22) * 0.5;
  basePercentage += (age - 30) * 0.1;
  return Math.max(5, Math.min(50, basePercentage));
};

export const calculateMuscleMass = (weightKg, bodyFatPercentage) => {
  const leanMass = weightKg * (1 - bodyFatPercentage / 100);
  return leanMass * 0.8; // Approximate muscle mass percentage
};

export const calculateBoneDensity = (age, gender, weightKg) => {
  // Simplified calculation - in practice, use DEXA scan results
  let baseDensity = gender === 'male' ? 1.2 : 1.1;
  baseDensity -= (age - 30) * 0.005;
  return Math.max(0.8, baseDensity);
};

export const calculateFlexibilityScore = (rangeOfMotion) => {
  // Simplified flexibility scoring
  return Math.min(100, rangeOfMotion.reduce((sum, rom) => sum + rom, 0) / rangeOfMotion.length);
};

export const calculateBalanceScore = (balanceTests) => {
  // Simplified balance scoring
  return Math.min(100, balanceTests.reduce((sum, test) => sum + test.score, 0) / balanceTests.length);
};

export const calculateStrengthScore = (strengthTests) => {
  // Simplified strength scoring
  return Math.min(100, strengthTests.reduce((sum, test) => sum + test.score, 0) / strengthTests.length);
};

export const calculateEnduranceScore = (enduranceTests) => {
  // Simplified endurance scoring
  return Math.min(100, enduranceTests.reduce((sum, test) => sum + test.score, 0) / enduranceTests.length);
};

export const calculateOverallFitnessScore = (flexibility, balance, strength, endurance) => {
  return (flexibility + balance + strength + endurance) / 4;
};
