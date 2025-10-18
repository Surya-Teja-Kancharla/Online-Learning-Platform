/**
 * QuizResults Component
 * Displays quiz results with detailed feedback
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../common/Button';
import CircularProgress from '../common/CircularProgress';

const QuizResults = ({ result, quiz, courseId, onRetry, darkMode = false }) => {
  const navigate = useNavigate();

  const getScoreColor = () => {
    if (result.percentage >= 80) return 'text-green-500';
    if (result.percentage >= 60) return 'text-blue-500';
    if (result.percentage >= 40) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'} py-8`}>
      <div className="max-w-4xl mx-auto px-4">
        {/* Score Card */}
        <div className={`rounded-lg shadow-xl overflow-hidden ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <div className={`p-8 text-center ${result.passed ? 'bg-green-50' : 'bg-red-50'}`}>
            <div className="flex justify-center mb-6">
              <CircularProgress
                progress={result.percentage}
                size={160}
                strokeWidth={12}
                color={result.passed ? '#10B981' : '#EF4444'}
                showPercentage={true}
              />
            </div>

            <h1 className={`text-3xl font-bold mb-2 ${getScoreColor()}`}>
              {result.passed ? '🎉 Congratulations!' : '😔 Not Passed'}
            </h1>

            <p className={`text-xl mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              You scored {result.submission.score} out of {result.submission.total_points} points
            </p>

            <div className={`inline-flex items-center gap-2 px-6 py-3 rounded-full text-lg font-semibold ${
              result.passed
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
            }`}>
              {result.passed ? (
                <>
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  PASSED
                </>
              ) : (
                <>
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  FAILED
                </>
              )}
            </div>

            <p className={`mt-4 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Passing score: {quiz.passing_score}% • Your score: {result.percentage.toFixed(1)}%
            </p>
          </div>

          {/* Attempt Info */}
          <div className={`px-8 py-4 border-b ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
            <div className="flex items-center justify-between text-sm">
              <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                Attempt: {result.submission.attempt_number} of {quiz.max_attempts}
              </span>
              {result.canRetry && (
                <span className={darkMode ? 'text-green-400' : 'text-green-600'}>
                  {result.attemptsLeft} {result.attemptsLeft === 1 ? 'attempt' : 'attempts'} remaining
                </span>
              )}
              {!result.canRetry && !result.passed && (
                <span className={darkMode ? 'text-red-400' : 'text-red-600'}>
                  No attempts remaining
                </span>
              )}
            </div>
          </div>

          {/* Detailed Results */}
          <div className="p-8">
            <h2 className={`text-2xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Question Breakdown
            </h2>

            <div className="space-y-6">
              {result.results.map((item, index) => (
                <div
                  key={index}
                  className={`p-6 rounded-lg border-2 ${
                    item.isCorrect
                      ? darkMode
                        ? 'border-green-500 bg-green-900 bg-opacity-20'
                        : 'border-green-200 bg-green-50'
                      : darkMode
                      ? 'border-red-500 bg-red-900 bg-opacity-20'
                      : 'border-red-200 bg-red-50'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                      item.isCorrect
                        ? 'bg-green-500 text-white'
                        : 'bg-red-500 text-white'
                    }`}>
                      {index + 1}
                    </div>

                    <div className="flex-1">
                      <p className={`font-medium mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {item.question}
                      </p>

                      <div className="space-y-2">
                        <div className={`flex items-center gap-2 ${
                          item.isCorrect
                            ? darkMode ? 'text-green-400' : 'text-green-700'
                            : darkMode ? 'text-red-400' : 'text-red-700'
                        }`}>
                          <span className="font-medium">Your answer:</span>
                          <span>{item.userAnswer || '(No answer)'}</span>
                          {item.isCorrect ? (
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                          ) : (
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                          )}
                        </div>

                        {!item.isCorrect && (
                          <div className={darkMode ? 'text-green-400' : 'text-green-700'}>
                            <span className="font-medium">Correct answer:</span> {item.correctAnswer}
                          </div>
                        )}

                        <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          Points: {item.earnedPoints}/{item.points}
                        </div>

                        {item.explanation && (
                          <div className={`mt-3 p-3 rounded ${darkMode ? 'bg-gray-700' : 'bg-white'}`}>
                            <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                              💡 <span className="font-medium">Explanation:</span> {item.explanation}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className={`p-8 border-t ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
            <div className="flex items-center justify-center gap-4">
              {result.canRetry && !result.passed && (
                <Button variant="primary" size="lg" onClick={onRetry}>
                  Try Again ({result.attemptsLeft} {result.attemptsLeft === 1 ? 'attempt' : 'attempts'} left)
                </Button>
              )}

              <Button
                variant={result.passed ? 'primary' : 'outline'}
                size="lg"
                onClick={() => navigate(`/student/courses/${courseId}/learn`)}
              >
                Continue Learning
              </Button>

              <Button
                variant="outline"
                size="lg"
                onClick={() => navigate('/student/dashboard')}
              >
                Back to Dashboard
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizResults;