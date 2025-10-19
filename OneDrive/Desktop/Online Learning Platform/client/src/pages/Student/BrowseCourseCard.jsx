import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Clock, 
  Users, 
  BookOpen, 
  Star, 
  TrendingUp,
  Award
} from 'lucide-react';

/**
 * BrowseCourseCard Component
 * Displays a course card in the browse courses page with course details
 */
const BrowseCourseCard = ({ course }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/student/course/${course.id}`);
  };

  const handleEnrollClick = (e) => {
    e.stopPropagation();
    navigate(`/student/course/${course.id}`);
  };

  // Calculate average rating
  const averageRating = course.rating || 4.5;
  const enrollmentCount = course.enrolled_count || 0;
  const lessonCount = course.lesson_count || 0;

  // Format duration
  const formatDuration = (minutes) => {
    if (!minutes) return 'N/A';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  // Determine difficulty badge color
  const getDifficultyColor = (level) => {
    switch(level?.toLowerCase()) {
      case 'beginner':
        return 'bg-green-100 text-green-800';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800';
      case 'advanced':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div 
      onClick={handleCardClick}
      className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden group"
    >
      {/* Course Thumbnail */}
      <div className="relative h-48 bg-gradient-to-br from-indigo-500 to-purple-600 overflow-hidden">
        {course.thumbnail_url ? (
          <img 
            src={course.thumbnail_url} 
            alt={course.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <BookOpen className="w-16 h-16 text-white opacity-50" />
          </div>
        )}
        
        {/* Difficulty Badge */}
        <div className="absolute top-3 left-3">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getDifficultyColor(course.difficulty_level)}`}>
            {course.difficulty_level || 'All Levels'}
          </span>
        </div>

        {/* Price Badge */}
        <div className="absolute top-3 right-3">
          <span className="bg-white px-3 py-1 rounded-full text-sm font-bold text-indigo-600">
            {course.price > 0 ? `$${course.price}` : 'Free'}
          </span>
        </div>
      </div>

      {/* Course Content */}
      <div className="p-5">
        {/* Category */}
        {course.category && (
          <div className="flex items-center gap-2 text-indigo-600 text-xs font-semibold mb-2">
            <Award className="w-3 h-3" />
            <span>{course.category}</span>
          </div>
        )}

        {/* Title */}
        <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-2 group-hover:text-indigo-600 transition-colors">
          {course.title}
        </h3>

        {/* Description */}
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
          {course.description || 'Enhance your skills with this comprehensive course.'}
        </p>

        {/* Instructor */}
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
            <span className="text-indigo-600 font-semibold text-sm">
              {course.instructor_name?.charAt(0).toUpperCase() || 'I'}
            </span>
          </div>
          <span className="text-sm text-gray-700 font-medium">
            {course.instructor_name || 'Expert Instructor'}
          </span>
        </div>

        {/* Stats Row */}
        <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
          {/* Rating */}
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="font-semibold">{averageRating.toFixed(1)}</span>
            <span className="text-gray-400">({course.reviews_count || 0})</span>
          </div>

          {/* Enrollment Count */}
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            <span>{enrollmentCount.toLocaleString()}</span>
          </div>

          {/* Lessons Count */}
          <div className="flex items-center gap-1">
            <BookOpen className="w-4 h-4" />
            <span>{lessonCount} lessons</span>
          </div>
        </div>

        {/* Duration */}
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
          <Clock className="w-4 h-4" />
          <span>{formatDuration(course.duration_minutes)}</span>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200 my-4"></div>

        {/* Bottom Row - Enroll Button */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-sm text-green-600 font-semibold">
            <TrendingUp className="w-4 h-4" />
            <span>Popular</span>
          </div>
          
          <button
            onClick={handleEnrollClick}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700 transition-colors"
          >
            View Course
          </button>
        </div>
      </div>
    </div>
  );
};

export default BrowseCourseCard;