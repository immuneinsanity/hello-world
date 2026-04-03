const express = require('express');
const router = express.Router();

// In-memory storage (replace with database in production)
let workouts = [];
let workoutIdCounter = 1;

// Generate a workout routine
router.post('/generate', (req, res) => {
  const { goal, duration, difficulty, muscleGroups } = req.body;

  const generatedWorkout = {
    id: workoutIdCounter++,
    name: `${goal} Workout - ${difficulty}`,
    goal,
    duration,
    difficulty,
    muscleGroups,
    exercises: generateExercises(goal, muscleGroups, difficulty),
    createdAt: new Date()
  };

  workouts.push(generatedWorkout);
  res.json(generatedWorkout);
});

// Get all workouts
router.get('/', (req, res) => {
  res.json(workouts);
});

// Get specific workout
router.get('/:id', (req, res) => {
  const workout = workouts.find(w => w.id === parseInt(req.params.id));
  if (!workout) {
    return res.status(404).json({ message: 'Workout not found' });
  }
  res.json(workout);
});

// Update workout
router.put('/:id', (req, res) => {
  const index = workouts.findIndex(w => w.id === parseInt(req.params.id));
  if (index === -1) {
    return res.status(404).json({ message: 'Workout not found' });
  }
  workouts[index] = { ...workouts[index], ...req.body, updatedAt: new Date() };
  res.json(workouts[index]);
});

// Delete workout
router.delete('/:id', (req, res) => {
  const index = workouts.findIndex(w => w.id === parseInt(req.params.id));
  if (index === -1) {
    return res.status(404).json({ message: 'Workout not found' });
  }
  workouts.splice(index, 1);
  res.json({ message: 'Workout deleted' });
});

// Helper function to generate exercises based on parameters
function generateExercises(goal, muscleGroups, difficulty) {
  const exerciseDatabase = {
    strength: {
      chest: [
        { name: 'Push-ups', sets: 3, reps: '10-15', restSeconds: 60 },
        { name: 'Bench Press', sets: 4, reps: '8-12', restSeconds: 90 },
        { name: 'Dumbbell Flyes', sets: 3, reps: '10-12', restSeconds: 60 }
      ],
      back: [
        { name: 'Pull-ups', sets: 3, reps: '8-12', restSeconds: 90 },
        { name: 'Bent-over Rows', sets: 4, reps: '10-12', restSeconds: 90 },
        { name: 'Lat Pulldowns', sets: 3, reps: '10-15', restSeconds: 60 }
      ],
      legs: [
        { name: 'Squats', sets: 4, reps: '10-15', restSeconds: 90 },
        { name: 'Lunges', sets: 3, reps: '12-15', restSeconds: 60 },
        { name: 'Leg Press', sets: 4, reps: '12-15', restSeconds: 90 }
      ],
      shoulders: [
        { name: 'Overhead Press', sets: 4, reps: '8-12', restSeconds: 90 },
        { name: 'Lateral Raises', sets: 3, reps: '12-15', restSeconds: 60 },
        { name: 'Front Raises', sets: 3, reps: '12-15', restSeconds: 60 }
      ],
      arms: [
        { name: 'Bicep Curls', sets: 3, reps: '10-15', restSeconds: 60 },
        { name: 'Tricep Dips', sets: 3, reps: '10-15', restSeconds: 60 },
        { name: 'Hammer Curls', sets: 3, reps: '10-12', restSeconds: 60 }
      ]
    },
    cardio: {
      fullBody: [
        { name: 'Burpees', sets: 3, reps: '15-20', restSeconds: 45 },
        { name: 'Mountain Climbers', sets: 3, reps: '20-30', restSeconds: 45 },
        { name: 'Jumping Jacks', sets: 3, reps: '30-40', restSeconds: 30 }
      ]
    }
  };

  const selectedExercises = [];
  const targetGroups = muscleGroups || ['chest', 'back', 'legs'];

  targetGroups.forEach(group => {
    const groupExercises = exerciseDatabase[goal]?.[group] || exerciseDatabase.strength[group] || [];
    if (groupExercises.length > 0) {
      selectedExercises.push(groupExercises[0]);
    }
  });

  return selectedExercises;
}

module.exports = router;
