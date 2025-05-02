import React, { useState } from 'react';

const Comment = ({ comment, onAddReply, depth = 0 }) => {
  const [replyText, setReplyText] = useState('');
  const [isReplying, setIsReplying] = useState(false);

  const handleReplyChange = (e) => {
    setReplyText(e.target.value);
  };

  const handleReplySubmit = async (e) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    const token = localStorage.getItem('access_token');
    if (!token) {
      alert('Please login to reply.');
      return;
    }

    try {
      const res = await fetch(`http://localhost:5000/api/comments/${comment.id}/reply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content: replyText }),
      });

      if (res.ok) {
        const newReply = await res.json();
        onAddReply(comment.id, newReply); // Pass comment ID to know where to insert
        setReplyText('');
        setIsReplying(false);
      } else {
        console.error('Failed to reply.');
      }
    } catch (err) {
      console.error('Error replying:', err);
    }
  };

  return (
    <div className={`pl-${depth > 0 ? 6 : 0} border-l ${depth > 0 ? 'ml-4' : ''} mb-4`}>
      <p className="text-sm text-gray-800 mb-1">{comment.content || comment.body}</p>
      
      <button
        onClick={() => setIsReplying(!isReplying)}
        className="text-blue-500 text-xs hover:underline"
      >
        {isReplying ? 'Cancel' : 'Reply'}
      </button>

      {isReplying && (
        <form onSubmit={handleReplySubmit} className="mt-2">
          <input
            type="text"
            value={replyText}
            onChange={handleReplyChange}
            className="border p-2 w-full text-sm rounded"
            placeholder="Write your reply"
          />
          <button
            type="submit"
            className="mt-2 px-3 py-1 bg-blue-600 text-white text-sm rounded"
          >
            Post Reply
          </button>
        </form>
      )}

      {/* Nested Replies */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="mt-2 space-y-2">
          {comment.replies.map((reply) => (
            <Comment
              key={reply.id}
              comment={reply}
              onAddReply={onAddReply}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Comment;
