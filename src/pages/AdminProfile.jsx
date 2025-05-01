import React, { useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import Category from './UserCategory';
import Share from '../components/Share';
import WishList from '../components/WishList';

const AdminProfile = () => {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/user', { credentials: 'include' })
      .then(res => res.json())
      .then(data => {
        setUser(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch user:', err);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading profile...</p>;
  if (!user)   return <p>Unable to load user data.</p>;
  if (user.role !== 'admin') return <Redirect to="/profile" />;

  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* Header */}
      <div className="flex flex-col items-center border-b pb-4">
        <img
          src={user.avatarUrl || '/default-avatar.png'}
          alt="Avatar"
          className="w-24 h-24 rounded-full bg-gray-200"
        />
        <h2 className="text-2xl font-bold mt-2">{user.name}</h2>
        <p className="text-sm text-gray-500">Admin</p>
        <div className="mt-3 flex gap-4">
          <button className="bg-orange-500 text-white px-4 py-1 rounded">
            Edit Profile
          </button>
          <button className="bg-blue-900 text-white px-4 py-1 rounded">
            Log Out
          </button>
        </div>
      </div>

      {/* My Subscriptions */}
      <div className="mt-6 bg-gray-50 p-4 rounded shadow">
        <h3 className="font-semibold mb-2">My Subscriptions</h3>
        <div className="flex gap-3 flex-wrap">
          {user.subscriptions.length > 0 ? (
            user.subscriptions.map(cat => <Category key={cat} name={cat} />)
          ) : (
            <p className="text-gray-500">No subscriptions yet.</p>
          )}
        </div>
      </div>

      {/* My Wishlist */}
      <div className="mt-6 bg-gray-50 p-4 rounded shadow">
        <h3 className="font-semibold mb-2 flex items-center gap-2">
          📑 My Wishlist
        </h3>
        {user.wishlist.length > 0 ? (
          user.wishlist.map(item => (
            <div key={item.id} className="py-2 border-t text-sm">
              <p>{item.title}</p>
              <p className="text-gray-500 text-xs">
                {item.author} – {item.daysAgo} days ago
              </p>
            </div>
          ))
        ) : (
          <p className="text-gray-500">Your wishlist is empty.</p>
        )}
      </div>

      {/* Posted Content */}
      {approvedPosts.length > 0 && (
        <div className="mt-6 bg-gray-50 p-4 rounded shadow">
          <h3 className="font-semibold mb-4">Posted Content</h3>
          {approvedPosts.map(post => (
            <div
              key={post.id}
              className="mb-6 border p-4 rounded bg-white"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <img
                    src={post.author.avatarUrl || '/default-avatar.png'}
                    alt="Avatar"
                    className="w-8 h-8 rounded-full bg-gray-200"
                  />
                  <div>
                    <p className="font-medium">{post.title}</p>
                    <p className="text-xs text-gray-500">
                      {post.author.name}
                    </p>
                  </div>
                </div>
                <span className="text-xs px-2 py-1 rounded bg-green-100 text-green-700">
                  Approved
                </span>
              </div>
              <p className="text-sm mb-2">{post.description}</p>
              {post.image && (
                <img
                  src={post.image}
                  alt=""
                  className="rounded w-full mb-2"
                />
              )}
              <div className="flex items-center gap-4 text-sm text-gray-700">
                <Like postId={post.id} initialCount={post.likes} />
                <AdminTechComment
                  postId={post.id}
                  initialCount={post.commentsCount}
                />
                <Share postId={post.id} />
                <WishList postId={post.id} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminProfile;