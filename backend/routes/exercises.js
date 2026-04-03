const express = require('express');
const router = express.Router();

// Exercise library with form cues
const exerciseLibrary = [
  {
    id: 1,
    name: 'Push-ups',
    category: 'chest',
    difficulty: 'beginner',
    muscleGroups: ['chest', 'triceps', 'shoulders'],
    equipment: 'bodyweight',
    formCues: [
      'Keep body in straight line from head to heels',
      'Hands slightly wider than shoulder-width',
      'Lower until chest nearly touches floor',
      'Keep elbows at 45-degree angle',
      'Engage core throughout movement'
    ],
    commonMistakes: [
      'Sagging hips',
      'Flaring elbows too wide',
      'Not going deep enough',
      'Head dropping or jutting forward'
    ]
  },
  {
    id: 2,
    name: 'Squats',
    category: 'legs',
    difficulty: 'beginner',
    muscleGroups: ['quads', 'glutes', 'hamstrings'],
    equipment: 'bodyweight',
    formCues: [
      'Feet shoulder-width apart',
      'Chest up, core engaged',
      'Knees track over toes',
      'Lower until thighs parallel to ground',
      'Drive through heels to stand'
    ],
    commonMistakes: [
      'Knees caving inward',
      'Heels lifting off ground',
      'Rounding lower back',
      'Not reaching proper depth'
    ]
  },
  {
    id: 3,
    name: 'Burpees',
    category: 'cardio',
    difficulty: 'intermediate',
    muscleGroups: ['fullBody'],
    equipment: 'bodyweight',
    formCues: [
      'Start standing, drop to plank position',
      'Perform push-up',
      'Jump feet to hands',
      'Explosive jump with arms overhead',
      'Land softly and repeat'
    ],
    commonMistakes: [
      'Skipping the push-up',
      'Landing heavily',
      'Poor plank position',
      'Rushing through movement'
    ]
  },
  {
    id: 4,
    name: 'Pull-ups',
    category: 'back',
    difficulty: 'intermediate',
    muscleGroups: ['back', 'biceps'],
    equipment: 'pull-up bar',
    formCues: [
      'Grip bar slightly wider than shoulders',
      'Start from dead hang',
      'Pull until chin over bar',
      'Lower with control',
      'Avoid swinging or kipping'
    ],
    commonMistakes: [
      'Using momentum',
      'Not achieving full range of motion',
      'Shrugging shoulders',
      'Crossing legs excessively'
    ]
  },
  {
    id: 5,
    name: 'Lunges',
    category: 'legs',
    difficulty: 'beginner',
    muscleGroups: ['quads', 'glutes'],
    equipment: 'bodyweight',
    formCues: [
      'Step forward into split stance',
      'Lower back knee toward ground',
      'Keep front knee over ankle',
      'Torso upright',
      'Push through front heel to return'
    ],
    commonMistakes: [
      'Front knee past toes',
      'Leaning too far forward',
      'Short range of motion',
      'Poor balance'
    ]
  }
];

// Get all exercises
router.get('/', (req, res) => {
  const { category, difficulty } = req.query;
  let filtered = exerciseLibrary;

  if (category) {
    filtered = filtered.filter(ex => ex.category === category);
  }
  if (difficulty) {
    filtered = filtered.filter(ex => ex.difficulty === difficulty);
  }

  res.json(filtered);
});

// Get specific exercise
router.get('/:id', (req, res) => {
  const exercise = exerciseLibrary.find(ex => ex.id === parseInt(req.params.id));
  if (!exercise) {
    return res.status(404).json({ message: 'Exercise not found' });
  }
  res.json(exercise);
});

// Get exercise by name
router.get('/search/:name', (req, res) => {
  const exercise = exerciseLibrary.find(
    ex => ex.name.toLowerCase() === req.params.name.toLowerCase()
  );
  if (!exercise) {
    return res.status(404).json({ message: 'Exercise not found' });
  }
  res.json(exercise);
});

module.exports = router;
