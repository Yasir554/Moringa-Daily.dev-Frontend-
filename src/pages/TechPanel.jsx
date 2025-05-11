import React, { useState, useEffect } from 'react';
import TechNavbar from '../pages/TechNavbar';

const TechPanel = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newCategory, setNewCategory] = useState('');
  const [pendingPosts, setPendingPosts] = useState([]);
  const token = localStorage.getItem('accessToken') || localStorage.getItem('token');

  useEffect(() => {
    const fetchAll = async () => {
      try {
        // Fetch user first
        const userRes = await fetch('https://moringa-daily-dev-nr3m.onrender.com/api/user', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!userRes.ok) throw new Error('User fetch failed');

        const userData = await userRes.json();
        setUser(userData);

        // Only fetch pending posts if user is allowed
        if (['admin', 'tech_writer'].includes(userData.role)) {
          const postsRes = await fetch('https://moringa-daily-dev-nr3m.onrender.com/api/posts/pending', {
            headers: { Authorization: `Bearer ${token}` },
          });

          if (!postsRes.ok) throw new Error('Forbidden to access pending posts');
          const postData = await postsRes.json();

          const sortedPosts = Array.isArray(postData)
            ? postData.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
            : [];

          setPendingPosts(sortedPosts);
        }

        setLoading(false);
      } catch (err) {
        console.error('Error loading tech panel:', err);
        setLoading(false);
      }
    };

    fetchAll();
  }, [token]);

  const handleCreateCategory = (e) => {
    e.preventDefault();
    if (!newCategory.trim()) return;

    fetch('https://moringa-daily-dev-nr3m.onrender.com/api/categories', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name: newCategory.trim() }),
    })
      .then(() => setNewCategory(''))
      .catch(console.error);
  };

  const updatePostStatus = (postId, action) => {
    fetch(`https://moringa-daily-dev-nr3m.onrender.com/api/content/${postId}/${action}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => {
        if (res.ok) {
          setPendingPosts(prev => prev.filter(post => post.id !== postId));
        }
      })
      .catch(err => console.error(`Error on ${action}:`, err));
  };

  if (loading) return <p className="text-center mt-10">Loading Tech Panel...</p>;
  if (!user) return <p className="text-center text-red-600 mt-10">Unable to load user data.</p>;

  return (
    <>
      <TechNavbar />

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Tech Writer Header */}
        <div className="text-center">
          <div className="w-24 h-24 mx-auto rounded-full bg-gray-200">
            {user.avatarUrl && (
              <img src={user.avatarUrl} alt="Profile" className="rounded-full w-24 h-24" />
            )}
          </div>
          <h1 className="text-xl font-bold mt-2">{user.username}</h1>
          <p className="text-sm text-gray-600">Tech Writer Panel</p>
          <p className="text-sm text-gray-500">{user.email}</p>
        </div>

        {/* Create Category */}
        <div className="bg-gray-100 p-4 rounded">
          <h2 className="font-semibold mb-4">Create Category</h2>
          <form onSubmit={handleCreateCategory} className="flex flex-col gap-3">
            <input
              type="text"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              className="border p-2 rounded"
              placeholder="Category Name"
            />
            <button type="submit" className="bg-orange-500 text-white px-4 py-1 rounded self-end">
              Create
            </button>
          </form>
        </div>

        {/* Pending Posts */}
        <div className="bg-gray-100 p-4 rounded">
          <h2 className="font-semibold mb-4">Pending Approval</h2>
          {pendingPosts.length > 0 ? (
            pendingPosts.map(post => (
              <div key={post.id} className="bg-white p-4 rounded mb-6 shadow-sm">
                <div className="flex items-center gap-3 mb-2">
                  <img
                    src={post.author?.profile?.profile_picture || '/default-avatar.png'}
                    alt="Author"
                    className="w-8 h-8 rounded-full"
                  />
                  <div>
                    <p className="font-semibold">{post.title}</p>
                    <p className="text-xs text-gray-500">{post.author?.username}</p>
                  </div>
                </div>

                <p className="text-sm mb-2">{post.body}</p>
                {post.media_urls?.[0] && (
                  <img src={post.media_urls[0]} alt="" className="w-full rounded mb-3" />
                )}

                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => updatePostStatus(post.id, 'approve')}
                    className="bg-blue-900 text-white px-4 py-1 rounded text-sm"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => updatePostStatus(post.id, 'flag')}
                    className="bg-blue-900 text-white px-4 py-1 rounded text-sm"
                  >
                    Flag
                  </button>
                  <button
                    onClick={() => updatePostStatus(post.id, 'decline')}
                    className="bg-blue-900 text-white px-4 py-1 rounded text-sm"
                  >
                    Decline
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No pending posts.</p>
          )}
        </div>
      </div>
    </>
  );
};

export default TechPanel;
