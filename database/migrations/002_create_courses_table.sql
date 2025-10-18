-- Migration: Create Courses Table
-- Description: Creates the courses table with instructor ownership
-- Version: 002
-- Date: 2024

-- Drop table if exists (for development only)
-- DROP TABLE IF EXISTS courses CASCADE;

-- Create courses table
CREATE TABLE IF NOT EXISTS courses (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  instructor_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  category VARCHAR(100) NOT NULL,
  difficulty VARCHAR(50) NOT NULL CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
  price DECIMAL(10, 2) DEFAULT 0.00,
  duration INTEGER, -- Duration in minutes
  thumbnail_url VARCHAR(500),
  video_url VARCHAR(500),
  syllabus TEXT,
  requirements TEXT,
  learning_outcomes TEXT,
  language VARCHAR(50) DEFAULT 'English',
  is_published BOOLEAN DEFAULT false,
  enrollment_count INTEGER DEFAULT 0,
  rating DECIMAL(3, 2) DEFAULT 0.00,
  rating_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_courses_instructor ON courses(instructor_id);
CREATE INDEX IF NOT EXISTS idx_courses_category ON courses(category);
CREATE INDEX IF NOT EXISTS idx_courses_difficulty ON courses(difficulty);
CREATE INDEX IF NOT EXISTS idx_courses_published ON courses(is_published);
CREATE INDEX IF NOT EXISTS idx_courses_rating ON courses(rating);
CREATE INDEX IF NOT EXISTS idx_courses_created_at ON courses(created_at);

-- Create trigger to automatically update updated_at
DROP TRIGGER IF EXISTS update_courses_updated_at ON courses;
CREATE TRIGGER update_courses_updated_at
  BEFORE UPDATE ON courses
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Add comments for documentation
COMMENT ON TABLE courses IS 'Stores course information created by instructors';
COMMENT ON COLUMN courses.id IS 'Primary key';
COMMENT ON COLUMN courses.title IS 'Course title';
COMMENT ON COLUMN courses.description IS 'Detailed course description';
COMMENT ON COLUMN courses.instructor_id IS 'Foreign key to users table (instructor)';
COMMENT ON COLUMN courses.category IS 'Course category (e.g., Web Development, Data Science)';
COMMENT ON COLUMN courses.difficulty IS 'Course difficulty level: beginner, intermediate, advanced';
COMMENT ON COLUMN courses.price IS 'Course price (0 for free courses)';
COMMENT ON COLUMN courses.duration IS 'Estimated course duration in minutes';
COMMENT ON COLUMN courses.thumbnail_url IS 'URL to course thumbnail image';
COMMENT ON COLUMN courses.video_url IS 'URL to course intro video';
COMMENT ON COLUMN courses.syllabus IS 'Course syllabus/curriculum';
COMMENT ON COLUMN courses.requirements IS 'Prerequisites and requirements';
COMMENT ON COLUMN courses.learning_outcomes IS 'What students will learn';
COMMENT ON COLUMN courses.language IS 'Course language';
COMMENT ON COLUMN courses.is_published IS 'Whether course is published and visible to students';
COMMENT ON COLUMN courses.enrollment_count IS 'Number of students enrolled';
COMMENT ON COLUMN courses.rating IS 'Average course rating (0-5)';
COMMENT ON COLUMN courses.rating_count IS 'Number of ratings received';
COMMENT ON COLUMN courses.created_at IS 'Course creation timestamp';
COMMENT ON COLUMN courses.updated_at IS 'Last update timestamp';

-- Verify table creation
SELECT 
  table_name, 
  column_name, 
  data_type, 
  is_nullable
FROM information_schema.columns
WHERE table_name = 'courses'
ORDER BY ordinal_position;