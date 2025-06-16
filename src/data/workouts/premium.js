const premiumWorkouts = [
  {
    id: 'premium-1',
    name: 'Advanced Strength & Mobility',
    exercises: [
      {
        id: 'dumbbell-rows',
        name: 'Dumbbell Rows',
        description: 'Strengthen your back and improve posture',
        sets: 3,
        reps: 12,
        restSeconds: 60,
        focusAreas: ['Back', 'Shoulders']
      },
      {
        id: 'step-ups',
        name: 'Step-ups',
        description: 'Build leg strength and improve balance',
        sets: 3,
        reps: 10,
        restSeconds: 45,
        focusAreas: ['Legs', 'Balance']
      }
    ],
    focusAreas: ['Strength', 'Mobility'],
    estimatedDuration: 30
  }
];

export default premiumWorkouts;
