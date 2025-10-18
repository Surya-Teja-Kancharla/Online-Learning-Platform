/**
 * Instructor Dashboard
 * Full-featured dashboard for course management
 */

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import courseService from '../../services/courseService';
import CourseForm from '../../components/course/CourseForm';
import CourseCard from '../../components/course/CourseCard';
import Modal from '../../components/common/Modal';
import Button from '../../components/common/Button';

const InstructorDashboard = () => {
  const { user, logout } = useAuth();
  const toast = useToast();

  const [courses, setCourses] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [filter, setFilter] = useState('all'); // all, published, draft

  // Load courses and stats
  useEffect(() => {
    loadData();
  }, [filter]);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Get instructor stats
      const statsData = await courseService.getInstructorStats();
      setStats(statsData);

      // Get courses with filter
      const filters = {};
      if (filter === 'published') filters.is_published = true;
      if (filter === 'draft') filters.is_published = false;

      const coursesData = await courseService.getInstructorCourses(filters);
      setCourses(coursesData);
    } catch (error) {
      toast.error('Failed to load dashboard data');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCourse = async (formData, setProgress) => {
    try {
      setIsSubmitting(true);
      await courseService.createCourse(formData, setProgress);
      toast.success('Course created successfully!');
      setIsCreating(false);
      loadData();
    } catch (error) {
      toast.error(error.message || 'Failed to create course');
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateCourse = async (formData, setProgress) => {
    try {
      setIsSubmitting(true);
      await courseService.updateCourse(selectedCourse.id, formData, setProgress);
      toast.success('Course updated successfully!');
      setIsEditing(false);
      setSelectedCourse(null);
      loadData();
    } catch (error) {
      toast.error(error.message || 'Failed to update course');
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteCourse = async (courseId) => {
    if (!window.confirm('Are you sure you want to delete this course? This action cannot be undone.')) {
      return;
    }

    try {
      await courseService.deleteCourse(courseId);
      toast.success('Course deleted successfully');
      loadData();
    } catch (error) {
      toast.error(error.message || 'Failed to delete course');
    }
  };

  const handlePublishCourse = async (courseId) => {
    try {
      await courseService.publishCourse(courseId);
      toast.success('Course published successfully!');
      loadData();
    } catch (error) {
      toast.error(error.message || 'Failed to publish course');
    }
  };

  const handleUnpublishCourse = async (courseId) => {
    if (!window.confirm('Are you sure you want to unpublish this course?')) {
      return;
    }

    try {
      await courseService.unpublishCourse(courseId);
      toast.success('Course unpublished');
      loadData();
    } catch (error) {
      toast.error(error.message || 'Failed to unpublish course');
    }
  };

  const handleEditCourse = (course) => {
    setSelectedCourse(course);
    setIsEditing(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Instructor Dashboard</h1>
            <p className="text-sm text-gray-600 mt-1">Welcome back, {user?.name}!</p>
          </div>
          <Button variant="outline" size="sm" onClick={logout}>
            Logout
          </Button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Courses</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.totalCourses}</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Published</p>
                  <p className="text-3xl font-bold text-green-600">{stats.publishedCourses}</p>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Students</p>
                  <p className="text-3xl font-bold text-purple-600">{stats.totalEnrollments}</p>
                </div>
                <div className="p-3 bg-purple-100 rounded-full">
                  <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Revenue</p>
                  <p className="text-3xl font-bold text-yellow-600">${stats.totalRevenue}</p>
                </div>
                <div className="p-3 bg-yellow-100 rounded-full">
                  <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Actions and Filters */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              All Courses
            </button>
            <button
              onClick={() => setFilter('published')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'published'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Published
            </button>
            <button
              onClick={() => setFilter('draft')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'draft'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Drafts
            </button>
          </div>

          <Button
            variant="primary"
            onClick={() => setIsCreating(true)}
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            Create New Course
          </Button>
        </div>

        {/* Courses Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : courses.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <svg className="w-20 h-20 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No courses yet</h3>
            <p className="text-gray-600 mb-6">
              Create your first course to start teaching and earning!
            </p>
            <Button
              variant="primary"
              onClick={() => setIsCreating(true)}
            >
              Create Your First Course
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map(course => (
              <CourseCard
                key={course.id}
                course={course}
                onEdit={handleEditCourse}
                onDelete={handleDeleteCourse}
                onPublish={handlePublishCourse}
                onUnpublish={handleUnpublishCourse}
                isInstructor={true}
              />
            ))}
          </div>
        )}

        {/* Create Course Modal */}
        <Modal
          isOpen={isCreating}
          onClose={() => !isSubmitting && setIsCreating(false)}
          title="Create New Course"
          size="lg"
        >
          <CourseForm
            onSubmit={handleCreateCourse}
            onCancel={() => setIsCreating(false)}
            isSubmitting={isSubmitting}
          />
        </Modal>

        {/* Edit Course Modal */}
        <Modal
          isOpen={isEditing}
          onClose={() => !isSubmitting && setIsEditing(false)}
          title="Edit Course"
          size="lg"
        >
          <CourseForm
            course={selectedCourse}
            onSubmit={handleUpdateCourse}
            onCancel={() => {
              setIsEditing(false);
              setSelectedCourse(null);
            }}
            isSubmitting={isSubmitting}
          />
        </Modal>
      </div>
    </div>
  );
};

export default InstructorDashboard;