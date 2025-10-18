/**
 * CourseForm Component
 * Form for creating and editing courses with file uploads
 */

import React, { useState, useEffect } from 'react';
import Input from '../common/Input';
import Button from '../common/Button';
import ProgressBar from '../common/ProgressBar';
import { useToast } from '../../context/ToastContext';

const CourseForm = ({ course = null, onSubmit, onCancel, isSubmitting }) => {
  const toast = useToast();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    difficulty: 'beginner',
    price: '0',
    duration: '',
    language: 'English',
    syllabus: '',
    requirements: '',
    learning_outcomes: '',
  });

  const [files, setFiles] = useState({
    video: null,
    thumbnail: null,
  });

  const [previews, setPreviews] = useState({
    thumbnail: null,
  });

  const [uploadProgress, setUploadProgress] = useState(0);
  const [errors, setErrors] = useState({});

  // Populate form if editing existing course
  useEffect(() => {
    if (course) {
      setFormData({
        title: course.title || '',
        description: course.description || '',
        category: course.category || '',
        difficulty: course.difficulty || 'beginner',
        price: course.price?.toString() || '0',
        duration: course.duration?.toString() || '',
        language: course.language || 'English',
        syllabus: course.syllabus || '',
        requirements: course.requirements || '',
        learning_outcomes: course.learning_outcomes || '',
      });

      if (course.thumbnail_url) {
        setPreviews({ thumbnail: course.thumbnail_url });
      }
    }
  }, [course]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  const handleFileChange = (e) => {
    const { name, files: selectedFiles } = e.target;
    const file = selectedFiles[0];

    if (!file) return;

    // Validate file size
    const maxSizes = {
      video: 500 * 1024 * 1024, // 500MB
      thumbnail: 5 * 1024 * 1024, // 5MB
    };

    if (file.size > maxSizes[name]) {
      toast.error(`File too large. Maximum size: ${name === 'video' ? '500MB' : '5MB'}`);
      return;
    }

    // Validate file type
    const validTypes = {
      video: ['video/mp4', 'video/webm', 'video/ogg'],
      thumbnail: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'],
    };

    if (!validTypes[name].includes(file.type)) {
      toast.error(`Invalid file type for ${name}`);
      return;
    }

    setFiles(prev => ({
      ...prev,
      [name]: file
    }));

    // Create preview for thumbnail
    if (name === 'thumbnail') {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviews(prev => ({
          ...prev,
          thumbnail: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }

    // Clear error
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title || formData.title.length < 5) {
      newErrors.title = 'Title must be at least 5 characters';
    }

    if (!formData.description || formData.description.length < 20) {
      newErrors.description = 'Description must be at least 20 characters';
    }

    if (!formData.category) {
      newErrors.category = 'Category is required';
    }

    if (!formData.difficulty) {
      newErrors.difficulty = 'Difficulty level is required';
    }

    const price = parseFloat(formData.price);
    if (isNaN(price) || price < 0) {
      newErrors.price = 'Price must be a positive number';
    }

    if (formData.duration && (isNaN(formData.duration) || formData.duration < 0)) {
      newErrors.duration = 'Duration must be a positive number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    // Create FormData
    const data = new FormData();
    
    Object.keys(formData).forEach(key => {
      if (formData[key]) {
        data.append(key, formData[key]);
      }
    });

    if (files.video) {
      data.append('video', files.video);
    }

    if (files.thumbnail) {
      data.append('thumbnail', files.thumbnail);
    }

    try {
      await onSubmit(data, setUploadProgress);
      setUploadProgress(0);
    } catch (error) {
      setUploadProgress(0);
      toast.error(error.message || 'Failed to save course');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
        
        <div className="space-y-4">
          <Input
            label="Course Title *"
            name="title"
            value={formData.title}
            onChange={handleChange}
            error={errors.title}
            placeholder="e.g., Complete Web Development Bootcamp"
            maxLength={255}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.description ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Describe what students will learn in this course..."
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Category *"
              name="category"
              value={formData.category}
              onChange={handleChange}
              error={errors.category}
              placeholder="e.g., Web Development"
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Difficulty Level *
              </label>
              <select
                name="difficulty"
                value={formData.difficulty}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.difficulty ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
              {errors.difficulty && (
                <p className="mt-1 text-sm text-red-600">{errors.difficulty}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              label="Price ($)"
              name="price"
              type="number"
              min="0"
              step="0.01"
              value={formData.price}
              onChange={handleChange}
              error={errors.price}
              placeholder="0.00"
            />

            <Input
              label="Duration (minutes)"
              name="duration"
              type="number"
              min="0"
              value={formData.duration}
              onChange={handleChange}
              error={errors.duration}
              placeholder="e.g., 120"
            />

            <Input
              label="Language"
              name="language"
              value={formData.language}
              onChange={handleChange}
              placeholder="English"
            />
          </div>
        </div>
      </div>

      {/* Course Content */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Course Content</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Syllabus
            </label>
            <textarea
              name="syllabus"
              value={formData.syllabus}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Module 1: Introduction&#10;Module 2: Advanced Topics&#10;..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Requirements
            </label>
            <textarea
              name="requirements"
              value={formData.requirements}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Basic computer skills&#10;No programming experience required&#10;..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Learning Outcomes
            </label>
            <textarea
              name="learning_outcomes"
              value={formData.learning_outcomes}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Build websites from scratch&#10;Master HTML, CSS, and JavaScript&#10;..."
            />
          </div>
        </div>
      </div>

      {/* File Uploads */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Media Files</h3>
        
        <div className="space-y-4">
          {/* Thumbnail Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Course Thumbnail (Max 5MB)
            </label>
            <input
              type="file"
              name="thumbnail"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {previews.thumbnail && (
              <div className="mt-4">
                <img 
                  src={previews.thumbnail} 
                  alt="Thumbnail preview" 
                  className="w-48 h-32 object-cover rounded-lg"
                />
              </div>
            )}
          </div>

          {/* Video Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Intro Video (Max 500MB)
            </label>
            <input
              type="file"
              name="video"
              accept="video/*"
              onChange={handleFileChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {files.video && (
              <p className="mt-2 text-sm text-gray-600">
                Selected: {files.video.name} ({(files.video.size / 1024 / 1024).toFixed(2)} MB)
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Upload Progress */}
      {uploadProgress > 0 && uploadProgress < 100 && (
        <div className="bg-white rounded-lg shadow p-6">
          <ProgressBar 
            progress={uploadProgress} 
            label="Uploading..." 
            variant="primary"
          />
        </div>
      )}

      {/* Form Actions */}
      <div className="flex items-center justify-end gap-4">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="primary"
          disabled={isSubmitting}
          loading={isSubmitting}
        >
          {course ? 'Update Course' : 'Create Course'}
        </Button>
      </div>
    </form>
  );
};

export default CourseForm;