/**
 * Mock Data for Testing Without Database
 * Use this temporarily to test Phase 4 frontend
 */

const mockCourses = [
  {
    id: 1,
    title: "Introduction to React",
    description: "Learn React from scratch with hands-on projects. Build real-world applications and master modern frontend development.",
    instructor_name: "John Doe",
    instructor_id: 1,
    category: "Web Development",
    difficulty_level: "beginner",
    price: 49.99,
    thumbnail_url: "https://via.placeholder.com/400x300/4F46E5/FFFFFF?text=React+Course",
    rating: 4.5,
    reviews_count: 120,
    enrolled_count: 450,
    lesson_count: 12,
    duration_minutes: 360,
    is_published: true,
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    id: 2,
    title: "Advanced Node.js Development",
    description: "Master backend development with Node.js and Express. Learn REST APIs, authentication, and database integration.",
    instructor_name: "Jane Smith",
    instructor_id: 2,
    category: "Backend Development",
    difficulty_level: "advanced",
    price: 79.99,
    thumbnail_url: "https://via.placeholder.com/400x300/10B981/FFFFFF?text=NodeJS+Course",
    rating: 4.8,
    reviews_count: 89,
    enrolled_count: 320,
    lesson_count: 18,
    duration_minutes: 540,
    is_published: true,
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    id: 3,
    title: "Python for Data Science",
    description: "Learn Python programming for data analysis and machine learning. Master pandas, numpy, and scikit-learn.",
    instructor_name: "Mike Johnson",
    instructor_id: 3,
    category: "Data Science",
    difficulty_level: "intermediate",
    price: 0,
    thumbnail_url: "https://via.placeholder.com/400x300/F59E0B/FFFFFF?text=Python+Course",
    rating: 4.7,
    reviews_count: 200,
    enrolled_count: 890,
    lesson_count: 15,
    duration_minutes: 450,
    is_published: true,
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    id: 4,
    title: "Full Stack Web Development",
    description: "Complete bootcamp covering frontend and backend. Learn React, Node.js, databases, and deployment.",
    instructor_name: "Sarah Williams",
    instructor_id: 4,
    category: "Web Development",
    difficulty_level: "intermediate",
    price: 99.99,
    thumbnail_url: "https://via.placeholder.com/400x300/EF4444/FFFFFF?text=FullStack+Course",
    rating: 4.9,
    reviews_count: 340,
    enrolled_count: 1200,
    lesson_count: 25,
    duration_minutes: 1200,
    is_published: true,
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    id: 5,
    title: "Machine Learning Fundamentals",
    description: "Introduction to ML algorithms, supervised and unsupervised learning. Build your first ML models.",
    instructor_name: "David Chen",
    instructor_id: 5,
    category: "Data Science",
    difficulty_level: "intermediate",
    price: 89.99,
    thumbnail_url: "https://via.placeholder.com/400x300/8B5CF6/FFFFFF?text=ML+Course",
    rating: 4.6,
    reviews_count: 156,
    enrolled_count: 670,
    lesson_count: 20,
    duration_minutes: 600,
    is_published: true,
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    id: 6,
    title: "Modern CSS & Tailwind",
    description: "Master modern CSS techniques and Tailwind CSS framework. Create beautiful, responsive designs.",
    instructor_name: "Emma Wilson",
    instructor_id: 6,
    category: "Web Development",
    difficulty_level: "beginner",
    price: 39.99,
    thumbnail_url: "https://via.placeholder.com/400x300/06B6D4/FFFFFF?text=CSS+Course",
    rating: 4.4,
    reviews_count: 98,
    enrolled_count: 530,
    lesson_count: 10,
    duration_minutes: 300,
    is_published: true,
    created_at: new Date(),
    updated_at: new Date()
  }
];

const mockUser = {
  id: 1,
  username: "testuser",
  email: "test@example.com",
  role: "student",
  full_name: "Test User",
  created_at: new Date()
};

const mockEnrollments = [
  {
    id: 1,
    student_id: 1,
    course_id: 1,
    progress: 45,
    enrolled_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    last_accessed_at: new Date(),
    course_title: "Introduction to React",
    description: "Learn React from scratch with hands-on projects",
    thumbnail_url: "https://via.placeholder.com/400x300/4F46E5/FFFFFF?text=React+Course",
    difficulty_level: "beginner",
    instructor_name: "John Doe"
  },
  {
    id: 2,
    student_id: 1,
    course_id: 3,
    progress: 20,
    enrolled_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    last_accessed_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    course_title: "Python for Data Science",
    description: "Learn Python programming for data analysis",
    thumbnail_url: "https://via.placeholder.com/400x300/F59E0B/FFFFFF?text=Python+Course",
    difficulty_level: "intermediate",
    instructor_name: "Mike Johnson"
  }
];

const mockLessons = [
  {
    id: 1,
    course_id: 1,
    title: "Introduction to React Basics",
    content: "Welcome to React! In this lesson, we'll cover the fundamentals.",
    video_url: "https://www.youtube.com/watch?v=SqcY0GlETPk",
    duration_minutes: 30,
    order_index: 1,
    is_free: true
  },
  {
    id: 2,
    course_id: 1,
    title: "Components and Props",
    content: "Learn how to create reusable components.",
    video_url: "https://www.youtube.com/watch?v=SqcY0GlETPk",
    duration_minutes: 45,
    order_index: 2,
    is_free: false
  }
];

module.exports = {
  mockCourses,
  mockUser,
  mockEnrollments,
  mockLessons
};