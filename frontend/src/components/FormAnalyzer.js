import React, { useState, useRef, useEffect } from 'react';
import { Pose } from '@mediapipe/pose';
import { Camera } from '@mediapipe/camera_utils';
import { drawConnectors, drawLandmarks } from '@mediapipe/drawing_utils';
import axios from 'axios';

function FormAnalyzer({ userId }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState('push-ups');
  const [formScore, setFormScore] = useState(null);
  const [feedback, setFeedback] = useState([]);
  const [camera, setCamera] = useState(null);
  const [pose, setPose] = useState(null);
  const [exercises, setExercises] = useState([]);

  useEffect(() => {
    fetchExercises();
  }, []);

  const fetchExercises = async () => {
    try {
      const response = await axios.get('/api/exercises');
      setExercises(response.data);
    } catch (error) {
      console.error('Error fetching exercises:', error);
    }
  };

  const startAnalysis = async () => {
    setIsAnalyzing(true);
    setFormScore(null);
    setFeedback([]);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      // Initialize MediaPipe Pose
      const poseInstance = new Pose({
        locateFile: (file) => {
          return `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`;
        }
      });

      poseInstance.setOptions({
        modelComplexity: 1,
        smoothLandmarks: true,
        enableSegmentation: false,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5
      });

      poseInstance.onResults(onPoseResults);
      setPose(poseInstance);

      // Initialize camera
      if (videoRef.current) {
        const cam = new Camera(videoRef.current, {
          onFrame: async () => {
            await poseInstance.send({ image: videoRef.current });
          },
          width: 640,
          height: 480
        });
        cam.start();
        setCamera(cam);
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      alert('Could not access camera. Please check permissions.');
      setIsAnalyzing(false);
    }
  };

  const onPoseResults = (results) => {
    if (!canvasRef.current || !results.poseLandmarks) return;

    const canvasCtx = canvasRef.current.getContext('2d');
    canvasCtx.save();
    canvasCtx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

    // Draw the pose landmarks
    drawConnectors(canvasCtx, results.poseLandmarks, Pose.POSE_CONNECTIONS, {
      color: '#00FF00',
      lineWidth: 4
    });
    drawLandmarks(canvasCtx, results.poseLandmarks, {
      color: '#FF0000',
      lineWidth: 2
    });

    canvasCtx.restore();

    // Send pose data to backend for analysis
    analyzePose(results.poseLandmarks);
  };

  const analyzePose = async (landmarks) => {
    try {
      const response = await axios.post('/api/analysis/analyze-pose', {
        exerciseName: selectedExercise,
        landmarks: landmarks,
        userId: userId
      });

      setFormScore(response.data.formScore);
      setFeedback(response.data.feedback);
    } catch (error) {
      console.error('Error analyzing pose:', error);
    }
  };

  const stopAnalysis = () => {
    if (camera) {
      camera.stop();
    }
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
    }
    setIsAnalyzing(false);
  };

  return (
    <div className="card">
      <h2>Form Analyzer</h2>
      <p style={{ color: '#666', marginBottom: '2rem' }}>
        Record yourself performing exercises and get real-time form feedback using AI pose estimation.
      </p>

      <div className="form-group">
        <label>Select Exercise</label>
        <select
          value={selectedExercise}
          onChange={(e) => setSelectedExercise(e.target.value)}
          disabled={isAnalyzing}
        >
          {exercises.map(ex => (
            <option key={ex.id} value={ex.name.toLowerCase()}>
              {ex.name}
            </option>
          ))}
        </select>
      </div>

      <div style={{ textAlign: 'center', margin: '2rem 0' }}>
        {!isAnalyzing ? (
          <button className="btn btn-primary" onClick={startAnalysis}>
            Start Camera & Analyze
          </button>
        ) : (
          <button className="btn btn-secondary" onClick={stopAnalysis}>
            Stop Analysis
          </button>
        )}
      </div>

      {isAnalyzing && (
        <div className="video-container">
          <div style={{ position: 'relative' }}>
            <video
              ref={videoRef}
              className="video-canvas"
              autoPlay
              playsInline
              style={{ display: 'none' }}
            />
            <canvas
              ref={canvasRef}
              className="video-canvas"
              width="640"
              height="480"
            />
          </div>

          {formScore !== null && (
            <div className="feedback-panel">
              <h3>Form Analysis</h3>
              <div style={{ marginBottom: '1rem' }}>
                <span className="form-score">
                  Score: {formScore}/100
                </span>
              </div>

              <h4>Feedback</h4>
              {feedback.length > 0 ? (
                feedback.map((item, idx) => (
                  <div key={idx} className="feedback-item">
                    {item.message}
                  </div>
                ))
              ) : (
                <p>Analyzing your form...</p>
              )}
            </div>
          )}
        </div>
      )}

      {selectedExercise && exercises.length > 0 && (
        <div style={{ marginTop: '2rem', padding: '1.5rem', background: '#f8f9fa', borderRadius: '12px' }}>
          <h3>Form Tips for {selectedExercise}</h3>
          {exercises.find(ex => ex.name.toLowerCase() === selectedExercise)?.formCues?.map((cue, idx) => (
            <div key={idx} style={{ padding: '0.5rem 0' }}>
              ✓ {cue}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default FormAnalyzer;
