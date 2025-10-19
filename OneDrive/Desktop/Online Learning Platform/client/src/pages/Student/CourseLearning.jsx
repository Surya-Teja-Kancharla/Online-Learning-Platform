/**
 * Course Learning Page
 * Video player with lesson navigation and progress tracking
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import {
  PlayCircle,
  CheckCircle,
  Lock,
  ArrowLeft,
  ArrowRight,
  FileText,
  Download,
  Award,
  MessageSquare, // ADDED FOR FORUM BUTTON
} from 'lucide-react';

const CourseLearning = () => {
  const { courseId, lessonId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const toast = useToast();

  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [currentLesson, setCurrentLesson] = useState(null);
  const [enrollment, setEnrollment] = useState(null);
  const [completedLessons, setCompletedLessons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCourseData();
  }, [courseId]);

  useEffect(() => {
    if (lessons.length > 0) {
      const lesson = lessonId
        ? lessons.find((l) => l.id === parseInt(lessonId))
        : lessons[0];
      setCurrentLesson(lesson || lessons[0]);
    }
  }, [lessonId, lessons]);

  const loadCourseData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');

      // Load course details
      const courseRes = await fetch(`http://localhost:5000/api/courses/${courseId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const courseData = await courseRes.json();
      setCourse(courseData.data.course);

      // Load course content (lessons)
      const lessonsRes = await fetch(
        `http://localhost:5000/api/course-content/course/${courseId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const lessonsData = await lessonsRes.json();
      setLessons(lessonsData.data.content || []);

      // Load enrollment progress
      const enrollmentRes = await fetch(
        `http://localhost:5000/api/enrollments/course/${courseId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const enrollmentData = await enrollmentRes.json();
      setEnrollment(enrollmentData.data.enrollment);

      // Load completed lessons (mock - you can enhance this)
      setCompletedLessons([]);
    } catch (error) {
      console.error('Error loading course data:', error);
      toast.error('Failed to load course');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkComplete = async () => {
    try {
      if (!currentLesson) return;

      // Add to completed lessons
      if (!completedLessons.includes(currentLesson.id)) {
        setCompletedLessons([...completedLessons, currentLesson.id]);
      }

      // Calculate progress
      const newProgress = Math.round(
        ((completedLessons.length + 1) / lessons.length) * 100
      );

      // Update progress on backend
      const token = localStorage.getItem('token');
      await fetch(`http://localhost:5000/api/enrollments/${enrollment.id}/progress`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ progress: newProgress }),
      });

      setEnrollment({ ...enrollment, progress: newProgress });
      toast.success('Lesson marked as complete!');
    } catch (error) {
      console.error('Error updating progress:', error);
      toast.error('Failed to update progress');
    }
  };

  const handleNext = () => {
    const currentIndex = lessons.findIndex((l) => l.id === currentLesson?.id);
    if (currentIndex < lessons.length - 1) {
      navigate(`/student/courses/${courseId}/learn/${lessons[currentIndex + 1].id}`);
    }
  };

  const handlePrevious = () => {
    const currentIndex = lessons.findIndex((l) => l.id === currentLesson?.id);
    if (currentIndex > 0) {
      navigate(`/student/courses/${courseId}/learn/${lessons[currentIndex - 1].id}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  const currentIndex = lessons.findIndex((l) => l.id === currentLesson?.id);
  const progress = enrollment?.progress || 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate('/student/dashboard')}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </button>

            {/* FORUM BUTTON - NEWLY ADDED */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate(`/student/courses/${courseId}/forum`)}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <MessageSquare className="w-4 h-4" />
                Discussion Forum
              </button>

              <div className="text-sm">
                <span className="text-gray-600">Progress:</span>
                <span className="ml-2 font-semibold text-indigo-600">
                  {progress}%
                </span>
              </div>
              <div className="w-32 h-2 bg-gray-200 rounded-full">
                <div
                  className="h-full bg-indigo-600 rounded-full transition-all"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Video Player */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow overflow-hidden">
              {/* Video Container */}
              <div className="relative bg-black aspect-video">
                {currentLesson?.type === 'video' ? (
                  currentLesson.url?.includes('youtube') ||
                  currentLesson.url?.includes('vimeo') ? (
                    <iframe
                      src={currentLesson.url.replace('watch?v=', 'embed/')}
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  ) : (
                    <video className="w-full h-full" controls>
                      <source src={currentLesson.url} type="video/mp4" />
                      Your browser does not support video.
                    </video>
                  )
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <FileText className="w-20 h-20 text-gray-400" />
                  </div>
                )}
              </div>

              {/* Lesson Info */}
              <div className="p-6">
                <h1 className="text-2xl font-bold mb-2">
                  {currentLesson?.title || 'Lesson Title'}
                </h1>
                <p className="text-gray-600 mb-4">{course?.title}</p>

                {currentLesson?.content && (
                  <div className="prose max-w-none mb-6">
                    <p>{currentLesson.content}</p>
                  </div>
                )}

                {/* Lesson Actions */}
                <div className="flex items-center gap-4 pt-4 border-t">
                  <button
                    onClick={handlePrevious}
                    disabled={currentIndex === 0}
                    className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Previous
                  </button>

                  {!completedLessons.includes(currentLesson?.id) && (
                    <button
                      onClick={handleMarkComplete}
                      className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Mark as Complete
                    </button>
                  )}

                  {completedLessons.includes(currentLesson?.id) && (
                    <div className="flex items-center gap-2 text-green-600">
                      <CheckCircle className="w-5 h-5" />
                      <span className="font-semibold">Completed</span>
                    </div>
                  )}

                  <button
                    onClick={handleNext}
                    disabled={currentIndex === lessons.length - 1}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed ml-auto"
                  >
                    Next
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Resources */}
                {currentLesson?.type === 'pdf' && (
                  <div className="mt-6 pt-6 border-t">
                    <h3 className="font-semibold mb-3">Downloadable Resources</h3>
                    <a
                      href={currentLesson.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700"
                    >
                      <Download className="w-4 h-4" />
                      Download PDF
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Lesson Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow">
              <div className="p-4 border-b">
                <h2 className="font-bold text-lg">Course Content</h2>
                <p className="text-sm text-gray-600 mt-1">
                  {lessons.length} lessons
                </p>
              </div>

              <div className="max-h-[600px] overflow-y-auto">
                {lessons.map((lesson, index) => (
                  <button
                    key={lesson.id}
                    onClick={() =>
                      navigate(`/student/courses/${courseId}/learn/${lesson.id}`)
                    }
                    className={`w-full text-left p-4 border-b hover:bg-gray-50 transition-colors ${
                      currentLesson?.id === lesson.id ? 'bg-indigo-50 border-l-4 border-l-indigo-600' : ''
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-1">
                        {completedLessons.includes(lesson.id) ? (
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        ) : lesson.is_free || true ? (
                          <PlayCircle className="w-5 h-5 text-gray-400" />
                        ) : (
                          <Lock className="w-5 h-5 text-gray-400" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm">
                          {index + 1}. {lesson.title}
                        </p>
                        <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                          <span className="capitalize">{lesson.type}</span>
                          {lesson.duration && (
                            <>
                              <span>•</span>
                              <span>{lesson.duration} min</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Certificate */}
            {progress === 100 && (
              <div className="mt-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg p-6 text-white">
                <div className="flex items-center gap-3 mb-3">
                  <Award className="w-8 h-8" />
                  <h3 className="font-bold text-lg">Congratulations!</h3>
                </div>
                <p className="text-sm mb-4">
                  You've completed this course. Download your certificate!
                </p>
                <button className="w-full bg-white text-orange-600 font-semibold py-2 rounded-lg hover:bg-gray-100">
                  Download Certificate
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseLearning;