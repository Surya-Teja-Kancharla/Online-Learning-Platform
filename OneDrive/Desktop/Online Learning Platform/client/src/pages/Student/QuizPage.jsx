/**
 * Quiz Page
 * Take quizzes, submit answers, view scores, retry logic
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import {
  ArrowLeft,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Trophy,
  RotateCcw,
} from 'lucide-react';

const QuizPage = () => {
  const { courseId, quizId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const toast = useToast();

  const [quiz, setQuiz] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(null);
  const [attempts, setAttempts] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadQuiz();
  }, [quizId]);

  useEffect(() => {
    if (timeLeft === null || timeLeft === 0 || submitted) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, submitted]);

  const loadQuiz = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');

      const response = await fetch(`http://localhost:5000/api/quizzes/${quizId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();
      const quizData = data.data.quiz;

      setQuiz(quizData);
      setQuestions(quizData.questions || []);
      setTimeLeft(quizData.time_limit_minutes ? quizData.time_limit_minutes * 60 : null);

      // Load previous attempts
      const attemptsRes = await fetch(
        `http://localhost:5000/api/quiz-submissions/quiz/${quizId}/attempts`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const attemptsData = await attemptsRes.json();
      setAttempts(attemptsData.data?.attempts || 0);
    } catch (error) {
      console.error('Error loading quiz:', error);
      toast.error('Failed to load quiz');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSelect = (questionId, optionIndex) => {
    if (submitted) return;
    setAnswers({ ...answers, [questionId]: optionIndex });
  };

  const handleSubmit = async () => {
    try {
      // Calculate score
      let correctCount = 0;
      questions.forEach((q) => {
        if (answers[q.id] === q.correct) {
          correctCount++;
        }
      });

      const percentage = Math.round((correctCount / questions.length) * 100);
      setScore(percentage);
      setSubmitted(true);

      // Submit to backend
      const token = localStorage.getItem('token');
      await fetch(`http://localhost:5000/api/quiz-submissions/submit`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          quiz_id: parseInt(quizId),
          answers: answers,
          score: correctCount,
          total_questions: questions.length,
        }),
      });

      const passed = percentage >= (quiz?.passing_score || 70);
      if (passed) {
        toast.success(`🎉 Congratulations! You passed with ${percentage}%`);
      } else {
        toast.error(`You scored ${percentage}%. Passing score is ${quiz?.passing_score || 70}%`);
      }
    } catch (error) {
      console.error('Error submitting quiz:', error);
      toast.error('Failed to submit quiz');
    }
  };

  const handleRetry = () => {
    if (attempts >= (quiz?.max_attempts || 3)) {
      toast.error('Maximum attempts reached');
      return;
    }
    setAnswers({});
    setSubmitted(false);
    setScore(0);
    setTimeLeft(quiz.time_limit_minutes ? quiz.time_limit_minutes * 60 : null);
    toast.success('Quiz reset! Good luck!');
  };

  const formatTime = (seconds) => {
    if (!seconds) return '';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  const allAnswered = questions.every((q) => answers[q.id] !== undefined);
  const canRetry = submitted && attempts < (quiz?.max_attempts || 3);
  const passed = score >= (quiz?.passing_score || 70);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate(`/student/courses/${courseId}/learn`)}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Course
            </button>
            {timeLeft !== null && !submitted && (
              <div className="flex items-center gap-2 text-lg font-semibold">
                <Clock className="w-5 h-5 text-orange-500" />
                <span className={timeLeft < 60 ? 'text-red-600' : 'text-gray-900'}>
                  {formatTime(timeLeft)}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Quiz Header */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold mb-2">{quiz?.title}</h1>
              <p className="text-gray-600">{quiz?.description}</p>
            </div>
            {submitted && (
              <div className="text-right">
                <div className="text-3xl font-bold text-indigo-600">{score}%</div>
                <div className="text-sm text-gray-600">Your Score</div>
              </div>
            )}
          </div>

          <div className="flex items-center gap-6 mt-4 text-sm text-gray-600">
            <div>
              <span className="font-semibold">Questions:</span> {questions.length}
            </div>
            <div>
              <span className="font-semibold">Passing Score:</span> {quiz?.passing_score || 70}%
            </div>
            <div>
              <span className="font-semibold">Attempts:</span> {attempts}/{quiz?.max_attempts || 3}
            </div>
          </div>
        </div>

        {/* Result Banner */}
        {submitted && (
          <div
            className={`rounded-lg p-6 mb-6 flex items-center gap-4 ${
              passed
                ? 'bg-green-50 border border-green-200'
                : 'bg-red-50 border border-red-200'
            }`}
          >
            {passed ? (
              <>
                <Trophy className="w-8 h-8 text-green-600" />
                <div>
                  <h3 className="font-bold text-green-900">Congratulations! You Passed!</h3>
                  <p className="text-green-700">
                    You scored {score}% and passed the quiz.
                  </p>
                </div>
              </>
            ) : (
              <>
                <AlertCircle className="w-8 h-8 text-red-600" />
                <div className="flex-1">
                  <h3 className="font-bold text-red-900">Not Quite There</h3>
                  <p className="text-red-700">
                    You scored {score}%. You need {quiz?.passing_score || 70}% to pass.
                  </p>
                </div>
                {canRetry && (
                  <button
                    onClick={handleRetry}
                    className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                  >
                    <RotateCcw className="w-4 h-4" />
                    Retry Quiz
                  </button>
                )}
              </>
            )}
          </div>
        )}

        {/* Questions */}
        <div className="space-y-6">
          {questions.map((question, qIndex) => {
            const userAnswer = answers[question.id];
            const isCorrect = submitted && userAnswer === question.correct;
            const isWrong = submitted && userAnswer !== undefined && userAnswer !== question.correct;

            return (
              <div
                key={question.id}
                className={`bg-white rounded-lg shadow p-6 ${
                  submitted
                    ? isCorrect
                      ? 'border-l-4 border-green-500'
                      : isWrong
                      ? 'border-l-4 border-red-500'
                      : ''
                    : ''
                }`}
              >
                <div className="flex items-start gap-3 mb-4">
                  <span className="flex-shrink-0 w-8 h-8 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-semibold">
                    {qIndex + 1}
                  </span>
                  <p className="text-lg font-medium flex-1">{question.question}</p>
                  {submitted && (
                    <div>
                      {isCorrect ? (
                        <CheckCircle className="w-6 h-6 text-green-600" />
                      ) : isWrong ? (
                        <XCircle className="w-6 h-6 text-red-600" />
                      ) : null}
                    </div>
                  )}
                </div>

                <div className="space-y-2 ml-11">
                  {question.options?.map((option, optIndex) => {
                    const isSelected = userAnswer === optIndex;
                    const isCorrectOption = submitted && optIndex === question.correct;

                    return (
                      <button
                        key={optIndex}
                        onClick={() => handleAnswerSelect(question.id, optIndex)}
                        disabled={submitted}
                        className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                          submitted
                            ? isCorrectOption
                              ? 'border-green-500 bg-green-50'
                              : isSelected && !isCorrectOption
                              ? 'border-red-500 bg-red-50'
                              : 'border-gray-200'
                            : isSelected
                            ? 'border-indigo-500 bg-indigo-50'
                            : 'border-gray-200 hover:border-indigo-300'
                        } ${submitted ? 'cursor-default' : 'cursor-pointer'}`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                              submitted
                                ? isCorrectOption
                                  ? 'border-green-500 bg-green-500'
                                  : isSelected
                                  ? 'border-red-500 bg-red-500'
                                  : 'border-gray-300'
                                : isSelected
                                ? 'border-indigo-500 bg-indigo-500'
                                : 'border-gray-300'
                            }`}
                          >
                            {isSelected && (
                              <div className="w-2 h-2 bg-white rounded-full"></div>
                            )}
                          </div>
                          <span>{option}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Submit Button */}
        {!submitted && (
          <div className="mt-8 flex justify-center">
            <button
              onClick={handleSubmit}
              disabled={!allAnswered}
              className="px-8 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Submit Quiz
            </button>
          </div>
        )}

        {/* Navigation */}
        {submitted && (
          <div className="mt-8 flex justify-center gap-4">
            <button
              onClick={() => navigate(`/student/courses/${courseId}/learn`)}
              className="px-6 py-3 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300"
            >
              Back to Course
            </button>
            {canRetry && !passed && (
              <button
                onClick={handleRetry}
                className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700"
              >
                Try Again
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizPage;