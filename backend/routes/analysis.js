const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

// Configure multer for video uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/videos/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /mp4|mov|avi|webm/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(new Error('Invalid file type. Only video files are allowed.'));
  }
});

// Store analysis results
let analysisResults = [];
let analysisIdCounter = 1;

// Analyze form from pose data (sent from frontend)
router.post('/analyze-pose', (req, res) => {
  const { exerciseName, landmarks, userId } = req.body;

  const analysis = {
    id: analysisIdCounter++,
    userId,
    exerciseName,
    timestamp: new Date(),
    formScore: calculateFormScore(exerciseName, landmarks),
    feedback: generateFormFeedback(exerciseName, landmarks),
    keyPoints: landmarks
  };

  analysisResults.push(analysis);
  res.json(analysis);
});

// Upload video for analysis
router.post('/upload-video', upload.single('video'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No video file uploaded' });
  }

  const videoAnalysis = {
    id: analysisIdCounter++,
    userId: req.body.userId,
    exerciseName: req.body.exerciseName,
    videoPath: req.file.path,
    timestamp: new Date(),
    status: 'pending',
    message: 'Video uploaded successfully. Analysis will be performed client-side using MediaPipe.'
  };

  analysisResults.push(videoAnalysis);
  res.json(videoAnalysis);
});

// Get analysis history
router.get('/history/:userId', (req, res) => {
  const userAnalyses = analysisResults.filter(a => a.userId === req.params.userId);
  res.json(userAnalyses);
});

// Get specific analysis
router.get('/:analysisId', (req, res) => {
  const analysis = analysisResults.find(a => a.id === parseInt(req.params.analysisId));

  if (!analysis) {
    return res.status(404).json({ message: 'Analysis not found' });
  }

  res.json(analysis);
});

// Form analysis helper functions
function calculateFormScore(exerciseName, landmarks) {
  // Basic scoring algorithm based on pose landmarks
  // In production, this would use ML models and more sophisticated analysis

  if (!landmarks || landmarks.length === 0) {
    return 0;
  }

  let score = 80; // Base score

  // Exercise-specific checks
  switch (exerciseName.toLowerCase()) {
    case 'push-ups':
      score = analyzePushUpForm(landmarks);
      break;
    case 'squats':
      score = analyzeSquatForm(landmarks);
      break;
    default:
      score = 75; // Default score for exercises without specific analysis
  }

  return Math.max(0, Math.min(100, score));
}

function analyzePushUpForm(landmarks) {
  let score = 100;

  // Check body alignment (simplified)
  // In real implementation, calculate angles between joints
  // Deduct points for common mistakes

  return score;
}

function analyzeSquatForm(landmarks) {
  let score = 100;

  // Check knee tracking, depth, back position
  // In real implementation, use landmark positions to calculate

  return score;
}

function generateFormFeedback(exerciseName, landmarks) {
  const feedback = [];

  // Generate specific feedback based on exercise and detected issues
  const exerciseFeedback = {
    'push-ups': [
      { issue: 'body_alignment', message: 'Keep your body in a straight line' },
      { issue: 'elbow_angle', message: 'Maintain 45-degree elbow angle' },
      { issue: 'depth', message: 'Lower your chest closer to the ground' }
    ],
    'squats': [
      { issue: 'knee_tracking', message: 'Keep knees aligned with toes' },
      { issue: 'depth', message: 'Aim for thighs parallel to ground' },
      { issue: 'back_position', message: 'Keep chest up and back neutral' }
    ]
  };

  const exerciseKey = exerciseName.toLowerCase();
  if (exerciseFeedback[exerciseKey]) {
    // In production, analyze landmarks to determine which feedback applies
    return exerciseFeedback[exerciseKey].slice(0, 2);
  }

  return [{ issue: 'general', message: 'Focus on controlled movement and proper breathing' }];
}

module.exports = router;
