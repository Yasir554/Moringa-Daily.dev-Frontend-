import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Like from '../components/Like';
import Comment from '../components/Comment';
import Share from '../components/Share';
import WishList from '../components/WishList';

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [requestSent, setRequestSent] = useState(false);
  const [openCommentsForPostId, setOpenCommentsForPostId] = useState(null);
  const [comments, setComments] = useState([]);
  const navigate = useNavigate();
  const accessToken = localStorage.getItem('accessToken');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const headers = {
          'Content-Type': 'application/json',
        };
        if (accessToken) {
          headers['Authorization'] = `Bearer ${accessToken}`;
        }

        const proxyUrl = 'https://cors-anywhere.herokuapp.com/'; // Or your preferred proxy URL

        const [userRes, subsRes, wishRes] = await Promise.all([
          fetch(proxyUrl + 'http://localhost:5000/api/user', { headers }),
          fetch(proxyUrl + 'http://localhost:5000/api/user/subscriptions', { headers }),
          fetch(proxyUrl + 'http://localhost:5000/api/user/wishlist', { headers }),
        ]);

        if (!userRes.ok || !subsRes.ok || !wishRes.ok) {
          // Handle unauthorized errors by redirecting to login
          if (userRes.status === 401 || subsRes.status === 401 || wishRes.status === 401) {
            console.error('Unauthorized access. Redirecting to login.');
            navigate('/login');
            return;
          }
          throw new Error('Failed to fetch some data.');
        }

        const userData = await userRes.json();
        const subscriptions = await subsRes.json();
        const wishlist = await wishRes.json();
        setUser({ ...userData, subscriptions, wishlist });
        setLoading(false);
      } catch (err) {
        console.error('Error fetching user data:', err);
        setLoading(false);
      }
    };

    fetchUserData();
  }, [accessToken, navigate]);

  const handleLogout = () => {
    fetch('http://localhost:5000/api/logout', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`, 
        'Content-Type': 'application/json',
      },
    })
      .then(() => {
        localStorage.removeItem('accessToken'); 
        navigate('/login');
      })
      .catch(err => {
        console.error('Logout failed', err);
      });
  };

  const handleRequestTechWriter = () => {
    fetch('http://localhost:5000/api/request-tech-writer', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`, 
      },
      body: JSON.stringify({ userId: user.id }),
    })
      .then(res => {
        if (!res.ok) throw new Error();
        setRequestSent(true);
        const interval = setInterval(() => {
          fetch('/api/user', {
            headers: {
              'Authorization': `Bearer ${accessToken}`, 
              'Content-Type': 'application/json',
            },
          })
            .then(r => r.json())
            .then(d => {
              setUser(prev => ({ ...prev, ...d }));
              if (d.role === 'tech_writer') clearInterval(interval);
            });
        }, 5000);
      })
      .catch(() => alert('Failed to send request.'));
  };

  const handleToggleComments = (postId) => {
    if (openCommentsForPostId === postId) {
      setOpenCommentsForPostId(null);
      return;
    }

    fetch(`http://localhost:5000/api/posts/${postId}/comments`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`, 
        'Content-Type': 'application/json',
      },
    })
      .then(res => res.json())
      .then(data => {
        setComments(data);
        setOpenCommentsForPostId(postId);
      })
      .catch(err => console.error('Failed to fetch comments:', err));
  };

  if (loading) return <p className="text-center mt-10">Loading profile...</p>;
  if (!user) return <p className="text-center text-red-600 mt-10">Unable to load user data.</p>;
  if (user.role === 'tech_writer') {
    navigate('/tech-profile');
    return null;
  }

  const wishlist = user.wishlist
    ? [...user.wishlist].sort((a, b) => new Date(b.addedAt || b.createdAt) - new Date(a.addedAt || a.createdAt))
    : [];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header Info */}
      <div className="text-center">
        <div className="w-24 h-24 mx-auto rounded-full bg-gray-200"></div>
        <h1 className="text-xl font-bold mt-2">{user.name}</h1>
        <p className="text-gray-500 text-sm">{user.email}</p>
        <p className="text-sm text-gray-500 capitalize">{user.role}</p>
        <button
          onClick={handleLogout}
          className="mt-4 bg-gray-800 text-white px-5 py-1 rounded text-sm hover:bg-gray-700"
        >
          Log Out
        </button>
      </div>

      {/* Request Tech Writer */}
      <div className="bg-gray-100 p-4 sm:p-6 rounded">
        <h2 className="font-semibold text-lg mb-1">Want to become a Tech Writer</h2>
        <p className="text-sm text-gray-700">
          Send a request to the admin. Once approved, you'll get the full Tech Writer dashboard!
        </p>
        <div className="text-right mt-2">
          <button
            onClick={handleRequestTechWriter}
            disabled={requestSent}
            className={`px-4 py-1 rounded text-white text-sm ${
              requestSent ? 'bg-gray-400 cursor-not-allowed' : 'bg-orange-500 hover:bg-orange-600'
            }`}
          >
            Request
          </button>
        </div>
      </div>

      {/* Subscriptions */}
      <div className="bg-gray-100 p-4 sm:p-6 rounded">
        <h2 className="font-semibold mb-2">My Subscriptions</h2>
        <div className="flex gap-2 flex-wrap">
          {user.subscriptions?.length > 0 ? (
            user.subscriptions.map(cat => (
              <span key={cat} className="bg-gray-800 text-white px-3 py-1 rounded text-sm">
                {cat}
              </span>
            ))
          ) : (
            <p className="text-gray-500">No subscriptions yet.</p>
          )}
        </div>
      </div>

      {/* Wishlist */}
      <div className="bg-gray-100 p-4 sm:p-6 rounded">
        <h2 className="flex items-center font-semibold mb-2 text-lg">🔖 My Wishlist</h2>
        {wishlist.length > 0 ? (
          wishlist.map(item => (
            <div key={item.id} className="border-t pt-2">
              <p className="font-medium">{item.title}</p>
              <div className="flex items-center gap-2 text-gray-500 text-xs">
                <div className="w-4 h-4 rounded-full bg-gray-300"></div>
                <span>{item.author}</span>
                <span>• {item.daysAgo} days ago</span>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500">Your wishlist is empty.</p>
        )}
      </div>

      {/* Posted Content */}
      <div>
        <h2 className="font-semibold text-lg border-b pb-2 mb-4">Posted Content</h2>

        {user.posts && user.posts.length > 0 ? (
          [...user.posts]
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .map(post => (
              <div key={post.id} className="bg-white shadow-sm rounded mb-6">
                <div className="flex flex-col sm:flex-row p-4 gap-4">
                  <div className="w-10 h-10 bg-gray-200 rounded-full shrink-0"></div>
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                      <div>
                        <p className="font-semibold">{post.title}</p>
                        <p className="text-xs text-gray-500">{user.name}</p>
                      </div>
                      <span className={`text-xs mt-1 sm:mt-0 px-2 py-1 rounded text-white capitalize ${
                        post.status === 'Approved' ? 'bg-blue-900' :
                        post.status === 'Pending' ? 'bg-gray-800' : 'bg-red-600'
                      }`}>
                        {post.status}
                      </span>
                    </div>
                    <p className="text-sm mt-2 text-gray-700">{post.description}</p>
                    {post.image && (
                      <img src={post.image} alt="" className="w-full mt-2 rounded object-cover" />
                    )}

                    {/* Show post interaction only if approved */}
                    {post.status === 'Approved' && (
                      <>
                        <div className="flex items-center gap-4 mt-3 text-sm text-gray-600 flex-wrap">
                          <Like postId={post.id} initialCount={post.likes} />

                          <button
                            onClick={() => handleToggleComments(post.id)}
                            className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-800"
                          >
                            💬 <span>{post.commentsCount}</span>
                          </button>

                          <Share postId={post.id} />
                          <WishList postId={post.id} />
                        </div>

                        {/* Comments Modal */}
                        {openCommentsForPostId === post.id && (
                          <div className="mt-3 bg-gray-50 border border-gray-200 rounded p-3 shadow-sm">
                            <h4 className="font-semibold text-sm mb-2">Comments</h4>
                            {comments.length > 0 ? (
                              comments.map((comment) => (
                                <div key={comment.id} className="border-t pt-2 text-sm text-gray-700">
                                  <p className="font-medium">{comment.author}</p>
                                  <p>{comment.content}</p>
                                </div>
                              ))
                            ) : (
                              <p className="text-gray-500 text-sm">No comments yet.</p>
                            )}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))
        ) : (
          <p className="text-gray-500 text-center">No posts yet.</p>
        )}
      </div>
    </div>
  );
};

export default UserProfile;