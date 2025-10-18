/**
 * QuizQuestion Component
 * Renders different question types
 */

import React from 'react';

const QuizQuestion = ({ question, answer, onChange, questionNumber, darkMode = false }) => {
  const renderMultipleChoice = () => (
    <div className="space-y-3">
      {question.options.map((option, index) => (
        <label
          key={index}
          className={`flex items-start p-4 rounded-lg border-2 cursor-pointer transition-colors ${
            answer === option
              ? darkMode
                ? 'border-blue-500 bg-blue-900 bg-opacity-30'
                : 'border-blue-500 bg-blue-50'
              : darkMode
              ? 'border-gray-600 hover:border-gray-500 bg-gray-700'
              : 'border-gray-200 hover:border-gray-300 bg-white'
          }`}
        >
          <input
            type="radio"
            name={`question-${question.id}`}
            value={option}
            checked={answer === option}
            onChange={(e) => onChange(e.target.value)}
            className="mt-1 h-4 w-4 text-blue-600"
          />
          <span className={`ml-3 flex-1 ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>
            {option}
          </span>
        </label>
      ))}
    </div>
  );

  const renderTrueFalse = () => (
    <div className="space-y-3">
      {['True', 'False'].map((option) => (
        <label
          key={option}
          className={`flex items-center p-4 rounded-lg border-2 cursor-pointer transition-colors ${
            answer === option
              ? darkMode
                ? 'border-blue-500 bg-blue-900 bg-opacity-30'
                : 'border-blue-500 bg-blue-50'
              : darkMode
              ? 'border-gray-600 hover:border-gray-500 bg-gray-700'
              : 'border-gray-200 hover:border-gray-300 bg-white'
          }`}
        >
          <input
            type="radio"
            name={`question-${question.id}`}
            value={option}
            checked={answer === option}
            onChange={(e) => onChange(e.target.value)}
            className="h-4 w-4 text-blue-600"
          />
          <span className={`ml-3 font-medium ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>
            {option}
          </span>
        </label>
      ))}
    </div>
  );

  const renderShortAnswer = () => (
    <input
      type="text"
      value={answer || ''}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Type your answer here..."
      className={`w-full px-4 py-3 rounded-lg border-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
        darkMode
          ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
          : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
      }`}
    />
  );

  return (
    <div className={`p-6 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
      {/* Question Header */}
      <div className="flex items-start gap-4 mb-6">
        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold ${
          darkMode ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-600'
        }`}>
          {questionNumber}
        </div>
        <div className="flex-1">
          <h3 className={`text-lg font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            {question.question_text}
          </h3>
          <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            {question.points} {question.points === 1 ? 'point' : 'points'}
          </p>
        </div>
      </div>

      {/* Question Body */}
      <div className="ml-12">
        {question.question_type === 'multiple_choice' && renderMultipleChoice()}
        {question.question_type === 'true_false' && renderTrueFalse()}
        {question.question_type === 'short_answer' && renderShortAnswer()}
      </div>
    </div>
  );
};

export default QuizQuestion;