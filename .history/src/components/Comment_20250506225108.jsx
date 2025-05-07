// src/components/CommentSection.jsx
import React, { useEffect, useState } from "react";

const Comment = ({ contentId, token }) => {
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchComments = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`http://127.0.0.1:5000/api/comment/${contentId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Failed to fetch comments");
      const data = await res.json();
      setComments(data);
    } catch (err) {
      setError("Could not load comments.");
      console.error("Error fetching comments:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchComments();
    }
  }, [contentId, token]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    setCommentText("");

    try {
      const res = await fetch("http://127.0.0.1:5000/api/comment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content_id: contentId, body: commentText }),
      });

      if (!res.ok) throw new Error("Failed to post comment");
      fetchComments(); // Refresh comments after successful post
    } catch (err) {
      setError("Failed to post comment.");
      console.error("Error posting comment:", err);
    }
  };

  return (
    <div className="mt-3">
      <form onSubmit={handleCommentSubmit}>
        <textarea
          rows="2"
          className="w-full p-2 border rounded-md text-sm"
          placeholder="Write your comment..."
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
        ></textarea>
        <div className="text-right mt-1">
          <button
            type="submit"
            className="bg-blue-500 text-white text-sm px-3 py-1 rounded hover:bg-blue-600 transition"
          >
            Post Comment
          </button>
        </div>
      </form>

      {error && <p className="text-red-500 mt-2 text-sm">{error}</p>}

      {loading ? (
        <p className="text-gray-500 mt-3 text-sm">Loading comments...</p>
      ) : (
        <div className="mt-4 space-y-2 text-sm">
          {comments.length === 0 ? (
            <p className="text-gray-500">No comments yet.</p>
          ) : (
            comments.map((comment) => (
              <div key={comment.id} className="border-b pb-1">
                <p className="font-semibold">{comment.user?.username}:</p>
                <p>{comment.body}</p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default Comment;
