const eliteWorkouts = [
  {
    id: 'elite-1',
    name: 'Elite Performance & Recovery',
    exercises: [
      {
        id: 'weighted-squats',
        name: 'Weighted Squats',
        description: 'Squats with added resistance for maximum strength',
        sets: 5,
        reps: 12,
        restSeconds: 90,
        focusAreas: ['Legs', 'Core']
      },
      {
        id: 'diamond-pushups',
        name: 'Diamond Push-ups',
        description: 'Advanced push-ups for upper body power',
        sets: 4,
        reps: 15,
        restSeconds: 75,
        focusAreas: ['Chest', 'Arms']
      }
    ],
    focusAreas: ['Performance', 'Recovery'],
    estimatedDuration: 45
  }
];

export { eliteWorkouts };
