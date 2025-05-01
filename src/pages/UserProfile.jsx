import React, { useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom';        // if you use react-router
import Category from '../components/Category';
import Like from '../components/Like';
import UserComment from '..pages/UserComment';
import Share from '../components/Share';
import WishList from '../components/WishList';

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [requestSent, setRequestSent] = useState(false);

  // Fetch user on mount
  useEffect(() => {
    fetch('/api/user', { credentials: 'include' })
      .then(res => res.json())
      .then(data => {
        setUser(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const handleRequestTechWriter = () => {
    fetch('/api/request-tech-writer', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: user.id }),
    })
      .then(res => {
        if (!res.ok) throw new Error();
        setRequestSent(true);

        // poll until role flips
        const id = setInterval(() => {
          fetch('/api/user', { credentials: 'include' })
            .then(r => r.json())
            .then(d => {
              setUser(d);
              if (d.role === 'tech_writer') clearInterval(id);
            })
            .catch(console.error);
        }, 5000);
      })
      .catch(() => alert('Failed to send request.'));
  };

  if (loading) return <p>Loading profile...</p>;
  if (!user)   return <p>Unable to load user data.</p>;

  // If they’ve become a tech writer, redirect to your TechWriter profile page
  if (user.role === 'tech_writer') {
    return <Redirect to="/tech-profile" />;
  }

  // Group posts by status
  const approved = user.posts?.filter(p => p.status === 'Approved') || [];
  const pending  = user.posts?.filter(p => p.status === 'Pending')  || [];
  const declined = user.posts?.filter(p => p.status === 'Declined') || [];

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
        <p className="text-sm text-gray-500">{user.email}</p>
        <p className="text-sm text-gray-500 capitalize">{user.role}</p>
        <div className="mt-3 flex gap-4">
          <button className="bg-orange-500 text-white px-4 py-1 rounded">
            Edit Profile
          </button>
          <button className="bg-blue-900 text-white px-4 py-1 rounded">
            Log Out
          </button>
        </div>
      </div>

      {/* Become Tech Writer */}
      <div className="mt-6 bg-yellow-50 border border-yellow-300 p-4 rounded shadow">
        <h3 className="text-lg font-semibold text-yellow-800 mb-2">
          Want to Become a Tech Writer?
        </h3>
        <p className="text-sm text-yellow-700 mb-3">
          Send a request to the admin. Once approved, you’ll get the full Tech Writer dashboard!
        </p>
        <button
          onClick={handleRequestTechWriter}
          disabled={requestSent}
          className={`px-4 py-2 rounded text-white ${
            requestSent ? 'bg-gray-400' : 'bg-yellow-600 hover:bg-yellow-700'
          }`}
        >
          {requestSent ? 'Request Sent ✅' : 'Send Request to Admin'}
        </button>
      </div>

      {/* My Subscriptions */}
      <div className="mt-6 bg-gray-50 p-4 rounded shadow">
        <h3 className="font-semibold mb-2">My Subscriptions</h3>
        <div className="flex gap-3 flex-wrap">
          {user.subscriptions.length
            ? user.subscriptions.map(cat => (
                <Category key={cat} name={cat} />
              ))
            : <p className="text-gray-500">No subscriptions yet.</p>
          }
        </div>
      </div>

      {/* My Wishlist */}
      <div className="mt-6 bg-gray-50 p-4 rounded shadow">
        <h3 className="font-semibold mb-2 flex items-center gap-2">
          📑 My Wishlist
        </h3>
        {user.wishlist.length
          ? user.wishlist.map(item => (
              <div key={item.id} className="py-2 border-t text-sm">
                <p>{item.title}</p>
                <p className="text-gray-500 text-xs">
                  {item.author} – {item.daysAgo} days ago
                </p>
              </div>
            ))
          : <p className="text-gray-500">Your wishlist is empty.</p>
        }
      </div>

      {/* Posted Content */}
      <div className="mt-6 bg-gray-50 p-4 rounded shadow">
        <h3 className="font-semibold mb-4">Posted Content</h3>

        {/* Approved */}
        {approved.length > 0 && (
          <>
            <h4 className="font-semibold mb-2">
              Approved ({approved.length})
            </h4>
            {approved.map(post => (
              <div
                key={post.id}
                className="mb-6 border p-4 rounded bg-white"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <img
                      src={user.avatarUrl}
                      alt="Avatar"
                      className="w-8 h-8 rounded-full bg-gray-200"
                    />
                    <div>
                      <p className="font-medium">{post.title}</p>
                      <p className="text-xs text-gray-500">{user.name}</p>
                    </div>
                  </div>
                  <span className="text-xs px-2 py-1 rounded bg-green-100 text-green-700">
                    {post.status}
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
                  <UserComment postId={post.id} initialCount={post.commentsCount} />
                  <Share postId={post.id} />
                  <WishList postId={post.id} />
                </div>
              </div>
            ))}
          </>
        )}

        {/* Pending */}
        {pending.length > 0 && (
          <>
            <h4 className="font-semibold mb-2 mt-4">
              Pending ({pending.length})
            </h4>
            {pending.map(post => (
              <div
                key={post.id}
                className="mb-6 border p-4 rounded bg-white"
              >
                <div className="flex items-center justify-between mb-2">
                  <p className="font-medium">{post.title}</p>
                  <span className="text-xs px-2 py-1 rounded bg-yellow-100 text-yellow-700">
                    {post.status}
                  </span>
                </div>
                <p className="text-sm text-gray-600">{post.description}</p>
                {post.image && (
                  <img
                    src={post.image}
                    alt=""
                    className="rounded w-full mt-2"
                  />
                )}
              </div>
            ))}
          </>
        )}

        {/* Declined */}
        {declined.length > 0 && (
          <>
            <h4 className="font-semibold mb-2 mt-4">
              Declined ({declined.length})
            </h4>
            {declined.map(post => (
              <div
                key={post.id}
                className="mb-6 border p-4 rounded bg-white"
              >
                <div className="flex items-center justify-between mb-2">
                  <p className="font-medium">{post.title}</p>
                  <span className="text-xs px-2 py-1 rounded bg-red-100 text-red-700">
                    {post.status}
                  </span>
                </div>
                <p className="text-sm text-gray-600">{post.description}</p>
                {post.image && (
                  <img
                    src={post.image}
                    alt=""
                    className="rounded w-full mt-2"
                  />
                )}
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
