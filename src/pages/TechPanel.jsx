// src/components/TechPanel.jsx
import React, { useState, useEffect } from 'react';
import Like from './Like';
import AdminTechComment from './AdminTechComment';

const TechPanel = ({ user, pendingPosts }) => {
  // Categories state
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState('');

  // Local pending posts for UI updates
  const [pendingList, setPendingList] = useState(pendingPosts || []);

  useEffect(() => {
    // Fetch existing categories
    fetch('/api/categories', { credentials: 'include' })
      .then(res => res.json())
      .then(data => setCategories(data))
      .catch(err => console.error('Error fetching categories:', err));
  }, []);

  // Create a new category
  const handleAddCategory = e => {
    e.preventDefault();
    if (!newCategory.trim()) return;

    fetch('/api/categories', {
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

  // Approve or flag a post
  const updatePostStatus = (postId, action) => {
    fetch(`/api/posts/${postId}/${action}`, {
      method: 'PUT',
      credentials: 'include',
    })
      .then(res => {
        if (!res.ok) throw new Error();
        setPendingList(prev => prev.filter(p => p.id !== postId));
      })
      .catch(err => console.error(`Error on ${action}:`, err));
  };

  // Update post category
  const updatePostCategory = (postId, categoryId) => {
    fetch(`/api/posts/${postId}/category`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ categoryId }),
    })
      .then(res => {
        if (!res.ok) throw new Error();
        setPendingList(prev =>
          prev.map(p => (p.id === postId ? { ...p, categoryId } : p))
        );
      })
      .catch(err => console.error('Error updating category:', err));
  };

  if (
    (!pendingList || pendingList.length === 0) &&
    categories.length === 0
  )
    return null;

  return (
    <div className="mt-6 bg-gray-50 p-4 rounded shadow">
      {/* User Info */}
      <div className="flex items-center gap-4 border-b pb-4 mb-6">
        <img
          src={user.avatarUrl || '/default-avatar.png'}
          alt="Avatar"
          className="w-16 h-16 rounded-full bg-gray-200"
        />
        <div>
          <h2 className="text-xl font-semibold">{user.name}</h2>
          <p className="text-sm text-gray-500">{user.email}</p>
          <p className="text-sm text-gray-500 capitalize">{user.role}</p>
        </div>
      </div>

      {/* Category Management */}
      <div className="mb-6">
        <h3 className="font-semibold mb-2">Manage Categories</h3>
        <form onSubmit={handleAddCategory} className="flex gap-2">
          <input
            value={newCategory}
            onChange={e => setNewCategory(e.target.value)}
            placeholder="New category name"
            className="border p-2 rounded flex-grow"
          />
          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            Add
          </button>
        </form>
        <div className="mt-3 flex gap-2 flex-wrap">
          {categories.map(cat => (
            <span
              key={cat.id}
              className="bg-gray-200 px-2 py-1 rounded text-sm"
            >
              {cat.name}
            </span>
          ))}
        </div>
      </div>

      {/* Pending Approval */}
      {pendingList.length > 0 && (
        <>
          <h3 className="font-semibold mb-4">Pending Approval</h3>
          {pendingList.map(post => (
            <div
              key={post.id}
              className="mb-6 border p-4 rounded bg-white"
            >
              {/* Post Header */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <img
                    src={user.avatarUrl || '/default-avatar.png'}
                    alt="Avatar"
                    className="w-8 h-8 rounded-full bg-gray-200"
                  />
                  <div>
                    <p className="font-medium">{post.title}</p>
                    <p className="text-xs text-gray-500">{user.name}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  {/* Category Selector */}
                  <select
                    value={post.categoryId || ''}
                    onChange={e =>
                      updatePostCategory(post.id, e.target.value)
                    }
                    className="border p-1 rounded text-sm"
                  >
                    <option value="">Uncategorized</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                  {/* Approve / Flag */}
                  <button
                    onClick={() => updatePostStatus(post.id, 'approve')}
                    className="text-green-600 hover:underline text-sm"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => updatePostStatus(post.id, 'flag')}
                    className="text-red-600 hover:underline text-sm"
                  >
                    Flag
                  </button>
                </div>
              </div>

              <p className="text-sm mb-2">{post.description}</p>
              {post.image && (
                <img
                  src={post.image}
                  alt=""
                  className="rounded w-full mb-2"
                />
              )}

              {/* Review Controls */}
              <div className="flex items-center gap-4 text-sm text-gray-700">
                <Like postId={post.id} initialCount={post.likes} />
                <AdminTechComment
                  postId={post.id}
                  initialCount={post.commentsCount}
                />
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );
};

export default TechPanel;
