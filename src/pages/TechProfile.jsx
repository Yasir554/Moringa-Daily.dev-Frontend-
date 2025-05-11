import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TechNavbar from '../pages/TechNavbar';
import Like from '../components/Like';
import Share from '../components/Share';
import WishList from '../components/WishList';

const formatTimeDifference = (isoString) => {
  const postTime = new Date(isoString);
  const now = new Date();
  const diffTime = Math.abs(now - postTime);
  const days = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  if (days === 0) return "Today";
  if (days === 1) return "1 day ago";
  return `${days} days ago`;
};

const TechProfile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [requestSent, setRequestSent] = useState(false);
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState([]);
  const [openCommentsForPostId, setOpenCommentsForPostId] = useState(null);
  const navigate = useNavigate();

  const token = localStorage.getItem('accessToken');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const headers = {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        };

        const [userRes, subsRes, wishRes] = await Promise.all([
          fetch('http://localhost:5000/api/user', { headers }),
          fetch('http://localhost:5000/api/subscriptions/categories', { headers }),
          fetch('http://localhost:5000/api/wishlist', { headers }),
        ]);

        if (!userRes.ok || !subsRes.ok || !wishRes.ok) {
          if ([userRes, subsRes, wishRes].some(res => res.status === 401)) {
            navigate('/login');
            return;
          }
          throw new Error('Failed to fetch user data.');
        }

        const userData = await userRes.json();
        const subscriptions = await subsRes.json();
        const wishlist = await wishRes.json();

        setUser({ ...userData, subscriptions, wishlist });
        setRequestSent(userData.requested_admin);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching user data:', err);
        setLoading(false);
      }
    };

    const fetchUserPosts = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/my-content", {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        setPosts(data);
      } catch (err) {
        console.error("Failed to fetch posts:", err);
      }
    };

    fetchUserData();
    fetchUserPosts();
  }, [token, navigate]);

  const handleLogout = async () => {
    try {
      await fetch('http://localhost:5000/api/logout', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      localStorage.removeItem('accessToken');
      navigate('/login');
    } catch (err) {
      console.error('Logout failed', err);
    }
  };

  const handleRequestAdmin = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/request-admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error();
      setRequestSent(true);
    } catch {
      alert('Failed to send request.');
    }
  };

  const fetchComments = async (postId) => {
    try {
      const res = await fetch(`http://localhost:5000/api/content/${postId}/comments`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setComments(data);
    } catch (err) {
      console.error('Error fetching comments:', err);
    }
  };

  const handleToggleComments = (postId) => {
    if (openCommentsForPostId === postId) {
      setOpenCommentsForPostId(null);
    } else {
      setOpenCommentsForPostId(postId);
      fetchComments(postId);
    }
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

  if (loading) return <p className="text-center mt-10">Loading profile...</p>;
  if (!user) return <p className="text-center text-red-600 mt-10">Unable to load user data.</p>;

  return (
    <>
      <TechNavbar />
      <div className="max-w-3xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        <div className="flex flex-col items-center text-center">
          <div className="w-24 h-24 rounded-full bg-gray-200 overflow-hidden">
            {user.profile_picture && (
              <img
                src={user.profile_picture}
                alt="Profile"
                className="h-full w-full object-cover rounded-full"
              />
            )}
          </div>
          <h1 className="text-lg sm:text-xl font-bold mt-2">{user.username}</h1>
          <p className="text-sm text-gray-500">{user.email}</p>
          <p className="text-sm text-gray-600 capitalize">{user.role}</p>
          <button
            onClick={handleLogout}
            className="mt-3 px-4 py-1 bg-gray-900 text-white rounded text-sm hover:bg-orange-500"
          >
            Log Out
          </button>
        </div>

        {/* Admin Request */}
        {user.role === 'techwriter' && (
          <div className="bg-yellow-100 rounded p-4">
            <h2 className="font-semibold text-base sm:text-lg mb-1">Want to become an Admin?</h2>
            <p className="text-sm text-gray-600">
              Send a request to the admin. Once approved, you’ll gain admin privileges.
            </p>
            <div className="text-right mt-3">
              <button
                onClick={handleRequestAdmin}
                disabled={requestSent}
                className={`px-4 py-1 rounded text-white text-sm ${
                  requestSent ? 'bg-gray-400 cursor-not-allowed' : 'bg-orange-500 hover:bg-gray-800'
                }`}
              >
                {requestSent ? 'Request Sent' : 'Request Admin Role'}
              </button>
            </div>
          </div>
        )}

        {/* Subscriptions */}
        <div className="bg-gray-100 rounded p-4">
          <h2 className="font-semibold text-base sm:text-lg mb-2">My Subscriptions</h2>
          <div className="flex gap-2 flex-wrap">
            {user.subscriptions?.length > 0 ? (
              user.subscriptions.map((cat, i) => (
                <span
                  key={i}
                  className="bg-gray-800 text-white px-3 py-1 rounded-full text-xs sm:text-sm"
                >
                  {cat.name}
                </span>
              ))
            ) : (
              <p className="text-sm text-gray-500">No subscriptions yet.</p>
            )}
          </div>
        </div>

        {/* Wishlist */}
        <div className="bg-gray-100 rounded p-4">
          <h2 className="font-semibold text-base sm:text-lg mb-3 flex items-center">
            <span className="mr-2">🔖</span> My Wishlist
          </h2>
          {user.wishlist?.length > 0 ? (
            user.wishlist.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded p-3 mb-2 flex items-center shadow-sm"
              >
                <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-300 mr-3">
                  {item.content?.author?.profile?.profile_picture && (
                    <img
                      src={item.content.author.profile.profile_picture}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium">{item.content?.title}</p>
                  <div className="text-xs text-gray-500">
                    {item.content?.author?.username || 'Unknown'} •{' '}
                    {item.content?.created_at
                      ? formatTimeDifference(item.content.created_at)
                      : 'Unknown date'}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500">Your wishlist is empty.</p>
          )}
        </div>

        {/* Posted Content */}
        <div className="bg-gray-100 rounded p-4">
          <h2 className="font-semibold text-base sm:text-lg mb-4">My Posted Content</h2>
          {posts.length > 0 ? (
            posts.map((post) => {
              const mediaUrls = parseMedia(post.media_urls);
              return (
                <div
                  key={post.id}
                  className="bg-white p-4 rounded shadow-sm mb-4 space-y-3"
                >
                  <div className="flex justify-between items-center mb-2">
                    <div>
                      <h3 className="text-sm sm:text-base font-semibold">{post.title}</h3>
                      <p className="text-xs text-gray-600">{user.username}</p>
                    </div>
                    <span
                      className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                        post.is_approved
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-gray-200 text-gray-600'
                      }`}
                    >
                      {post.is_approved ? 'Approved' : 'Pending'}
                    </span>
                  </div>

                  <p className="text-sm text-gray-700">{post.body}</p>

                  {mediaUrls.length > 0 && (
                    <div className="rounded overflow-hidden space-y-3">
                      {mediaUrls.map((url, index) => {
                        const isVideo = url.endsWith(".mp4") || url.includes("video/upload");
                        return isVideo ? (
                          <video
                            key={index}
                            controls
                            className="w-full max-h-[400px] rounded-lg"
                          >
                            <source src={url} type="video/mp4" />
                          </video>
                        ) : (
                          <img
                            key={index}
                            src={url}
                            alt={`media-${index}`}
                            className="w-full max-h-[400px] object-cover rounded-lg"
                          />
                        );
                      })}
                    </div>
                  )}

                  <div className="flex justify-between text-gray-600 text-sm border-t pt-2">
                    <div className="flex items-center gap-4">
                      <Like postId={post.id} initialCount={post.likes} />
                      <button
                        onClick={() => handleToggleComments(post.id)}
                        className="flex items-center gap-1 hover:text-gray-800"
                      >
                        💬 <span>{post.commentsCount || 0}</span>
                      </button>
                      <Share postId={post.id} />
                    </div>
                    <WishList postId={post.id} />
                  </div>

                  {openCommentsForPostId === post.id && (
                    <div className="mt-3 p-3 border rounded bg-gray-50">
                      <h4 className="font-semibold text-sm mb-2">Comments</h4>
                      {comments.length > 0 ? (
                        comments.map((comment) => (
                          <div key={comment.id} className="border-t pt-2">
                            <p className="text-sm font-medium">{comment.user}</p>
                            <p className="text-sm">{comment.body}</p>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-gray-500">No comments yet.</p>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <p className="text-sm text-gray-500">No posted content yet.</p>
          )}
        </div>
      </div>
    </>
  );
};

export default TechProfile;
