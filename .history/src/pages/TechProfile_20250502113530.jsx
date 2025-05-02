import React, { useState, useEffect } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import Like from '.'
import Share from '../components/Share';
import WishList from '../components/WishList';

const TechProfile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openCommentsForPostId, setOpenCommentsForPostId] = useState(null);
  const [comments, setComments] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([
      fetch('http://localhost:5000/api/user', { credentials: 'include' }),
      fetch('http://localhost:5000/api/user/subscriptions', { credentials: 'include' }),
      fetch('http://localhost:5000/api/user/wishlist', { credentials: 'include' }),
    ])
      .then(async ([userRes, subsRes, wishRes]) => {
        if (!userRes.ok || !subsRes.ok || !wishRes.ok) throw new Error('Failed to fetch some data.');
        const userData = await userRes.json();
        const subscriptions = await subsRes.json();
        const wishlist = await wishRes.json();
        setUser({ ...userData, subscriptions, wishlist });
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching user data:', err);
        setLoading(false);
      });
  }, []);

  const handleLogout = () => {
    fetch('http://localhost:5000/api/logout', {
      method: 'POST',
      credentials: 'include',
    })
      .then(() => {
        localStorage.removeItem('token');
        navigate('/login');
      })
      .catch(err => {
        console.error('Logout failed', err);
      });
  };

  const handleToggleComments = (postId) => {
    if (openCommentsForPostId === postId) {
      setOpenCommentsForPostId(null);
      return;
    }

    fetch(`http://localhost:5000/api/posts/${postId}/comments`, {
      credentials: 'include',
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
  if (user.role !== 'tech_writer') return <Navigate to="/profile" replace />;

  const posts = user.posts ? [...user.posts].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) : [];
  const wishlist = user.wishlist ? [...user.wishlist].sort((a, b) => new Date(b.addedAt || b.createdAt) - new Date(a.addedAt || a.createdAt)) : [];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Profile Header */}
      <div className="text-center">
        <div className="w-24 h-24 mx-auto rounded-full bg-gray-200">
          {user.avatarUrl ? (
            <img src={user.avatarUrl} alt="Avatar" className="w-24 h-24 rounded-full" />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500 text-4xl">👤</div>
          )}
        </div>
        <h1 className="text-xl font-bold mt-2">{user.name}</h1>
        <p className="text-sm text-gray-500">Tech Writer</p>
        <p className="text-sm text-gray-500">{user.email}</p>
        <button
          onClick={handleLogout}
          className="mt-4 bg-gray-800 text-white px-5 py-1 rounded text-sm hover:bg-gray-700"
        >
          Log Out
        </button>
      </div>

      {/* Subscriptions */}
      <div className="bg-gray-100 p-4 rounded">
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
      <div className="bg-gray-100 p-4 rounded">
        <h2 className="flex items-center font-semibold mb-2 text-lg">🔖 My Wishlist</h2>
        {wishlist.length > 0 ? (
          wishlist.map(item => (
            <div key={item.id} className="border-t pt-2">
              <p className="font-medium">{item.title}</p>
              <div className="flex items-center gap-2 text-gray-500 text-xs">
                <div className="w-4 h-4 rounded-full bg-gray-300">
                  {item.authorAvatar ? (
                    <img src={item.authorAvatar} alt="" className="w-4 h-4 rounded-full" />
                  ) : null}
                </div>
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
      <div className="bg-gray-100 p-4 rounded">
        <h2 className="font-semibold mb-4">Posted Content</h2>
        {posts.length > 0 ? (
          posts.map(post => (
            <div key={post.id} className="bg-white p-4 rounded mb-6 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 bg-gray-200 rounded-full overflow-hidden">
                  {user.avatarUrl && (
                    <img src={user.avatarUrl} alt="Avatar" className="w-8 h-8 rounded-full" />
                  )}
                </div>
                <div>
                  <p className="font-medium">{user.name}</p>
                  <p className="text-xs text-gray-500">{new Date(post.createdAt).toLocaleDateString()}</p>
                </div>
              </div>

              <h3 className="font-semibold text-lg mb-1">{post.title}</h3>
              <p className="text-sm mb-3 text-gray-700">{post.description}</p>

              {post.image && (
                <div className="mb-3 rounded overflow-hidden">
                  <img src={post.image} alt="" className="w-full" />
                </div>
              )}

              <div className="flex items-center justify-between text-sm text-gray-600">
                <div className="flex items-center gap-4">
                  <Like postId={post.id} initialCount={post.likes} />
                  <button
                    onClick={() => handleToggleComments(post.id)}
                    className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-800"
                  >
                    💬 <span>{post.commentsCount}</span>
                  </button>
                  <Share postId={post.id} />
                </div>
                <WishList postId={post.id} />
              </div>

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
            </div>
          ))
        ) : (
          <p className="text-gray-500">No posted content yet.</p>
        )}
      </div>
    </div>
  );
};

export default TechProfile;
