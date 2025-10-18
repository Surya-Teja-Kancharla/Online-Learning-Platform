/**
 * LessonList Component
 * Sidebar showing all lessons with progress
 */

import React from 'react';

const LessonList = ({ lessons, currentLesson, onLessonSelect, darkMode = false }) => {
  const getIcon = (lesson) => {
    switch (lesson.content_type) {
      case 'video':
        return '🎥';
      case 'pdf':
        return '📄';
      case 'quiz':
        return '📝';
      case 'text':
        return '📖';
      default:
        return '📌';
    }
  };

  const formatDuration = (seconds) => {
    if (!seconds) return '';
    const mins = Math.floor(seconds / 60);
    return `${mins}m`;
  };

  return (
    <div className={`h-full overflow-y-auto ${darkMode ? 'bg-gray-800' : 'bg-white'} border-r`}>
      <div className="p-4">
        <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Course Content
        </h3>

        <div className="space-y-2">
          {lessons.map((lesson, index) => (
            <button
              key={lesson.id}
              onClick={() => onLessonSelect(lesson)}
              className={`w-full text-left p-3 rounded-lg transition-colors ${
                currentLesson?.id === lesson.id
                  ? darkMode
                    ? 'bg-blue-600 text-white'
                    : 'bg-blue-50 border-2 border-blue-500 text-blue-900'
                  : darkMode
                  ? 'bg-gray-700 text-gray-200 hover:bg-gray-600'
                  : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
              }`}
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl">{getIcon(lesson)}</span>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium opacity-75">
                      {index + 1}
                    </span>
                    {lesson.progress?.completed && (
                      <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                  
                  <h4 className="font-medium text-sm mt-1 line-clamp-2">
                    {lesson.title}
                  </h4>
                  
                  <div className="flex items-center gap-2 mt-1 text-xs opacity-75">
                    {lesson.duration && (
                      <span>{formatDuration(lesson.duration)}</span>
                    )}
                    {lesson.is_free_preview && (
                      <span className="px-2 py-0.5 bg-green-500 text-white rounded text-xs">
                        FREE
                      </span>
                    )}
                  </div>

                  {/* Progress Bar */}
                  {lesson.progress && lesson.progress.progress_percentage > 0 && !lesson.progress.completed && (
                    <div className="mt-2">
                      <div className="h-1 bg-gray-300 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-500 transition-all"
                          style={{ width: `${lesson.progress.progress_percentage}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LessonList;