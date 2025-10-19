/**
 * Comment Card Component
 * Displays a single comment with actions
 */

import React from 'react';
import { ArrowUp, User, Trash2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const CommentCard = ({ comment, onUpvote, onDelete, canDelete }) => {
  return (
    <div className="p-6 hover:bg-gray-50 transition-colors">
      <div className="flex gap-4">
        {/* Author Avatar */}
        <div className="flex-shrink-0">
          {comment.author_avatar ? (
            <img
              src={comment.author_avatar}
              alt={comment.author_name}
              className="w-10 h-10 rounded-full"
            />
          ) : (
            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-gray-600" />
            </div>
          )}
        </div>

        {/* Comment Content */}
        <div className="flex-1">
          {/* Author & Time */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-gray-900">
                {comment.author_name}
              </span>
              {comment.author_role === 'instructor' && (
                <span className="px-2 py-0.5 bg-indigo-100 text-indigo-800 text-xs font-semibold rounded">
                  Instructor
                </span>
              )}
              <span className="text-sm text-gray-500">
                {formatDistanceToNow(new Date(comment.created_at), {
                  addSuffix: true,
                })}
              </span>
              {comment.updated_at !== comment.created_at && (
                <span className="text-sm text-gray-500">• edited</span>
              )}
            </div>

            {/* Delete Button */}
            {canDelete && (
              <button
                onClick={onDelete}
                className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Content */}
          <div className="prose prose-sm max-w-none mb-3">
            <div dangerouslySetInnerHTML={{ __html: comment.content }} />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <button
              onClick={onUpvote}
              className={`flex items-center gap-1 px-2 py-1 rounded transition-colors ${
                comment.hasVoted
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <ArrowUp className="w-4 h-4" />
              <span className="text-sm font-semibold">{comment.upvotes}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommentCard;