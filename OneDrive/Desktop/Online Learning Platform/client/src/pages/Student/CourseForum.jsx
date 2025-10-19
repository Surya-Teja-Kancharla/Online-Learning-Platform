/**
 * Course Forum Page
 * Main discussion forum for a course
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import forumService from '../../services/forumService';
import PostCard from '../../components/forum/PostCard';
import CreatePostModal from '../../components/forum/CreatePostModal';
import {
  MessageSquare,
  Plus,
  ArrowLeft,
  TrendingUp,
  Clock,
  Eye,
  Search,
} from 'lucide-react';

const CourseForum = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const toast = useToast();

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [sortBy, setSortBy] = useState('recent');
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    loadPosts();
  }, [courseId, sortBy, page]);

  const loadPosts = async () => {
    try {
      setLoading(true);
      const data = await forumService.getCoursePosts(courseId, {
        page,
        limit: 20,
        sort: sortBy,
      });

      if (page === 1) {
        setPosts(data.posts);
      } else {
        setPosts([...posts, ...data.posts]);
      }

      setHasMore(data.pagination.hasMore);
    } catch (error) {
      console.error('Error loading posts:', error);
      toast.error('Failed to load forum posts');
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = async (postData) => {
    try {
      await forumService.createPost({
        course_id: courseId,
        ...postData,
      });
      toast.success('Post created successfully!');
      setShowCreateModal(false);
      setPage(1);
      loadPosts();
    } catch (error) {
      console.error('Error creating post:', error);
      toast.error('Failed to create post');
    }
  };

  const handlePostClick = (postId) => {
    navigate(`/student/courses/${courseId}/forum/${postId}`);
  };

  const handleUpvote = async (postId) => {
    try {
      const result = await forumService.upvotePost(postId);
      
      // Update post in list
      setPosts(posts.map(post => 
        post.id === postId 
          ? { ...post, upvotes: result.upvotes, hasVoted: result.upvoted }
          : post
      ));
    } catch (error) {
      console.error('Error upvoting post:', error);
      toast.error(error.response?.data?.message || 'Failed to upvote post');
    }
  };

  const filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <button
            onClick={() => navigate(`/student/courses/${courseId}/learn`)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Course
          </button>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Course Discussion</h1>
              <p className="text-gray-600 mt-1">
                Ask questions, share insights, and help fellow students
              </p>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              <Plus className="w-4 h-4" />
              New Post
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6">
        {/* Filters & Search */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search discussions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            {/* Sort Options */}
            <div className="flex gap-2">
              <button
                onClick={() => setSortBy('recent')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  sortBy === 'recent'
                    ? 'bg-indigo-100 text-indigo-700'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Clock className="w-4 h-4" />
                Recent
              </button>
              <button
                onClick={() => setSortBy('popular')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  sortBy === 'popular'
                    ? 'bg-indigo-100 text-indigo-700'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <TrendingUp className="w-4 h-4" />
                Popular
              </button>
              <button
                onClick={() => setSortBy('views')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  sortBy === 'views'
                    ? 'bg-indigo-100 text-indigo-700'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Eye className="w-4 h-4" />
                Most Viewed
              </button>
            </div>
          </div>
        </div>

        {/* Posts List */}
        {loading && page === 1 ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No discussions yet
            </h3>
            <p className="text-gray-600 mb-6">
              Be the first to start a discussion in this course!
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              Create First Post
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredPosts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                onClick={() => handlePostClick(post.id)}
                onUpvote={() => handleUpvote(post.id)}
              />
            ))}

            {/* Load More */}
            {hasMore && !loading && (
              <button
                onClick={() => setPage(page + 1)}
                className="w-full py-3 bg-white border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Load More
              </button>
            )}

            {loading && page > 1 && (
              <div className="flex justify-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Create Post Modal */}
      {showCreateModal && (
        <CreatePostModal
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreatePost}
        />
      )}
    </div>
  );
};

export default CourseForum;