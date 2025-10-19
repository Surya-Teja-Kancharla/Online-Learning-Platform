/**
 * Post Card Component
 * Displays a forum post in the list
 */

import React from 'react';
import {
  MessageSquare,
  ArrowUp,
  Eye,
  Pin,
  Lock,
  User,
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const PostCard = ({ post, onClick, onUpvote }) => {
  const handleUpvoteClick = (e) => {
    e.stopPropagation();
    onUpvote();
  };

  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-lg shadow hover:shadow-md transition-all cursor-pointer overflow-hidden ${
        post.is_pinned ? 'border-l-4 border-yellow-500' : ''
      }`}
    >
      <div className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            {/* Badges */}
            <div className="flex items-center gap-2 mb-2">
              {post.is_pinned && (
                <span className="flex items-center gap-1 px-2 py-0.5 bg-yellow-100 text-yellow-800 text-xs font-semibold rounded">
                  <Pin className="w-3 h-3" />
                  Pinned
                </span>
              )}
              {post.is_locked && (
                <span className="flex items-center gap-1 px-2 py-0.5 bg-red-100 text-red-800 text-xs font-semibold rounded">
                  <Lock className="w-3 h-3" />
                  Locked
                </span>
              )}
              {post.author_role === 'instructor' && (
                <span className="px-2 py-0.5 bg-indigo-100 text-indigo-800 text-xs font-semibold rounded">
                  Instructor
                </span>
              )}
            </div>

            {/* Title */}
            <h3 className="text-lg font-bold text-gray-900 mb-1 hover:text-indigo-600 transition-colors">
              {post.title}
            </h3>

            {/* Content Preview */}
            <p className="text-gray-600 text-sm line-clamp-2 mb-3">
              {post.content.replace(/<[^>]*>/g, '').substring(0, 200)}
              {post.content.length > 200 && '...'}
            </p>

            {/* Author & Meta */}
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                {post.author_avatar ? (
                  <img
                    src={post.author_avatar}
                    alt={post.author_name}
                    className="w-6 h-6 rounded-full"
                  />
                ) : (
                  <div className="w-6 h-6 bg-indigo-100 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-indigo-600" />
                  </div>
                )}
                <span className="font-medium text-gray-900">
                  {post.author_name}
                </span>
              </div>

              <span>•</span>

              <span>
                {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
              </span>

              {post.updated_at !== post.created_at && (
                <>
                  <span>•</span>
                  <span className="text-gray-500">edited</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Footer Stats */}
        <div className="flex items-center gap-6 pt-3 border-t">
          {/* Upvote Button */}
          <button
            onClick={handleUpvoteClick}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors ${
              post.hasVoted
                ? 'bg-indigo-100 text-indigo-700'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <ArrowUp className="w-4 h-4" />
            <span className="font-semibold">{post.upvotes}</span>
          </button>

          {/* Comments */}
          <div className="flex items-center gap-2 text-gray-600">
            <MessageSquare className="w-4 h-4" />
            <span>{post.comment_count || 0}</span>
          </div>

          {/* Views */}
          <div className="flex items-center gap-2 text-gray-600">
            <Eye className="w-4 h-4" />
            <span>{post.views || 0}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostCard;