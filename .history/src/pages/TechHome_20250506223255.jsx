import React, { useEffect, useState } from 'react';
import TechNavbar from "./TechNavbar";
import { Heart, MessageCircle, Share2, Bookmark } from 'lucide-react';

const TechHome = () => {
  const [contents, setContents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [commentContentId, setCommentContentId] = useState(null);
  const [commentText, setCommentText] = useState("");
  const [commentsMap, setCommentsMap] = useState({});

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetch('http://127.0.0.1:5000/api/content')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch content');
        return res.json();
      })
      .then(data => {
        setContents(data);
        setLoading(false);
        data.forEach(content => fetchComments(content.id)); // Fetch comments per content
      })
      .catch(err => {
        console.error('Error fetching content:', err);
        setLoading(false);
      });
  }, []);

  const fetchComments = async (contentId) => {
    try {
      const res = await fetch(`http://127.0.0.1:5000/api/content/${contentId}/comments`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (!res.ok) throw new Error('Failed to fetch comments');
      const data = await res.json();
      setCommentsMap(prev => ({ ...prev, [contentId]: data }));
    } catch (err) {
      console.error(`Error fetching comments for content ${contentId}:`, err);
    }
  };

  const handleAction = async (endpoint, contentId, payload = {}) => {
    try {
      const res = await fetch(`http://127.0.0.1:5000/api/${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content_id: contentId, ...payload }),
      });

      if (!res.ok) throw new Error(`Failed to ${endpoint}`);
      const data = await res.json();
      console.log(`${endpoint} success:`, data);

      if (endpoint === "comment") fetchComments(contentId); // Refresh comments
    } catch (err) {
      console.error(`Error in ${endpoint}:`, err);
    }
  };

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    handleAction("comment", commentContentId, { body: commentText });
    setCommentText("");
    setCommentContentId(null);
  };

  const renderComments = (comments) => {
    return comments.map(comment => (
      <div key={comment.id} className="ml-4 border-l pl-4 mt-2">
        <p className="text-sm font-semibold">{comment.user}</p>
        <p className="text-sm text-gray-700">{comment.body}</p>
        {comment.replies && comment.replies.length > 0 && renderComments(comment.replies)}
      </div>
    ));
  };

  if (loading) return <div className="text-center mt-10">Loading content...</div>;

  return (
    <>
      <TechNavbar />
      <div className="p-6 flex flex-col gap-6 w-[45%] mx-auto">
        {contents.map(content => (
          <div key={content.id} className="bg-white shadow rounded-2xl p-4">
            <h2 className="text-xl font-semibold mb-2">{content.title}</h2>
            <p className="text-sm text-gray-600 mb-2">By: {content.user?.username}</p>

            {content.content_type === 'image' && content.file_url && (
              <img src={content.file_url} alt={content.title} className="w-full rounded mb-2" />
            )}
            {content.content_type === 'video' && content.file_url && (
              <video controls className="w-full rounded mb-2">
                <source src={content.file_url} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            )}
            <p className="text-gray-700 mb-4">{content.body}</p>

            {/* Action Buttons */}
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <button onClick={() => handleAction("like", content.id)} className="flex items-center gap-1 hover:text-red-500 transition">
                <Heart size={18} />
                Like
              </button>
              <button onClick={() => setCommentContentId(content.id)} className="flex items-center gap-1 hover:text-blue-500 transition">
                <MessageCircle size={18} />
                Comment
              </button>
              <button onClick={() => handleAction("share", content.id)} className="flex items-center gap-1 hover:text-green-600 transition">
                <Share2 size={18} />
                Share
              </button>
              <button onClick={() => handleAction("wishlist", content.id)} className="flex items-center gap-1 hover:text-yellow-500 transition">
                <Bookmark size={18} />
                Wishlist
              </button>
            </div>

            {/* Comment Input */}
            {commentContentId === content.id && (
              <form onSubmit={handleCommentSubmit} className="mt-2">
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
            )}

            {/* Render Comments */}
            {commentsMap[content.id] && (
              <div className="mt-4">
                <h4 className="text-sm font-bold mb-2">Comments</h4>
                {renderComments(commentsMap[content.id])}
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );
};

export default TechHome;
