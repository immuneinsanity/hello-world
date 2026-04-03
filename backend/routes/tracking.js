const express = require('express');
const router = express.Router();

// In-memory storage for workout sessions
let workoutSessions = [];
let sessionIdCounter = 1;

// Start a new workout session
router.post('/sessions', (req, res) => {
  const { workoutId, userId } = req.body;

  const session = {
    id: sessionIdCounter++,
    workoutId,
    userId,
    startTime: new Date(),
    exercises: [],
    status: 'in-progress'
  };

  workoutSessions.push(session);
  res.json(session);
});

// Log an exercise within a session
router.post('/sessions/:sessionId/exercises', (req, res) => {
  const sessionId = parseInt(req.params.sessionId);
  const session = workoutSessions.find(s => s.id === sessionId);

  if (!session) {
    return res.status(404).json({ message: 'Session not found' });
  }

  const exerciseLog = {
    exerciseName: req.body.exerciseName,
    sets: req.body.sets || [],
    completedAt: new Date(),
    formScore: req.body.formScore,
    notes: req.body.notes
  };

  session.exercises.push(exerciseLog);
  res.json(session);
});

// Complete a workout session
router.put('/sessions/:sessionId/complete', (req, res) => {
  const sessionId = parseInt(req.params.sessionId);
  const session = workoutSessions.find(s => s.id === sessionId);

  if (!session) {
    return res.status(404).json({ message: 'Session not found' });
  }

  session.status = 'completed';
  session.endTime = new Date();
  session.duration = (session.endTime - session.startTime) / 1000 / 60; // minutes

  res.json(session);
});

// Get all sessions for a user
router.get('/sessions/user/:userId', (req, res) => {
  const userSessions = workoutSessions.filter(
    s => s.userId === req.params.userId
  );
  res.json(userSessions);
});

// Get specific session
router.get('/sessions/:sessionId', (req, res) => {
  const session = workoutSessions.find(
    s => s.id === parseInt(req.params.sessionId)
  );

  if (!session) {
    return res.status(404).json({ message: 'Session not found' });
  }

  res.json(session);
});

// Get workout statistics
router.get('/stats/:userId', (req, res) => {
  const userSessions = workoutSessions.filter(
    s => s.userId === req.params.userId && s.status === 'completed'
  );

  const stats = {
    totalWorkouts: userSessions.length,
    totalDuration: userSessions.reduce((sum, s) => sum + (s.duration || 0), 0),
    averageFormScore: calculateAverageFormScore(userSessions),
    workoutsByWeek: groupByWeek(userSessions)
  };

  res.json(stats);
});

function calculateAverageFormScore(sessions) {
  let totalScore = 0;
  let count = 0;

  sessions.forEach(session => {
    session.exercises.forEach(exercise => {
      if (exercise.formScore) {
        totalScore += exercise.formScore;
        count++;
      }
    });
  });

  return count > 0 ? totalScore / count : 0;
}

function groupByWeek(sessions) {
  const weeks = {};

  sessions.forEach(session => {
    const date = new Date(session.startTime);
    const weekStart = new Date(date.setDate(date.getDate() - date.getDay()));
    const weekKey = weekStart.toISOString().split('T')[0];

    weeks[weekKey] = (weeks[weekKey] || 0) + 1;
  });

  return weeks;
}

module.exports = router;
