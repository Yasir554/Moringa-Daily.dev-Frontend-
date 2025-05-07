import React, { useState, useEffect } from 'react';

const TechPanel = ({ user, pendingPosts }) => {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState('');
  const [pendingList, setPendingList] = useState([]);

  useEffect(() => {
    // Fetch categories
    fetch('http://localhost:5000/api/categories', { credentials: 'include' })
      .then(res => res.json())
      .then(data => setCategories(data))
      .catch(err => console.error('Error fetching categories:', err));

    // Sort posts by newest first
    if (pendingPosts?.length > 0) {
      const sorted = [...pendingPosts].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      setPendingList(sorted);
    }
  }, [pendingPosts]);

  const handleAddCategory = e => {
    e.preventDefault();
    if (!newCategory.trim()) return;

    fetch('http://localhost:5000/api/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ name: newCategory.trim() }),
    })
      .then(res => res.json())
      .then(cat => {
        setCategories(prev => [...prev, cat]);
        setNewCategory('');
      })
      .catch(err => console.error('Error creating category:', err));
  };

  const updatePostStatus = (postId, action) => {
    fetch(`http://localhost:5000/api/posts/${postId}/${action}`, {
      method: 'PUT',
      credentials: 'include',
    })
      .then(res => {
        if (!res.ok) throw new Error();
        setPendingList(prev => prev.filter(p => p.id !== postId));
      })
      .catch(err => console.error(`Error on ${action}:`, err));
  };

  if (!user) return null;

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
        <p className="text-sm text-gray-600">Tech Writer Panel</p>
        <p className="text-sm text-gray-500">{user.email}</p>
      </div>

      {/* Create Category */}
      <div className="bg-gray-100 p-4 rounded">
        <h2 className="text-lg font-semibold mb-2">Create Category</h2>
        <form onSubmit={handleAddCategory} className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <label htmlFor="newCategory" className="text-sm font-medium">Create Category</label>
            <input
              id="newCategory"
              value={newCategory}
              onChange={e => setNewCategory(e.target.value)}
              placeholder="e.g. DevOps"
              className="border p-2 rounded w-full"
            />
          </div>
          <div className="text-right">
            <button
              type="submit"
              className="bg-orange-500 hover:bg-orange-600 text-white text-sm px-4 py-1 rounded"
            >
              Create
            </button>
          </div>
        </form>
      </div>

      {/* Pending Approval */}
      {pendingList.length > 0 && (
        <div className="bg-gray-100 p-4 rounded">
          <h2 className="text-lg font-semibold mb-4">Pending Approval</h2>
          {pendingList.map(post => (
            <div key={post.id} className="bg-white rounded shadow p-4 mb-6">
              {/* Author */}
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden">
                  {post.author?.avatarUrl && (
                    <img src={post.author.avatarUrl} alt="Author" className="w-8 h-8 rounded-full" />
                  )}
                </div>
                <div>
                  <p className="font-medium">{post.title}</p>
                  <p className="text-xs text-gray-500">{post.author?.name}</p>
                </div>
              </div>

              {/* Content */}
              <p className="text-sm text-gray-700 mb-2">{post.description}</p>
              {post.image && (
                <img
                  src={post.image}
                  alt=""
                  className="rounded w-full h-auto mb-2"
                />
              )}
              {/* Action Buttons */}
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
          ))}
        </div>
      )}
    </div>
  );
};

export default TechPanel;
