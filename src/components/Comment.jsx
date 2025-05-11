import React, { useEffect, useState } from "react";

const Comment = ({ contentId, token }) => {
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [replyTexts, setReplyTexts] = useState({});
  const [replyingTo, setReplyingTo] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchComments = async () => {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:5000/api/content/${contentId}/comments`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error("Failed to fetch comments");
      const data = await res.json();
      setComments(data);
    } catch (err) {
      setError("Could not load comments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchComments();
  }, [token, contentId]);

  const handleSubmit = async (e, parentId = null) => {
    e.preventDefault();
    const text = parentId ? replyTexts[parentId] : commentText;
    if (!text?.trim()) return;

    try {
      const res = await fetch("http://localhost:5000/api/comment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          content_id: contentId,
          body: text,
          parent_id: parentId,
        }),
      });

      if (!res.ok) throw new Error("Failed to post comment");

      if (parentId) {
        setReplyTexts((prev) => ({ ...prev, [parentId]: "" }));
        setReplyingTo(null);
      } else {
        setCommentText("");
      }

      fetchComments();
    } catch (err) {
      setError("Failed to post comment");
    }
  };

  const renderComment = (comment, level = 0) => (
    <div key={comment.id} className={`ml-${level * 4} mt-4`}>
      <div className="flex gap-3 items-start">
        <img
          src={comment.user.profile_picture || "https://via.placeholder.com/40"}
          alt="avatar"
          className="w-8 h-8 rounded-full object-cover"
        />
        <div className="bg-gray-100 rounded-lg px-4 py-2 w-full">
          <p className="font-semibold text-sm">{comment.user.username}</p>
          <p className="text-sm text-gray-800">{comment.body}</p>
          <button
            onClick={() => setReplyingTo(comment.id)}
            className="text-xs text-blue-500 mt-1 hover:underline"
          >
            Reply
          </button>

          {replyingTo === comment.id && (
            <form
              onSubmit={(e) => handleSubmit(e, comment.id)}
              className="mt-2 space-y-1"
            >
              <textarea
                rows="2"
                className="w-full text-sm border rounded px-2 py-1"
                placeholder="Write a reply..."
                value={replyTexts[comment.id] || ""}
                onChange={(e) =>
                  setReplyTexts({ ...replyTexts, [comment.id]: e.target.value })
                }
              ></textarea>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setReplyingTo(null)}
                  className="text-xs text-gray-500 hover:underline"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="text-xs bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                >
                  Post Reply
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      {comment.replies?.map((reply) => renderComment(reply, level + 1))}
    </div>
  );

  return (
    <div className="mt-4">
      <form onSubmit={(e) => handleSubmit(e)} className="mb-4">
        <textarea
          rows="3"
          className="w-full border p-2 rounded text-sm"
          placeholder="Add a comment..."
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
        ></textarea>
        <div className="text-right mt-1">
          <button
            type="submit"
            className="bg-blue-500 text-white text-sm px-3 py-1 rounded hover:bg-blue-600"
          >
            Post Comment
          </button>
        </div>
      </form>

      {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
      {loading ? (
        <p className="text-gray-500 text-sm">Loading comments...</p>
      ) : (
        <div>{comments.map((comment) => renderComment(comment))}</div>
      )}
    </div>
  );
};

export default Comment;
