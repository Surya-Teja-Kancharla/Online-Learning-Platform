/**
 * Course Context
 * Global state management for courses and enrollments
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import courseService from '../services/courseService';
import enrollmentService from '../services/enrollmentService';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';

const CourseContext = createContext();

export const useCourses = () => {
  const context = useContext(CourseContext);
  if (!context) {
    throw new Error('useCourses must be used within a CourseProvider');
  }
  return context;
};

export const CourseProvider = ({ children }) => {
  const { user } = useAuth();
  const toast = useToast();

  const [courses, setCourses] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    category: '',
    difficulty: '',
    search: '',
    minPrice: '',
    maxPrice: '',
    page: 1,
    limit: 12,
  });

  // Load published courses
  const loadCourses = async (customFilters = null) => {
    try {
      setLoading(true);
      const filterParams = customFilters || filters;
      const coursesData = await courseService.getPublishedCourses(filterParams);
      
      // courseService now returns the array directly
      setCourses(Array.isArray(coursesData) ? coursesData : []);
      
      return coursesData;
    } catch (error) {
      console.error('Load courses error:', error);
      toast.error('Failed to load courses');
      setCourses([]); // Set empty array on error
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Load student enrollments
  const loadEnrollments = async () => {
    if (!user || user.role !== 'student') return;
    
    try {
      const data = await enrollmentService.getMyEnrollments();
      setEnrollments(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to load enrollments:', error);
      setEnrollments([]);
    }
  };

  // Check if student is enrolled in a course
  const isEnrolled = (courseId) => {
    return enrollments.some(enrollment => enrollment.course_id === courseId);
  };

  // Get enrollment for a course
  const getEnrollment = (courseId) => {
    return enrollments.find(enrollment => enrollment.course_id === courseId);
  };

  // Enroll in a course
  const enrollInCourse = async (courseId) => {
    try {
      const enrollment = await enrollmentService.enrollInCourse(courseId);
      setEnrollments([...enrollments, enrollment]);
      toast.success('Successfully enrolled in course!');
      return enrollment;
    } catch (error) {
      toast.error(error.message || 'Failed to enroll in course');
      throw error;
    }
  };

  // Update course filters
  const updateFilters = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  // Reset filters
  const resetFilters = () => {
    setFilters({
      category: '',
      difficulty: '',
      search: '',
      minPrice: '',
      maxPrice: '',
      page: 1,
      limit: 12,
    });
  };

  // Search courses
  const searchCourses = async (query) => {
    try {
      setLoading(true);
      const response = await courseService.searchCourses(query, filters);
      const coursesData = response?.data?.courses || response?.courses || response || [];
      setCourses(Array.isArray(coursesData) ? coursesData : []);
      return response;
    } catch (error) {
      console.error('Search error:', error);
      toast.error('Search failed');
      setCourses([]);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Get popular courses
  const getPopularCourses = async (limit = 10) => {
    try {
      const data = await courseService.getPopularCourses(limit);
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error('Failed to get popular courses:', error);
      return [];
    }
  };

  // Load courses on mount and filter changes
  useEffect(() => {
    loadCourses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.category, filters.difficulty, filters.page]);

  // Load enrollments when user logs in
  useEffect(() => {
    if (user && user.role === 'student') {
      loadEnrollments();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id, user?.role]);

  const value = {
    courses,
    enrollments,
    loading,
    filters,
    loadCourses,
    loadEnrollments,
    isEnrolled,
    getEnrollment,
    enrollInCourse,
    updateFilters,
    resetFilters,
    searchCourses,
    getPopularCourses,
  };

  return (
    <CourseContext.Provider value={value}>
      {children}
    </CourseContext.Provider>
  );
};