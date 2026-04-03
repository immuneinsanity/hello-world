import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Dashboard({ userId }) {
  const [stats, setStats] = useState({
    totalWorkouts: 0,
    totalDuration: 0,
    averageFormScore: 0,
    workoutsByWeek: {}
  });
  const [recentSessions, setRecentSessions] = useState([]);

  useEffect(() => {
    fetchStats();
    fetchRecentSessions();
  }, [userId]);

  const fetchStats = async () => {
    try {
      const response = await axios.get(`/api/tracking/stats/${userId}`);
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const fetchRecentSessions = async () => {
    try {
      const response = await axios.get(`/api/tracking/sessions/user/${userId}`);
      setRecentSessions(response.data.slice(-5).reverse());
    } catch (error) {
      console.error('Error fetching sessions:', error);
    }
  };

  return (
    <div className="card">
      <h2>Your Fitness Dashboard</h2>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">Total Workouts</div>
          <div className="stat-value">{stats.totalWorkouts}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Total Minutes</div>
          <div className="stat-value">{Math.round(stats.totalDuration)}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Avg Form Score</div>
          <div className="stat-value">{Math.round(stats.averageFormScore)}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">This Week</div>
          <div className="stat-value">
            {Object.values(stats.workoutsByWeek).reduce((a, b) => a + b, 0)}
          </div>
        </div>
      </div>

      <h3 style={{ marginTop: '2rem' }}>Recent Sessions</h3>
      <div className="workout-list">
        {recentSessions.length === 0 ? (
          <p>No workout sessions yet. Start by generating a workout!</p>
        ) : (
          recentSessions.map(session => (
            <div key={session.id} className="workout-item">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <strong>Session #{session.id}</strong>
                  <p style={{ margin: '0.5rem 0', color: '#666' }}>
                    {session.exercises.length} exercises completed
                  </p>
                  <p style={{ margin: 0, fontSize: '0.9rem', color: '#999' }}>
                    {new Date(session.startTime).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <span className={`badge ${session.status === 'completed' ? 'badge-success' : 'badge-warning'}`}>
                    {session.status}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Dashboard;
