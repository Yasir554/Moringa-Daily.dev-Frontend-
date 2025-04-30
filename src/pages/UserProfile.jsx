import React, { useState, useEffect } from 'react';

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('https://127.0.0.1:5000/api/user') 
      .then(res => res.json())
      .then(data => {
        setUser(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch user data:', err);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading profile...</p>;
  if (!user) return <p>No user data found.</p>;

  return (
    <div className="p-4 max-w-4xl mx-auto">
      {/* Profile Header */}
      <div className="flex flex-col items-center border-b pb-4">
        <img
          src="/images/avatar_placeholder.png"
          alt="User Avatar"
          className="w-20 h-20 rounded-full bg-gray-200"
        />
        <h2 className="text-xl font-semibold mt-2">{user.name}</h2>
        <p className="text-sm text-gray-500">{user.role}</p>

        <div className="flex gap-4 mt-3">
          <button className="bg-orange-500 text-white px-4 py-1 rounded">Edit Profile</button>
          <button className="bg-blue-900 text-white px-4 py-1 rounded">Log Out</button>
        </div>
      </div>

      {/* Subscriptions */}
      <div className="mt-6 bg-gray-50 p-4 rounded shadow">
        <h3 className="font-semibold mb-2">My Subscriptions</h3>
        <div className="flex gap-3 flex-wrap">
          {user.subscriptions.map((sub, idx) => (
            <span
              key={idx}
              className="bg-blue-900 text-white px-3 py-1 text-sm rounded"
            >
              {sub}
            </span>
          ))}
        </div>
      </div>

      {/* Wishlist */}
      <div className="mt-6 bg-gray-50 p-4 rounded shadow">
        <h3 className="font-semibold mb-2 flex items-center gap-2">
          <span>📑</span> My Wishlist
        </h3>
        {user.wishlist.map((item, idx) => (
          <div key={idx} className="py-2 border-t text-sm">
            <p>{item.title}</p>
            <p className="text-gray-500 text-xs">
              {item.author} - {item.daysAgo} days ago
            </p>
          </div>
        ))}
      </div>

      {/* Posted Content */}
      <div className="mt-6 bg-gray-50 p-4 rounded shadow">
        <h3 className="font-semibold mb-4">Posted Content.</h3>
        {user.posts.map((post, idx) => (
          <div key={idx} className="mb-6 border p-4 rounded">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <img
                  src="/images/avatar_placeholder.png"
                  alt="Avatar"
                  className="w-8 h-8 rounded-full bg-gray-200"
                />
                <div>
                  <p className="font-medium">{post.title}</p>
                  <p className="text-xs text-gray-500">{user.name}</p>
                </div>
              </div>
              <span
                className={`text-xs px-2 py-1 rounded ${
                  post.status === 'Approved'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-yellow-100 text-yellow-700'
                }`}
              >
                {post.status}
              </span>
            </div>

            <p className="text-sm mb-2">{post.description}</p>
            <img src={post.image} alt="Post Visual" className="rounded w-full" />

            <div className="mt-2 flex gap-6 text-sm text-gray-500">
              <button>👍 Like</button>
              <button>💬 Comments</button>
              <button>🔗 Share</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserProfile;
