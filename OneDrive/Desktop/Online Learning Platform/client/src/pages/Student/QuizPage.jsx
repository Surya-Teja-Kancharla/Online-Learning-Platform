/**
 * QuizPage Component
 * Main page for taking quizzes
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import QuizTaker from '../../components/quiz/QuizTaker';
import QuizResults from '../../components/quiz/QuizResults';
import quizService from '../../services/quizService';
import { useToast } from '../../context/ToastContext';
import Button from '../../components/common/Button';

const QuizPage = () => {
  const { courseId, quizId } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const [quiz, setQuiz] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    loadQuiz();
  }, [quizId]);

  const loadQuiz = async () => {
    try {
      setLoading(true);
      setResult(null);
      const data = await quizService.getQuizForStudent(quizId);
      setQuiz(data.quiz);
      setQuestions(data.questions);
    } catch (error) {
      toast.error(error.message || 'Failed to load quiz');
      navigate(`/student/courses/${courseId}/learn`);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (answers, timeTaken) => {
    try {
      setSubmitting(true);
      const resultData = await quizService.submitQuiz(quizId, answers, timeTaken);
      setResult(resultData);
      toast.success('Quiz submitted successfully!');
    } catch (error) {
      toast.error(error.message || 'Failed to submit quiz');
    } finally {
      setSubmitting(false);
    }
  };

  const handleRetry = () => {
    loadQuiz();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading quiz...</p>
        </div>
      </div>
    );
  }

  if (submitting) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Submitting your answers...</p>
          <p className="text-gray-500 text-sm mt-2">Please wait while we grade your quiz</p>
        </div>
      </div>
    );
  }

  if (result) {
    return (
      <QuizResults
        result={result}
        quiz={quiz}
        courseId={courseId}
        onRetry={handleRetry}
        darkMode={darkMode}
      />
    );
  }

  if (!quiz || !questions || questions.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <svg className="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Quiz Not Available</h2>
          <p className="text-gray-600 mb-6">This quiz is not available or has no questions.</p>
          <Button
            variant="primary"
            onClick={() => navigate(`/student/courses/${courseId}/learn`)}
          >
            Back to Course
          </Button>
        </div>
      </div>
    );
  }

  return (
    <QuizTaker
      quiz={quiz}
      questions={questions}
      onSubmit={handleSubmit}
      darkMode={darkMode}
    />
  );
};

export default QuizPage;