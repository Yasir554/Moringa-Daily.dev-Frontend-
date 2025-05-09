import React, { useEffect, useState } from 'react';
import UserNavbar from "./UserNavbar";
import Comment from "../components/Comment";
import { Heart, MessageCircle, Share2, Bookmark, X } from 'lucide-react';

const UserHome = () => {
  const [contents, setContents] = useState([]);
  const [likes, setLikes] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openComments, setOpenComments] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareEmail, setShareEmail] = useState('');
  const [currentShareContentId, setCurrentShareContentId] = useState(null);

  const token = localStorage.getItem("accessToken") || localStorage.getItem("token");

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [contentRes, likeRes, wishlistRes] = await Promise.all([
          fetch('http://localhost:5000/api/content'),
          fetch('http://localhost:5000/api/likes', {
            headers: { Authorization: `Bearer ${token}` }
          }),
          fetch('http://localhost:5000/api/wishlist', {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);

        if (!contentRes.ok) throw new Error("Failed to fetch content");

        const contentData = await contentRes.json();
        const likeData = await likeRes.ok ? await likeRes.json() : [];
        const wishlistData = await wishlistRes.ok ? await wishlistRes.json() : [];

        setContents(contentData);
        setLikes(likeData.map(like => like.content_id));
        setWishlist(wishlistData.map(item => item.content_id));
        setLoading(false);
      } catch (err) {
        console.error(err);
        setErrorMessage("Something went wrong.");
        setLoading(false);
      }
    };

    fetchAll();
  }, [token]);

  const handleAction = async (endpoint, contentId, payload = {}, onSuccess) => {
    try {
      const res = await fetch(`http://localhost:5000/api/${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content_id: contentId, ...payload }),
      });

      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      if (onSuccess) onSuccess(data);
    } catch (err) {
      console.error(`Error in ${endpoint}:`, err);
      setErrorMessage(`Failed to ${endpoint}.`);
    }
  };

  const toggleLike = (contentId) => {
    handleAction("like", contentId, {}, () => {
      setLikes(prev =>
        prev.includes(contentId)
          ? prev.filter(id => id !== contentId)
          : [...prev, contentId]
      );
    });
  };

  const toggleWishlist = (contentId) => {
    handleAction("wishlist", contentId, {}, () => {
      setWishlist(prev =>
        prev.includes(contentId)
          ? prev.filter(id => id !== contentId)
          : [...prev, contentId]
      );
    });
  };

  const openShareDialog = (contentId) => {
    setCurrentShareContentId(contentId);
    setShareEmail('');
    setShowShareModal(true);
  };

  const handleShareSubmit = async (e) => {
    e.preventDefault();
    if (!shareEmail) return setErrorMessage("Enter a valid email.");

    await handleAction("share", currentShareContentId, { shared_with: shareEmail });
    setShowShareModal(false);
  };

  if (loading) return <div className="text-center mt-10">Loading content...</div>;

  return (
    <>
      <UserNavbar />
      <div className="p-6 flex flex-col gap-6 w-[45%] mx-auto">
        {errorMessage && <div className="text-red-600 text-sm mb-4 text-center">{errorMessage}</div>}

        {contents.map(content => (
          <div key={content.id} className="bg-white shadow rounded-2xl p-4">
            <h2 className="text-xl font-semibold mb-2">{content.title}</h2>
            <p className="text-sm text-gray-600 mb-2">By: {content.user?.username}</p>

            {content.content_type === 'image' && <img src={content.file_url} alt={content.title} className="w-full rounded mb-2" />}
            {content.content_type === 'video' && <video controls className="w-full rounded mb-2"><source src={content.file_url} type="video/mp4" /></video>}

            <p className="text-gray-700 mb-4">{content.body}</p>

            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <button onClick={() => toggleLike(content.id)} className={`flex items-center gap-1 transition ${likes.includes(content.id) ? 'text-red-500' : 'hover:text-red-500'}`}>
                <Heart size={18} fill={likes.includes(content.id) ? 'currentColor' : 'none'} /> Like
              </button>
              <button onClick={() => setOpenComments(openComments === content.id ? null : content.id)} className="flex items-center gap-1 hover:text-blue-500 transition">
                <MessageCircle size={18} /> Comment
              </button>
              <button onClick={() => openShareDialog(content.id)} className="flex items-center gap-1 hover:text-green-600 transition">
                <Share2 size={18} /> Share
              </button>
              <button onClick={() => toggleWishlist(content.id)} className={`flex items-center gap-1 transition ${wishlist.includes(content.id) ? 'text-yellow-500' : 'hover:text-yellow-500'}`}>
                <Bookmark size={18} fill={wishlist.includes(content.id) ? 'currentColor' : 'none'} /> Wishlist
              </button>
            </div>

            {openComments === content.id && <Comment contentId={content.id} token={token} />}
          </div>
        ))}
      </div>

      {showShareModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-md w-[90%] max-w-md relative">
            <button className="absolute top-2 right-2 text-gray-500 hover:text-gray-700" onClick={() => setShowShareModal(false)}>
              <X size={20} />
            </button>
            <h2 className="text-lg font-bold mb-4">Share with someone</h2>
            <form onSubmit={handleShareSubmit}>
              <input type="email" placeholder="Enter email to share with" value={shareEmail} onChange={(e) => setShareEmail(e.target.value)} className="w-full p-2 border rounded mb-3 text-sm" required />
              <button type="submit" className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700">Share Content</button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default UserHome;
