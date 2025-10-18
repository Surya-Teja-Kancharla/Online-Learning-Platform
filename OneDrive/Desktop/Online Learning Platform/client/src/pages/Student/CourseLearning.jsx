/**
 * CourseLearning Page
 * Main learning interface with video player and navigation
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import VideoPlayer from '../../components/player/VideoPlayer';
import LessonList from '../../components/player/LessonList';
import lessonService from '../../services/lessonService';
import { useToast } from '../../context/ToastContext';
import Button from '../../components/common/Button';

const CourseLearning = () => {
  const { courseId, lessonId } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const [lessons, setLessons] = useState([]);
  const [currentLesson, setCurrentLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [nextLesson, setNextLesson] = useState(null);
  const [prevLesson, setPrevLesson] = useState(null);

  useEffect(() => {
    loadLessons();
  }, [courseId]);

  useEffect(() => {
    if (lessonId && lessons.length > 0) {
      const lesson = lessons.find(l => l.id === parseInt(lessonId));
      setCurrentLesson(lesson);
      loadNavigation(lessonId);
    } else if (lessons.length > 0 && !lessonId) {
      // Start with first lesson
      navigate(`/student/courses/${courseId}/learn/${lessons[0].id}`);
    }
  }, [lessonId, lessons]);

  const loadLessons = async () => {
    try {
      setLoading(true);
      const data = await lessonService.getCourseLessons(courseId);
      setLessons(data);
    } catch (error) {
      toast.error('Failed to load lessons');
    } finally {
      setLoading(false);
    }
  };

  const loadNavigation = async (currentLessonId) => {
    try {
      const [next, prev] = await Promise.all([
        lessonService.getNextLesson(currentLessonId),
        lessonService.getPreviousLesson(currentLessonId),
      ]);
      setNextLesson(next);
      setPrevLesson(prev);
    } catch (error) {
      console.error('Failed to load navigation', error);
    }
  };

  const handleProgress = async (position) => {
    if (!currentLesson) return;
    
    try {
      await lessonService.updateProgress(currentLesson.id, {
        last_position: Math.floor(position),
        progress_percentage: Math.floor((position / currentLesson.duration) * 100),
        time_spent: Math.floor(position),
        completed: false,
      });
    } catch (error) {
      console.error('Failed to save progress', error);
    }
  };

  const handleComplete = async () => {
    if (!currentLesson) return;

    try {
      await lessonService.markComplete(currentLesson.id);
      toast.success('Lesson completed!');
      loadLessons(); // Refresh to show completion
      
      if (nextLesson) {
        navigate(`/student/courses/${courseId}/learn/${nextLesson.id}`);
      }
    } catch (error) {
      toast.error('Failed to mark lesson complete');
    }
  };

  const handleLessonSelect = (lesson) => {
    navigate(`/student/courses/${courseId}/learn/${lesson.id}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className={`flex h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Sidebar */}
      <div className="w-80 flex-shrink-0 overflow-hidden">
        <LessonList
          lessons={lessons}
          currentLesson={currentLesson}
          onLessonSelect={handleLessonSelect}
          darkMode={darkMode}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className={`p-4 border-b ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
          <div className="flex items-center justify-between">
            <h2 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              {currentLesson?.title || 'Select a lesson'}
            </h2>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}
                title="Toggle dark mode"
              >
                {darkMode ? '☀️' : '🌙'}
              </button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/student/dashboard')}
              >
                Exit Course
              </Button>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-auto p-6">
          {currentLesson ? (
            <div className="max-w-5xl mx-auto">
              {/* Video Player */}
              {currentLesson.content_type === 'video' && (
                <VideoPlayer
                  url={currentLesson.content_url}
                  provider={currentLesson.video_provider}
                  startPosition={currentLesson.progress?.last_position || 0}
                  onProgress={handleProgress}
                  onComplete={handleComplete}
                  darkMode={darkMode}
                />
              )}

              {/* PDF Viewer */}
              {currentLesson.content_type === 'pdf' && (
                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                  <embed
                    src={currentLesson.content_url}
                    type="application/pdf"
                    width="100%"
                    height="800px"
                    className="border-0"
                  />
                </div>
              )}

              {/* Text Content */}
              {currentLesson.content_type === 'text' && (
                <div className={`p-8 rounded-lg shadow ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}>
                  <div 
                    className="prose max-w-none"
                    dangerouslySetInnerHTML={{ __html: currentLesson.content_url }} 
                  />
                </div>
              )}

              {/* Quiz Link */}
              {currentLesson.content_type === 'quiz' && (
                <div className={`p-8 rounded-lg shadow text-center ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                  <div className="mb-6">
                    <svg className="w-20 h-20 mx-auto text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h3 className={`text-2xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    Quiz Time!
                  </h3>
                  <p className={`mb-6 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    Test your knowledge with this quiz
                  </p>
                  <Button
                    variant="primary"
                    size="lg"
                    onClick={() => navigate(`/student/courses/${courseId}/quiz/${currentLesson.id}`)}
                  >
                    Start Quiz
                  </Button>
                </div>
              )}

              {/* Lesson Description */}
              {currentLesson.description && (
                <div className={`mt-6 p-6 rounded-lg ${darkMode ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-700'}`}>
                  <h3 className="font-semibold text-lg mb-2">About this lesson</h3>
                  <p className="leading-relaxed">{currentLesson.description}</p>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-20">
              <svg className="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <p className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Select a lesson from the sidebar to begin
              </p>
            </div>
          )}
        </div>

        {/* Navigation Footer */}
        {currentLesson && (
          <div className={`p-4 border-t ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            <div className="max-w-5xl mx-auto flex items-center justify-between">
              <Button
                variant="outline"
                onClick={() => prevLesson && navigate(`/student/courses/${courseId}/learn/${prevLesson.id}`)}
                disabled={!prevLesson}
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                </svg>
                Previous
              </Button>

              {!currentLesson.progress?.completed && currentLesson.content_type !== 'quiz' && (
                <Button
                  variant="success"
                  onClick={handleComplete}
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Mark as Complete
                </Button>
              )}

              {currentLesson.progress?.completed && (
                <div className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-800 rounded-lg">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="font-medium">Completed</span>
                </div>
              )}

              <Button
                variant="primary"
                onClick={() => nextLesson && navigate(`/student/courses/${courseId}/learn/${nextLesson.id}`)}
                disabled={!nextLesson}
              >
                Next Lesson
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseLearning;