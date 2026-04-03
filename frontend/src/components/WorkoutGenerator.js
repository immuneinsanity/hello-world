import React, { useState } from 'react';
import axios from 'axios';

function WorkoutGenerator({ userId }) {
  const [formData, setFormData] = useState({
    goal: 'strength',
    duration: 30,
    difficulty: 'beginner',
    muscleGroups: []
  });
  const [generatedWorkout, setGeneratedWorkout] = useState(null);
  const [loading, setLoading] = useState(false);

  const muscleGroupOptions = ['chest', 'back', 'legs', 'shoulders', 'arms'];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleMuscleGroupChange = (group) => {
    setFormData(prev => ({
      ...prev,
      muscleGroups: prev.muscleGroups.includes(group)
        ? prev.muscleGroups.filter(g => g !== group)
        : [...prev.muscleGroups, group]
    }));
  };

  const generateWorkout = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post('/api/workouts/generate', formData);
      setGeneratedWorkout(response.data);
    } catch (error) {
      console.error('Error generating workout:', error);
      alert('Failed to generate workout. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h2>Generate Your Workout</h2>

      <form onSubmit={generateWorkout}>
        <div className="form-group">
          <label>Goal</label>
          <select name="goal" value={formData.goal} onChange={handleInputChange}>
            <option value="strength">Strength Training</option>
            <option value="cardio">Cardio</option>
            <option value="flexibility">Flexibility</option>
            <option value="endurance">Endurance</option>
          </select>
        </div>

        <div className="form-group">
          <label>Duration (minutes)</label>
          <input
            type="number"
            name="duration"
            value={formData.duration}
            onChange={handleInputChange}
            min="10"
            max="120"
          />
        </div>

        <div className="form-group">
          <label>Difficulty</label>
          <select name="difficulty" value={formData.difficulty} onChange={handleInputChange}>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>

        <div className="form-group">
          <label>Target Muscle Groups</label>
          <div className="checkbox-group">
            {muscleGroupOptions.map(group => (
              <label key={group} className="checkbox-label">
                <input
                  type="checkbox"
                  checked={formData.muscleGroups.includes(group)}
                  onChange={() => handleMuscleGroupChange(group)}
                />
                {group.charAt(0).toUpperCase() + group.slice(1)}
              </label>
            ))}
          </div>
        </div>

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Generating...' : 'Generate Workout'}
        </button>
      </form>

      {generatedWorkout && (
        <div className="workout-list">
          <h3>{generatedWorkout.name}</h3>
          <p style={{ color: '#666', marginBottom: '1rem' }}>
            Duration: {generatedWorkout.duration} minutes | Difficulty: {generatedWorkout.difficulty}
          </p>

          {generatedWorkout.exercises.map((exercise, index) => (
            <div key={index} className="exercise-item">
              <h4>{exercise.name}</h4>
              <p>Sets: {exercise.sets} | Reps: {exercise.reps}</p>
              <p style={{ fontSize: '0.9rem', color: '#666' }}>
                Rest: {exercise.restSeconds} seconds
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default WorkoutGenerator;
