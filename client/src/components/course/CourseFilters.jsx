/**
 * CourseFilters Component
 * Advanced filtering for course browsing
 */

import React, { useState } from 'react';
import Button from '../common/Button';

const CourseFilters = ({ onFilterChange, onReset }) => {
  const [filters, setFilters] = useState({
    category: '',
    difficulty: '',
    minPrice: '',
    maxPrice: '',
    search: '',
  });

  const categories = [
    'Web Development',
    'Mobile Development',
    'Data Science',
    'Machine Learning',
    'Artificial Intelligence',
    'DevOps',
    'Cybersecurity',
    'Cloud Computing',
    'UI/UX Design',
    'Digital Marketing',
    'Business',
    'Photography',
    'Music',
    'Language Learning',
  ];

  const handleChange = (field, value) => {
    const newFilters = { ...filters, [field]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleReset = () => {
    const resetFilters = {
      category: '',
      difficulty: '',
      minPrice: '',
      maxPrice: '',
      search: '',
    };
    setFilters(resetFilters);
    onReset();
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
        <button
          onClick={handleReset}
          className="text-sm text-blue-600 hover:text-blue-700 font-medium"
        >
          Reset All
        </button>
      </div>

      <div className="space-y-6">
        {/* Search */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Search Courses
          </label>
          <div className="relative">
            <input
              type="text"
              value={filters.search}
              onChange={(e) => handleChange('search', e.target.value)}
              placeholder="Search by title, description..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <svg
              className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category
          </label>
          <select
            value={filters.category}
            onChange={(e) => handleChange('category', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        {/* Difficulty */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Difficulty Level
          </label>
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="radio"
                name="difficulty"
                value=""
                checked={filters.difficulty === ''}
                onChange={(e) => handleChange('difficulty', e.target.value)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">All Levels</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="difficulty"
                value="beginner"
                checked={filters.difficulty === 'beginner'}
                onChange={(e) => handleChange('difficulty', e.target.value)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">Beginner</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="difficulty"
                value="intermediate"
                checked={filters.difficulty === 'intermediate'}
                onChange={(e) => handleChange('difficulty', e.target.value)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">Intermediate</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="difficulty"
                value="advanced"
                checked={filters.difficulty === 'advanced'}
                onChange={(e) => handleChange('difficulty', e.target.value)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">Advanced</span>
            </label>
          </div>
        </div>

        {/* Price Range */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Price Range
          </label>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <input
                type="number"
                value={filters.minPrice}
                onChange={(e) => handleChange('minPrice', e.target.value)}
                placeholder="Min $"
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <input
                type="number"
                value={filters.maxPrice}
                onChange={(e) => handleChange('maxPrice', e.target.value)}
                placeholder="Max $"
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Apply Button */}
        <Button
          variant="primary"
          fullWidth
          onClick={() => onFilterChange(filters)}
        >
          Apply Filters
        </Button>
      </div>
    </div>
  );
};

export default CourseFilters;