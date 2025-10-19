/**
 * App Component
 * Main application component with routing
 */

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { CourseProvider } from './context/CourseContext';
import ProtectedRoute from './components/layout/ProtectedRoute';

// Auth Pages
import Login from './pages/Auth/Login';
import Signup from './pages/Auth/Signup';

// Dashboard Pages
import StudentDashboard from './pages/Student/Dashboard';
import BrowseCourses from './pages/Student/BrowseCourses';
import CourseDetails from './pages/Student/CourseDetails';
import CourseLearning from './pages/Student/CourseLearning';
import QuizPage from './pages/Student/QuizPage';
import InstructorDashboard from './pages/Instructor/Dashboard';
import AdminDashboard from './pages/Admin/Dashboard';

// Forum Pages - NEWLY ADDED
import CourseForum from './pages/Student/CourseForum';
import PostDetail from './pages/Student/PostDetail';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <CourseProvider>
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              
              {/* Public Browse - Anyone can browse */}
              <Route path="/student/browse" element={<BrowseCourses />} />

              {/* Course Details - MUST BE ADDED */}
              <Route
                path="/student/course/:id"
                element={
                  <ProtectedRoute allowedRoles={['student', 'instructor', 'admin']}>
                    <CourseDetails />
                  </ProtectedRoute>
                }
              />

              {/* Protected Routes - Student */}
              <Route
                path="/student/dashboard"
                element={
                  <ProtectedRoute allowedRoles={['student']}>
                    <StudentDashboard />
                  </ProtectedRoute>
                }
              />
              
              <Route
                path="/student/courses/:courseId/learn/:lessonId?"
                element={
                  <ProtectedRoute allowedRoles={['student']}>
                    <CourseLearning />
                  </ProtectedRoute>
                }
              />
              
              <Route
                path="/student/courses/:courseId/quiz/:quizId"
                element={
                  <ProtectedRoute allowedRoles={['student']}>
                    <QuizPage />
                  </ProtectedRoute>
                }
              />

              {/* FORUM ROUTES - NEWLY ADDED FOR PHASE 5 */}
              <Route
                path="/student/courses/:courseId/forum"
                element={
                  <ProtectedRoute allowedRoles={['student', 'instructor', 'admin']}>
                    <CourseForum />
                  </ProtectedRoute>
                }
              />
              
              <Route
                path="/student/courses/:courseId/forum/:postId"
                element={
                  <ProtectedRoute allowedRoles={['student', 'instructor', 'admin']}>
                    <PostDetail />
                  </ProtectedRoute>
                }
              />

              {/* Legacy route - redirect */}
              <Route
                path="/dashboard/student"
                element={<Navigate to="/student/dashboard" replace />}
              />

              {/* Protected Routes - Instructor */}
              <Route
                path="/dashboard/instructor"
                element={
                  <ProtectedRoute allowedRoles={['instructor']}>
                    <InstructorDashboard />
                  </ProtectedRoute>
                }
              />

              {/* Protected Routes - Admin */}
              <Route
                path="/dashboard/admin"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />

              {/* Default Route */}
              <Route path="/" element={<Navigate to="/student/browse" replace />} />

              {/* 404 Route */}
              <Route path="*" element={<Navigate to="/student/browse" replace />} />
            </Routes>
          </CourseProvider>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;