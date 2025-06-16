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
