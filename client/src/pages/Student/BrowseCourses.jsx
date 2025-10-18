/**
 * Browse Courses Page
 * Course catalog with filtering and search
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCourses } from '../../context/CourseContext';
import BrowseCourseCard from '../../components/course/BrowseCourseCard';
import CourseFilters from '../../components/course/CourseFilters';
import Button from '../../components/common/Button';

const BrowseCourses = () => {
  const { user, logout } = useAuth();
  const { courses, loading, loadCourses, updateFilters, resetFilters } = useCourses();
  const navigate = useNavigate();

  const [showFilters, setShowFilters] = useState(true);

  useEffect(() => {
    loadCourses();
  }, []);

  const handleFilterChange = (newFilters) => {
    updateFilters(newFilters);
    loadCourses(newFilters);
  };

  const handleReset = () => {
    resetFilters();
    loadCourses();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Browse Courses</h1>
              <p className="text-sm text-gray-600 mt-1">
                Discover courses to enhance your skills
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/student/dashboard')}
              >
                My Courses
              </Button>
              <Button variant="outline" size="sm" onClick={logout}>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-4">
              {/* Mobile Filter Toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden mb-4 w-full flex items-center justify-between px-4 py-2 bg-white rounded-lg shadow"
              >
                <span className="font-medium">Filters</span>
                <svg
                  className={`w-5 h-5 transform transition-transform ${
                    showFilters ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {/* Filters */}
              <div className={`${showFilters ? 'block' : 'hidden lg:block'}`}>
                <CourseFilters
                  onFilterChange={handleFilterChange}
                  onReset={handleReset}
                />
              </div>
            </div>
          </div>

          {/* Courses Grid */}
          <div className="lg:col-span-3">
            {/* Results Header */}
            <div className="mb-6 flex items-center justify-between">
              <p className="text-gray-600">
                {loading ? (
                  'Loading courses...'
                ) : (
                  <>
                    Showing <span className="font-semibold">{courses.length}</span>{' '}
                    courses
                  </>
                )}
              </p>
            </div>

            {/* Loading State */}
            {loading ? (
              <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            ) : courses.length === 0 ? (
              /* Empty State */
              <div className="bg-white rounded-lg shadow p-12 text-center">
                <svg
                  className="w-20 h-20 text-gray-400 mx-auto mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No courses found
                </h3>
                <p className="text-gray-600 mb-6">
                  Try adjusting your filters or search criteria
                </p>
                <Button variant="primary" onClick={handleReset}>
                  Reset Filters
                </Button>
              </div>
            ) : (
              /* Courses Grid */
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {courses.map((course) => (
                  <BrowseCourseCard key={course.id} course={course} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrowseCourses;