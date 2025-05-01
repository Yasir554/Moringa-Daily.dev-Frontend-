import React, { useState } from 'react';
import Like from './Like';
import AdminTechComment from './AdminTechComment';

const AdminPanel = ({ user, pendingPosts }) => {
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [targetEmail, setTargetEmail]     = useState('');

  // Add a new admin
  const handleAddAdmin = e => {
    e.preventDefault();
    if (!newAdminEmail.trim()) return;
    fetch('/api/admins', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email: newAdminEmail.trim() })
    })
      .then(() => setNewAdminEmail(''))
      .catch(err => console.error('Error adding admin:', err));
  };

  // Activate a user
  const handleActivateUser = () => {
    if (!targetEmail.trim()) return;
    fetch('/api/users/activate', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email: targetEmail.trim() })
    }).catch(err => console.error('Error activating user:', err));
  };

  // Deactivate a user
  const handleDeactivateUser = () => {
    if (!targetEmail.trim()) return;
    fetch('/api/users/deactivate', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email: targetEmail.trim() })
    }).catch(err => console.error('Error deactivating user:', err));
  };

  if (
    !newAdminEmail &&
    !targetEmail &&
    (!pendingPosts || pendingPosts.length === 0)
  ) return null;

  return (
    <div className="mt-6 bg-gray-50 p-4 rounded shadow">
      {/* Admin Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Add Admin */}
        <div>
          <h3 className="font-semibold mb-2">Add Admin</h3>
          <form onSubmit={handleAddAdmin} className="flex gap-2">
            <input
              type="email"
              value={newAdminEmail}
              onChange={e => setNewAdminEmail(e.target.value)}
              placeholder="email@example.com"
              className="border p-2 rounded flex-grow"
            />
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Add
            </button>
          </form>
        </div>

        {/* Activate / Deactivate User */}
        <div>
          <h3 className="font-semibold mb-2">Activate / Deactivate User</h3>
          <div className="flex gap-2 mb-2">
            <input
              type="email"
              value={targetEmail}
              onChange={e => setTargetEmail(e.target.value)}
              placeholder="email@example.com"
              className="border p-2 rounded flex-grow"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleActivateUser}
              className="bg-green-600 text-white px-4 py-2 rounded"
            >
              Activate
            </button>
            <button
              onClick={handleDeactivateUser}
              className="bg-red-600 text-white px-4 py-2 rounded"
            >
              Deactivate
            </button>
          </div>
        </div>
      </div>

      {/* Pending Approval */}
      {pendingPosts && pendingPosts.length > 0 && (
        <>
          <h3 className="font-semibold mb-4">Pending Approval</h3>
          {pendingPosts.map(post => (
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
                <button className="text-gray-400 hover:text-gray-600">⋮</button>
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
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );
};

export default AdminPanel;
