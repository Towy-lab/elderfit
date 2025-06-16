const eliteWorkouts = [
  {
    id: 'elite-1',
    name: 'Elite Strength & Conditioning',
    exercises: [
      {
        id: 'kettlebell-swings',
        name: 'Kettlebell Swings',
        description: 'Full body exercise for strength and power',
        sets: 3,
        reps: 15,
        restSeconds: 60,
        focusAreas: ['Full Body', 'Power']
      },
      {
        id: 'box-jumps',
        name: 'Box Jumps',
        description: 'Explosive lower body exercise',
        sets: 3,
        reps: 8,
        restSeconds: 90,
        focusAreas: ['Legs', 'Power']
      }
    ],
    focusAreas: ['Strength', 'Power'],
    estimatedDuration: 45
  }
];

export default eliteWorkouts;
