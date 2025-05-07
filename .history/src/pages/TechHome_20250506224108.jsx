import React, { useEffect, useState } from 'react';
import TechNavbar from "./TechNavbar";
import Comment from "../components/Comment";
import { Heart, MessageCircle, Share2, Bookmark } from 'lucide-react';

const TechHome = () => {
  const [contents, setContents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openComments, setOpenComments] = useState(null);

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
      })
      .catch(err => {
        console.error('Error fetching content:', err);
        setLoading(false);
      });
  }, []);

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
    } catch (err) {
      console.error(`Error in ${endpoint}:`, err);
    }
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
              <button onClick={() => setOpenComments(openComments === content.id ? null : content.id)} className="flex items-center gap-1 hover:text-blue-500 transition">
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

            {/* Comment Section */}
            {openComments === content.id && <CommentSection contentId={content.id} token={token} />}
          </div>
        ))}
      </div>
    </>
  );
};

export default TechHome;
