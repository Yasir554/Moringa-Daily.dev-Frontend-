import React, { useEffect, useState } from 'react';
import TechNavbar from "./TechNavbar";
import Comment from "../components/Comment";
import { Heart, MessageCircle, Share2, Bookmark, X } from 'lucide-react';

const TechHome = () => {
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

  const parseMedia = (media) => {
    if (!media) return [];
    if (typeof media === "string") {
      try {
        return JSON.parse(media);
      } catch {
        return [];
      }
    }
    return Array.isArray(media) ? media : [];
  };

  if (loading) return <div className="text-center mt-10">Loading content...</div>;

  return (
    <>
      <TechNavbar />
      <div className="bg-white min-h-screen py-6 px-2">
        <div className="flex flex-col gap-6 max-w-2xl mx-auto">
          {errorMessage && <div className="text-red-600 text-sm mb-4 text-center">{errorMessage}</div>}

          {contents.map(content => {
            const mediaUrls = parseMedia(content.media_urls);

            return (
              <div key={content.id} className="bg-gray-100 rounded-2xl shadow-md p-4 space-y-3 border border-gray-200">
                {/* Profile Info */}
                <div className="flex items-center gap-3">
                  <img
                    src={content.author?.profile?.profile_picture || "/default-avatar.png"}
                    alt="avatar"
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-semibold text-sm">{content.author?.username || 'Unknown'}</p>
                  </div>
                </div>

                {/* Text */}
                {content.title && <p className="text-base font-semibold text-gray-800">{content.title}</p>}
                <p className="text-sm text-gray-700">{content.body}</p>

                {/* Media */}
                {mediaUrls.length > 0 && (
                  <div className="rounded overflow-hidden space-y-3">
                    {mediaUrls.map((url, index) => {
                      const isVideo = url.endsWith(".mp4") || url.includes("video/upload");
                      return isVideo ? (
                        <video key={index} controls className="w-full max-h-[500px] rounded-lg">
                          <source src={url} type="video/mp4" />
                        </video>
                      ) : (
                        <img
                          key={index}
                          src={url}
                          alt={`media-${index}`}
                          className="w-full max-h-[500px] object-cover rounded-lg"
                        />
                      );
                    })}
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex justify-between items-center pt-2 border-t text-sm text-gray-600">
                  <button
                    onClick={() => toggleLike(content.id)}
                    className={`flex items-center gap-1 ${likes.includes(content.id) ? 'text-red-500' : 'hover:text-red-500'}`}
                  >
                    <Heart size={18} fill={likes.includes(content.id) ? 'currentColor' : 'none'} />
                    Like
                  </button>
                  <button
                    onClick={() => setOpenComments(openComments === content.id ? null : content.id)}
                    className="flex items-center gap-1 hover:text-blue-600"
                  >
                    <MessageCircle size={18} /> Comments
                  </button>
                  <button
                    onClick={() => openShareDialog(content.id)}
                    className="flex items-center gap-1 hover:text-green-600"
                  >
                    <Share2 size={18} /> Share
                  </button>
                  <button
                    onClick={() => toggleWishlist(content.id)}
                    className={`flex items-center gap-1 ${wishlist.includes(content.id) ? 'text-yellow-500' : 'hover:text-yellow-500'}`}
                  >
                    <Bookmark size={18} fill={wishlist.includes(content.id) ? 'currentColor' : 'none'} />
                    Save
                  </button>
                </div>

                {openComments === content.id && (
                  <div className="mt-3">
                    <Comment contentId={content.id} token={token} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-md w-[90%] max-w-md relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              onClick={() => setShowShareModal(false)}
            >
              <X size={20} />
            </button>
            <h2 className="text-lg font-bold mb-4">Share with someone</h2>
            <form onSubmit={handleShareSubmit}>
              <input
                type="email"
                placeholder="Enter email to share with"
                value={shareEmail}
                onChange={(e) => setShareEmail(e.target.value)}
                className="w-full p-2 border rounded mb-3 text-sm"
                required
              />
              <button
                type="submit"
                className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
              >
                Share Content
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default TechHome;
