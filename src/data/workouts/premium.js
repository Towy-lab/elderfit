const premiumWorkouts = [
  {
    id: 'premium-1',
    name: 'Advanced Strength & Mobility',
    exercises: [
      {
        id: 'bodyweight-squats',
        name: 'Bodyweight Squats',
        description: 'Full range of motion squats for leg strength',
        sets: 4,
        reps: 15,
        restSeconds: 60,
        focusAreas: ['Legs', 'Core']
      },
      {
        id: 'pushups',
        name: 'Push-ups',
        description: 'Standard push-ups for upper body strength',
        sets: 3,
        reps: 10,
        restSeconds: 60,
        focusAreas: ['Chest', 'Arms']
      }
    ],
    focusAreas: ['Strength', 'Mobility'],
    estimatedDuration: 30
  }
];

export { premiumWorkouts };
