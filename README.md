# Workout Form Analyzer

A comprehensive fitness application that generates personalized workout routines, tracks your progress, and analyzes your exercise form in real-time using AI-powered pose estimation.

## Features

### 🏋️ Workout Generation
- Generate customized workout routines based on your goals
- Select target muscle groups and difficulty levels
- Pre-built exercise database with proper form instructions

### 📊 Workout Tracking
- Track your workout sessions in real-time
- Log sets, reps, and weights for each exercise
- View workout history and statistics
- Monitor your progress over time

### 🎥 AI Form Analysis
- Real-time video recording and pose detection
- AI-powered form analysis using MediaPipe Pose
- Instant feedback on exercise form
- Form scoring (0-100) with specific improvement suggestions
- Exercise-specific form cues and common mistakes

### 📈 Dashboard
- View workout statistics and progress
- Track total workouts, duration, and average form scores
- Weekly workout summaries
- Recent session history

## Tech Stack

**Frontend:**
- React 18
- React Router for navigation
- Axios for API calls
- MediaPipe Pose for real-time pose estimation
- Responsive CSS with modern gradients

**Backend:**
- Node.js & Express
- RESTful API architecture
- In-memory data storage (easily extensible to MongoDB)
- Multer for video file uploads

## Installation

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd hello-world
   ```

2. **Install all dependencies**
   ```bash
   npm run install-all
   ```

   This will install dependencies for both frontend and backend.

3. **Set up environment variables**
   ```bash
   cd backend
   cp .env.example .env
   ```
   Edit `.env` if needed (default port is 5000).

4. **Run the application**

   **Option 1: Run both frontend and backend together**
   ```bash
   npm run dev
   ```

   **Option 2: Run separately**

   Terminal 1 (Backend):
   ```bash
   cd backend
   npm run dev
   ```

   Terminal 2 (Frontend):
   ```bash
   cd frontend
   npm start
   ```

5. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## Usage

### Generate a Workout
1. Navigate to "Generate Workout"
2. Select your fitness goal (strength, cardio, etc.)
3. Choose duration and difficulty level
4. Select target muscle groups
5. Click "Generate Workout" to get a customized routine

### Track Your Workout
1. Navigate to "Track Workout"
2. Select a generated workout to start a session
3. Log each exercise with sets, weight, and reps
4. Complete the workout when finished

### Analyze Your Form
1. Navigate to "Form Analyzer"
2. Select the exercise you want to analyze
3. Click "Start Camera & Analyze"
4. Allow camera access when prompted
5. Perform the exercise and get real-time feedback
6. View your form score and improvement suggestions

## API Endpoints

### Workouts
- `POST /api/workouts/generate` - Generate a new workout routine
- `GET /api/workouts` - Get all workouts
- `GET /api/workouts/:id` - Get specific workout
- `PUT /api/workouts/:id` - Update workout
- `DELETE /api/workouts/:id` - Delete workout

### Exercises
- `GET /api/exercises` - Get all exercises (with optional filters)
- `GET /api/exercises/:id` - Get specific exercise
- `GET /api/exercises/search/:name` - Search exercise by name

### Tracking
- `POST /api/tracking/sessions` - Start a new workout session
- `POST /api/tracking/sessions/:sessionId/exercises` - Log an exercise
- `PUT /api/tracking/sessions/:sessionId/complete` - Complete a session
- `GET /api/tracking/sessions/user/:userId` - Get user's sessions
- `GET /api/tracking/stats/:userId` - Get workout statistics

### Analysis
- `POST /api/analysis/analyze-pose` - Analyze pose data from frontend
- `POST /api/analysis/upload-video` - Upload video for analysis
- `GET /api/analysis/history/:userId` - Get analysis history

## Exercise Library

The app includes a comprehensive exercise library with:
- Push-ups (chest, triceps, shoulders)
- Squats (quads, glutes, hamstrings)
- Burpees (full-body cardio)
- Pull-ups (back, biceps)
- Lunges (quads, glutes)
- And more...

Each exercise includes:
- Difficulty level
- Target muscle groups
- Required equipment
- Detailed form cues
- Common mistakes to avoid

## Form Analysis Technology

The app uses **MediaPipe Pose**, a state-of-the-art machine learning solution for pose estimation. It:
- Detects 33 body landmarks in real-time
- Works entirely in the browser (privacy-first)
- Provides accurate skeletal tracking
- Enables form analysis without sending video to servers

## Future Enhancements

- MongoDB integration for persistent data storage
- User authentication and profiles
- Social features (share workouts, challenges)
- Advanced ML models for more accurate form analysis
- Mobile app versions (React Native)
- Integration with fitness wearables
- Nutrition tracking
- Progress photos and measurements
- Custom exercise creation

## Contributing

Feel free to submit issues and enhancement requests!

## License

MIT

---

**Note:** Make sure to allow camera access when using the Form Analyzer feature. The video feed stays local to your browser for privacy.
