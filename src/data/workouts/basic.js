const basicWorkouts = [
  {
    id: 'basic-1',
    name: 'Basic Strength & Balance',
    exercises: [
      {
        id: 'chair-squats',
        name: 'Chair Squats',
        description: 'Sit and stand from a chair to build leg strength',
        sets: 3,
        reps: 10,
        restSeconds: 60,
        focusAreas: ['Legs', 'Core']
      },
      {
        id: 'wall-pushups',
        name: 'Wall Push-ups',
        description: 'Push-ups against a wall to build upper body strength',
        sets: 3,
        reps: 12,
        restSeconds: 45,
        focusAreas: ['Chest', 'Arms']
      }
    ],
    focusAreas: ['Strength', 'Balance'],
    estimatedDuration: 20
  }
];

export { basicWorkouts };
