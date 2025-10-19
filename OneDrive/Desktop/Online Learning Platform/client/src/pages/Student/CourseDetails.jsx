/**
 * Course Details Page
 * Shows course information and allows enrollment
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { 
  ArrowLeft, 
  BookOpen, 
  Clock, 
  Users, 
  Star,
  PlayCircle,
  Award,
  CheckCircle 
} from 'lucide-react';

const CourseDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const toast = useToast();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);

  useEffect(() => {
    loadCourseDetails();
  }, [id]);

  const loadCourseDetails = async () => {
    try {
      setLoading(true);
      
      // Get token from localStorage
      const token = localStorage.getItem('token');
      
      // Fetch course details
      const response = await fetch(`http://localhost:5000/api/courses/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) throw new Error('Failed to load course');
      
      const data = await response.json();
      setCourse(data.data.course);
      
      // Check if already enrolled
      await checkEnrollment(token);
    } catch (error) {
      console.error('Error loading course:', error);
      toast.error('Failed to load course details');
    } finally {
      setLoading(false);
    }
  };

  const checkEnrollment = async (token) => {
    try {
      const response = await fetch('http://localhost:5000/api/enrollments/my-enrollments', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        const enrollments = data.data.enrollments || [];
        const enrolled = enrollments.some(e => e.course_id === parseInt(id));
        setIsEnrolled(enrolled);
      }
    } catch (error) {
      console.error('Error checking enrollment:', error);
    }
  };

  const handleEnroll = async () => {
    try {
      setEnrolling(true);
      
      const token = localStorage.getItem('token');
      
      console.log('Enrolling in course:', id);
      console.log('Token exists:', !!token);
      
      const response = await fetch('http://localhost:5000/api/enrollments/enroll', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ course_id: parseInt(id) })
      });
      
      const data = await response.json();
      console.log('Enrollment response:', data);
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to enroll');
      }
      
      toast.success('Successfully enrolled in course!');
      setIsEnrolled(true);
      
      // Navigate to course learning after 1 second
      setTimeout(() => {
        navigate(`/student/courses/${id}/learn`);
      }, 1000);
    } catch (error) {
      console.error('Enrollment error:', error);
      toast.error(error.message || 'Failed to enroll in course');
    } finally {
      setEnrolling(false);
    }
  };

  const handleStartLearning = () => {
    navigate(`/student/courses/${id}/learn`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Course not found</h2>
          <button
            onClick={() => navigate('/student/browse')}
            className="text-indigo-600 hover:underline"
          >
            ← Back to courses
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <button
            onClick={() => navigate('/student/browse')}
            className="flex items-center gap-2 text-white/80 hover:text-white mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to courses
          </button>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <div className="flex gap-3 mb-4">
                <span className="px-3 py-1 bg-white/20 rounded-full text-sm">
                  {course.category}
                </span>
                <span className="px-3 py-1 bg-white/20 rounded-full text-sm">
                  {course.difficulty_level}
                </span>
              </div>

              <h1 className="text-4xl font-bold mb-4">{course.title}</h1>
              <p className="text-xl mb-6">{course.description}</p>

              <div className="flex gap-6">
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  <span>{parseFloat(course.average_rating || 4.5).toFixed(1)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  <span>{course.enrollment_count || 0} students</span>
                </div>
              </div>

              <div className="mt-6 flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                  <span className="text-xl font-bold">
                    {course.instructor_name?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-white/80">Instructor</p>
                  <p className="font-semibold">{course.instructor_name}</p>
                </div>
              </div>
            </div>

            <div className="md:col-span-1">
              <div className="bg-white rounded-lg shadow-xl p-6">
                <div className="text-center mb-6">
                  <p className="text-3xl font-bold text-gray-900">
                    ₹{parseFloat(course.price).toFixed(2)}
                  </p>
                </div>

                {isEnrolled ? (
                  <button
                    onClick={handleStartLearning}
                    className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 flex items-center justify-center gap-2"
                  >
                    <PlayCircle className="w-5 h-5" />
                    Continue Learning
                  </button>
                ) : (
                  <button
                    onClick={handleEnroll}
                    disabled={enrolling}
                    className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 disabled:opacity-50"
                  >
                    {enrolling ? 'Enrolling...' : 'Enroll Now'}
                  </button>
                )}

                <div className="mt-6 space-y-3 text-sm">
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-gray-400" />
                    <span>Self-paced learning</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Award className="w-5 h-5 text-gray-400" />
                    <span>Certificate included</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <BookOpen className="w-5 h-5 text-gray-400" />
                    <span>Lifetime access</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Course Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="bg-white rounded-lg shadow p-8">
          <h2 className="text-2xl font-bold mb-6">What you'll learn</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              'Master the fundamentals',
              'Build real-world projects',
              'Best practices and patterns',
              'Industry-standard tools',
            ].map((item, index) => (
              <div key={index} className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetails;