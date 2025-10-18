/**
 * EnrolledCourseCard Component
 * Displays enrolled course with progress tracking
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../common/Button';
import ProgressBar from '../common/ProgressBar';

const EnrolledCourseCard = ({ enrollment, course }) => {
  const navigate = useNavigate();

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const calculateLessonsCompleted = () => {
    // Mock calculation - replace with actual lesson tracking
    const totalLessons = 10; // This should come from course data
    const completedLessons = Math.floor((enrollment.progress / 100) * totalLessons);
    return { completed: completedLessons, total: totalLessons };
  };

  const lessons = calculateLessonsCompleted();

  const getProgressColor = () => {
    if (enrollment.progress >= 80) return 'success';
    if (enrollment.progress >= 50) return 'primary';
    if (enrollment.progress >= 30) return 'warning';
    return 'danger';
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {/* Thumbnail */}
      <div className="relative">
        {course.thumbnail_url ? (
          <img 
            src={course.thumbnail_url} 
            alt={course.title}
            className="w-full h-48 object-cover"
          />
        ) : (
          <div className="w-full h-48 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <svg className="w-20 h-20 text-white opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
        )}
        
        {/* Completion Badge */}
        {enrollment.completed_at && (
          <div className="absolute top-3 right-3">
            <span className="px-3 py-1 bg-green-500 text-white rounded-full text-xs font-semibold flex items-center">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Completed
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Title */}
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
          {course.title}
        </h3>

        {/* Instructor */}
        <p className="text-sm text-gray-600 mb-4">
          By {course.instructor_name || 'Instructor'}
        </p>

        {/* Progress */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">
              Progress: {lessons.completed}/{lessons.total} lessons
            </span>
            <span className="text-sm font-medium text-gray-900">
              {Math.round(enrollment.progress)}%
            </span>
          </div>
          <ProgressBar 
            progress={enrollment.progress} 
            variant={getProgressColor()}
            showPercentage={false}
          />
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between text-sm text-gray-600 mb-4 pb-4 border-b border-gray-200">
          <div className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>Enrolled {formatDate(enrollment.enrolled_at)}</span>
          </div>
          {enrollment.last_accessed && (
            <div className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Last: {formatDate(enrollment.last_accessed)}</span>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Button
            variant="primary"
            size="sm"
            fullWidth
            onClick={() => navigate(`/student/courses/${course.id}`)}
          >
            {enrollment.progress === 0 ? 'Start Learning' : 'Continue Learning'}
          </Button>
          {enrollment.progress > 0 && (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => navigate(`/student/courses/${course.id}/progress`)}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default EnrolledCourseCard;