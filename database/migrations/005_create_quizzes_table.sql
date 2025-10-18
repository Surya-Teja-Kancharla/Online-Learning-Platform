-- Migration: Create Lessons, Quizzes, and Progress Tracking Tables
-- Description: Adds tables for course content, quizzes, and student progress

-- ============================================
-- LESSONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS lessons (
  id SERIAL PRIMARY KEY,
  course_id INTEGER NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  content_type VARCHAR(50) NOT NULL, -- 'video', 'pdf', 'text', 'quiz'
  content_url TEXT,
  video_provider VARCHAR(50), -- 'youtube', 'vimeo', 'custom', null
  duration INTEGER, -- in seconds
  order_index INTEGER DEFAULT 0,
  is_free_preview BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_lessons_course_id ON lessons(course_id);
CREATE INDEX idx_lessons_order ON lessons(course_id, order_index);

-- ============================================
-- LESSON PROGRESS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS lesson_progress (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  lesson_id INTEGER NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  course_id INTEGER NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  completed BOOLEAN DEFAULT FALSE,
  progress_percentage INTEGER DEFAULT 0,
  time_spent INTEGER DEFAULT 0, -- in seconds
  last_position INTEGER DEFAULT 0, -- for video playback position
  completed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, lesson_id)
);

CREATE INDEX idx_lesson_progress_user ON lesson_progress(user_id);
CREATE INDEX idx_lesson_progress_lesson ON lesson_progress(lesson_id);
CREATE INDEX idx_lesson_progress_course ON lesson_progress(course_id, user_id);

-- ============================================
-- QUIZZES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS quizzes (
  id SERIAL PRIMARY KEY,
  course_id INTEGER NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  passing_score INTEGER DEFAULT 70, -- percentage
  max_attempts INTEGER DEFAULT 3,
  time_limit INTEGER, -- in minutes, null for unlimited
  is_published BOOLEAN DEFAULT FALSE,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_quizzes_course_id ON quizzes(course_id);

-- ============================================
-- QUIZ QUESTIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS quiz_questions (
  id SERIAL PRIMARY KEY,
  quiz_id INTEGER NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
  question_text TEXT NOT NULL,
  question_type VARCHAR(50) NOT NULL, -- 'multiple_choice', 'true_false', 'short_answer'
  options JSONB, -- For multiple choice: ["Option A", "Option B", ...]
  correct_answer TEXT NOT NULL,
  points INTEGER DEFAULT 1,
  order_index INTEGER DEFAULT 0,
  explanation TEXT, -- Shown after answering
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_quiz_questions_quiz_id ON quiz_questions(quiz_id);

-- ============================================
-- QUIZ SUBMISSIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS quiz_submissions (
  id SERIAL PRIMARY KEY,
  quiz_id INTEGER NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  score NUMERIC(5,2) NOT NULL,
  total_points NUMERIC(5,2) NOT NULL,
  percentage NUMERIC(5,2) NOT NULL,
  passed BOOLEAN DEFAULT FALSE,
  answers JSONB NOT NULL, -- { "question_id": "user_answer", ... }
  time_taken INTEGER, -- in seconds
  attempt_number INTEGER DEFAULT 1,
  submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_quiz_submissions_quiz ON quiz_submissions(quiz_id);
CREATE INDEX idx_quiz_submissions_user ON quiz_submissions(user_id);
CREATE INDEX idx_quiz_submissions_quiz_user ON quiz_submissions(quiz_id, user_id);

-- ============================================
-- COMMENTS
-- ============================================
COMMENT ON TABLE lessons IS 'Stores individual lessons/content items within courses';
COMMENT ON TABLE lesson_progress IS 'Tracks student progress on individual lessons';
COMMENT ON TABLE quizzes IS 'Stores quiz metadata for courses';
COMMENT ON TABLE quiz_questions IS 'Stores individual questions for quizzes';
COMMENT ON TABLE quiz_submissions IS 'Stores student quiz attempts and scores';

COMMENT ON COLUMN lessons.content_type IS 'Type of content: video, pdf, text, quiz';
COMMENT ON COLUMN lessons.video_provider IS 'Video hosting provider: youtube, vimeo, custom, or null';
COMMENT ON COLUMN lesson_progress.last_position IS 'Last playback position in seconds for video content';
COMMENT ON COLUMN quizzes.passing_score IS 'Minimum percentage score required to pass';
COMMENT ON COLUMN quizzes.max_attempts IS 'Maximum number of attempts allowed';
COMMENT ON COLUMN quiz_questions.question_type IS 'Type: multiple_choice, true_false, or short_answer';
COMMENT ON COLUMN quiz_submissions.answers IS 'JSON object containing user answers for each question';