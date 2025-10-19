/**
 * Post Detail Page
 * Shows full post with threaded comments
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import forumService from '../../services/forumService';
import CommentCard from '../../components/forum/CommentCard';
import CreatePostModal from '../../components/forum/CreatePostModal';
import {
  ArrowLeft,
  ArrowUp,
  MessageSquare,
  Eye,
  Edit,
  Trash2,
  Pin,
  Lock,
  User,
  Send,
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const PostDetail = () => {
  const { courseId, postId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const toast = useToast();

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [commentContent, setCommentContent] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    loadPost();
  }, [postId]);

  const loadPost = async () => {
    try {
      setLoading(true);
      const data = await forumService.getPostById(postId);
      setPost(data.post);
    } catch (error) {
      console.error('Error loading post:', error);
      toast.error('Failed to load post');
    } finally {
      setLoading(false);
    }
  };

  const handleUpvotePost = async () => {
    try {
      const result = await forumService.upvotePost(postId);
      setPost({
        ...post,
        upvotes: result.upvotes,
        hasVoted: result.upvoted,
      });
    } catch (error) {
      console.error('Error upvoting post:', error);
      toast.error(error.response?.data?.message || 'Failed to upvote post');
    }
  };

  const handleUpvoteComment = async (commentId) => {
    try {
      const result = await forumService.upvoteComment(commentId);
      
      // Update comment in list
      setPost({
        ...post,
        comments: post.comments.map(comment =>
          comment.id === commentId
            ? { ...comment, upvotes: result.upvoted ? comment.upvotes + 1 : comment.upvotes - 1, hasVoted: result.upvoted }
            : comment
        ),
      });
    } catch (error) {
      console.error('Error upvoting comment:', error);
      toast.error(error.response?.data?.message || 'Failed to upvote comment');
    }
  };

  const handleSubmitComment = async (e) => {
    e.preventDefault();

    if (commentContent.length < 1) {
      toast.error('Comment cannot be empty');
      return;
    }

    try {
      setSubmittingComment(true);
      await forumService.createComment({
        post_id: postId,
        content: commentContent,
      });
      
      toast.success('Comment posted!');
      setCommentContent('');
      loadPost(); // Reload to show new comment
    } catch (error) {
      console.error('Error posting comment:', error);
      toast.error('Failed to post comment');
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleEditPost = async (updateData) => {
    try {
      await forumService.updatePost(postId, updateData);
      toast.success('Post updated successfully');
      setShowEditModal(false);
      loadPost();
    } catch (error) {
      console.error('Error updating post:', error);
      toast.error('Failed to update post');
    }
  };

  const handleDeletePost = async () => {
    if (!window.confirm('Are you sure you want to delete this post?')) {
      return;
    }

    try {
      await forumService.deletePost(postId);
      toast.success('Post deleted');
      navigate(`/student/courses/${courseId}/forum`);
    } catch (error) {
      console.error('Error deleting post:', error);
      toast.error('Failed to delete post');
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) {
      return;
    }

    try {
      await forumService.deleteComment(commentId);
      toast.success('Comment deleted');
      loadPost();
    } catch (error) {
      console.error('Error deleting comment:', error);
      toast.error('Failed to delete comment');
    }
  };

  const canEditPost = post?.user_id === user?.id || ['instructor', 'admin'].includes(user?.role);
  const canModerate = ['instructor', 'admin'].includes(user?.role);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Post not found</h2>
          <button
            onClick={() => navigate(`/student/courses/${courseId}/forum`)}
            className="text-indigo-600 hover:underline"
          >
            ← Back to forum
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <button
            onClick={() => navigate(`/student/courses/${courseId}/forum`)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Forum
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Post */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="p-6">
            {/* Badges */}
            <div className="flex items-center gap-2 mb-3">
              {post.is_pinned && (
                <span className="flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-semibold rounded">
                  <Pin className="w-3 h-3" />
                  Pinned
                </span>
              )}
              {post.is_locked && (
                <span className="flex items-center gap-1 px-2 py-1 bg-red-100 text-red-800 text-xs font-semibold rounded">
                  <Lock className="w-3 h-3" />
                  Locked
                </span>
              )}
            </div>

            {/* Title */}
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{post.title}</h1>

            {/* Author & Meta */}
            <div className="flex items-center justify-between mb-6 pb-6 border-b">
              <div className="flex items-center gap-3">
                {post.author_avatar ? (
                  <img
                    src={post.author_avatar}
                    alt={post.author_name}
                    className="w-10 h-10 rounded-full"
                  />
                ) : (
                  <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-indigo-600" />
                  </div>
                )}
                <div>
                  <p className="font-semibold text-gray-900">{post.author_name}</p>
                  <p className="text-sm text-gray-600">
                    {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
                    {post.updated_at !== post.created_at && ' • edited'}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              {canEditPost && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowEditModal(true)}
                    className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleDeletePost}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            {/* Content */}
            <div className="prose max-w-none mb-6">
              <div dangerouslySetInnerHTML={{ __html: post.content }} />
            </div>

            {/* Stats & Actions */}
            <div className="flex items-center gap-6 pt-4 border-t">
              <button
                onClick={handleUpvotePost}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  post.hasVoted
                    ? 'bg-indigo-100 text-indigo-700'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <ArrowUp className="w-5 h-5" />
                <span className="font-semibold">{post.upvotes}</span>
              </button>

              <div className="flex items-center gap-2 text-gray-600">
                <MessageSquare className="w-5 h-5" />
                <span>{post.comments?.length || 0}</span>
              </div>

              <div className="flex items-center gap-2 text-gray-600">
                <Eye className="w-5 h-5" />
                <span>{post.views}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Comments Section */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b">
            <h2 className="text-xl font-bold text-gray-900">
              {post.comments?.length || 0} Comment{post.comments?.length !== 1 ? 's' : ''}
            </h2>
          </div>

          {/* Comment Form */}
          {!post.is_locked && (
            <form onSubmit={handleSubmitComment} className="p-6 border-b">
              <textarea
                value={commentContent}
                onChange={(e) => setCommentContent(e.target.value)}
                placeholder="Write a comment..."
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
              />
              <div className="flex justify-end mt-3">
                <button
                  type="submit"
                  disabled={submittingComment || !commentContent.trim()}
                  className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-4 h-4" />
                  {submittingComment ? 'Posting...' : 'Post Comment'}
                </button>
              </div>
            </form>
          )}

          {/* Comments List */}
          <div className="divide-y">
            {post.comments?.length === 0 ? (
              <div className="p-12 text-center text-gray-500">
                No comments yet. Be the first to comment!
              </div>
            ) : (
              post.comments?.map((comment) => (
                <CommentCard
                  key={comment.id}
                  comment={comment}
                  onUpvote={() => handleUpvoteComment(comment.id)}
                  onDelete={() => handleDeleteComment(comment.id)}
                  canDelete={comment.user_id === user?.id || canModerate}
                />
              ))
            )}
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {showEditModal && (
        <CreatePostModal
          initialData={{ title: post.title, content: post.content }}
          onClose={() => setShowEditModal(false)}
          onSubmit={handleEditPost}
        />
      )}
    </div>
  );
};

export default PostDetail;