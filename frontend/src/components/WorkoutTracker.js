import React, { useState, useEffect } from 'react';
import axios from 'axios';

function WorkoutTracker({ userId }) {
  const [workouts, setWorkouts] = useState([]);
  const [activeSession, setActiveSession] = useState(null);
  const [currentExercise, setCurrentExercise] = useState({
    exerciseName: '',
    sets: []
  });

  useEffect(() => {
    fetchWorkouts();
  }, []);

  const fetchWorkouts = async () => {
    try {
      const response = await axios.get('/api/workouts');
      setWorkouts(response.data);
    } catch (error) {
      console.error('Error fetching workouts:', error);
    }
  };

  const startSession = async (workoutId) => {
    try {
      const response = await axios.post('/api/tracking/sessions', {
        workoutId,
        userId
      });
      setActiveSession(response.data);
    } catch (error) {
      console.error('Error starting session:', error);
    }
  };

  const logExercise = async () => {
    if (!currentExercise.exerciseName || currentExercise.sets.length === 0) {
      alert('Please enter exercise details');
      return;
    }

    try {
      const response = await axios.post(
        `/api/tracking/sessions/${activeSession.id}/exercises`,
        currentExercise
      );
      setActiveSession(response.data);
      setCurrentExercise({ exerciseName: '', sets: [] });
    } catch (error) {
      console.error('Error logging exercise:', error);
    }
  };

  const addSet = () => {
    const weight = prompt('Weight (lbs):');
    const reps = prompt('Reps:');
    if (weight && reps) {
      setCurrentExercise(prev => ({
        ...prev,
        sets: [...prev.sets, { weight: parseFloat(weight), reps: parseInt(reps) }]
      }));
    }
  };

  const completeSession = async () => {
    try {
      await axios.put(`/api/tracking/sessions/${activeSession.id}/complete`);
      alert('Workout completed!');
      setActiveSession(null);
      setCurrentExercise({ exerciseName: '', sets: [] });
    } catch (error) {
      console.error('Error completing session:', error);
    }
  };

  return (
    <div className="card">
      <h2>Track Your Workout</h2>

      {!activeSession ? (
        <div>
          <h3>Select a Workout to Start</h3>
          <div className="workout-list">
            {workouts.length === 0 ? (
              <p>No workouts available. Generate one first!</p>
            ) : (
              workouts.map(workout => (
                <div key={workout.id} className="workout-item">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <strong>{workout.name}</strong>
                      <p style={{ margin: '0.5rem 0', color: '#666' }}>
                        {workout.exercises.length} exercises
                      </p>
                    </div>
                    <button
                      className="btn btn-primary"
                      onClick={() => startSession(workout.id)}
                    >
                      Start
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      ) : (
        <div>
          <h3>Active Session</h3>
          <p style={{ color: '#666' }}>Session #{activeSession.id}</p>

          <div style={{ marginTop: '2rem' }}>
            <h4>Log Exercise</h4>
            <div className="form-group">
              <label>Exercise Name</label>
              <input
                type="text"
                value={currentExercise.exerciseName}
                onChange={(e) => setCurrentExercise({ ...currentExercise, exerciseName: e.target.value })}
                placeholder="e.g., Bench Press"
              />
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <button className="btn btn-secondary" onClick={addSet}>
                Add Set
              </button>
              {currentExercise.sets.length > 0 && (
                <div style={{ marginTop: '1rem' }}>
                  <strong>Sets:</strong>
                  {currentExercise.sets.map((set, idx) => (
                    <div key={idx} style={{ marginLeft: '1rem' }}>
                      Set {idx + 1}: {set.weight} lbs × {set.reps} reps
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button className="btn btn-primary" onClick={logExercise}>
              Log Exercise
            </button>
          </div>

          {activeSession.exercises.length > 0 && (
            <div style={{ marginTop: '2rem' }}>
              <h4>Completed Exercises</h4>
              {activeSession.exercises.map((ex, idx) => (
                <div key={idx} className="exercise-item">
                  <strong>{ex.exerciseName}</strong>
                  <p>{ex.sets.length} sets completed</p>
                </div>
              ))}
            </div>
          )}

          <button
            className="btn btn-primary"
            onClick={completeSession}
            style={{ marginTop: '2rem' }}
          >
            Complete Workout
          </button>
        </div>
      )}
    </div>
  );
}

export default WorkoutTracker;
