/**
 * QuizTaker Component
 * Interface for taking a quiz
 */

import React, { useState, useEffect } from 'react';
import QuizQuestion from './QuizQuestion';
import Button from '../common/Button';

const QuizTaker = ({ quiz, questions, onSubmit, darkMode = false }) => {
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(null);
  const [startTime] = useState(Date.now());

  // Initialize timer if time limit exists
  useEffect(() => {
    if (quiz.time_limit) {
      setTimeLeft(quiz.time_limit * 60); // Convert minutes to seconds
    }
  }, [quiz.time_limit]);

  // Countdown timer
  useEffect(() => {
    if (timeLeft === null || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleSubmit(); // Auto-submit when time runs out
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleAnswerChange = (questionId, answer) => {
    setAnswers({
      ...answers,
      [questionId]: answer,
    });
  };

  const handleSubmit = () => {
    const timeTaken = Math.floor((Date.now() - startTime) / 1000);
    onSubmit(answers, timeTaken);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const answeredCount = Object.keys(answers).filter(key => answers[key]).length;
  const totalQuestions = questions.length;
  const allAnswered = answeredCount === totalQuestions;
  const progressPercent = (answeredCount / totalQuestions) * 100;

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Header */}
      <div className={`sticky top-0 z-10 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b shadow`}>
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {quiz.title}
              </h1>
              {quiz.description && (
                <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {quiz.description}
                </p>
              )}
            </div>

            <div className="text-right">
              {timeLeft !== null && (
                <div className={`text-2xl font-bold ${
                  timeLeft < 60 ? 'text-red-500' : darkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  ⏱ {formatTime(timeLeft)}
                </div>
              )}
              <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Attempts: {quiz.totalAttempts || 0}/{quiz.max_attempts}
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-4">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                Progress: {answeredCount}/{totalQuestions} questions
              </span>
              <span className={`font-medium ${allAnswered ? 'text-green-500' : darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {Math.round(progressPercent)}%
              </span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ${allAnswered ? 'bg-green-500' : 'bg-blue-500'}`}
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Questions */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="space-y-6">
          {questions.map((question, index) => (
            <QuizQuestion
              key={question.id}
              question={question}
              answer={answers[question.id]}
              onChange={(answer) => handleAnswerChange(question.id, answer)}
              questionNumber={index + 1}
              darkMode={darkMode}
            />
          ))}
        </div>

        {/* Submit Button */}
        <div className={`mt-8 p-6 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
          <div className="flex items-center justify-between">
            <div>
              {!allAnswered && (
                <p className={`text-sm ${darkMode ? 'text-yellow-400' : 'text-yellow-600'}`}>
                  ⚠️ Please answer all questions before submitting
                </p>
              )}
              {allAnswered && (
                <p className={`text-sm ${darkMode ? 'text-green-400' : 'text-green-600'}`}>
                  ✓ All questions answered! Ready to submit
                </p>
              )}
            </div>

            <Button
              variant="primary"
              size="lg"
              onClick={handleSubmit}
              disabled={!allAnswered}
            >
              Submit Quiz
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizTaker;