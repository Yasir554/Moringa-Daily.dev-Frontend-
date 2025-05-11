import React, { useState, useEffect } from 'react';
import AdminNavbar from '../pages/AdminNavbar';

const AdminPanel = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('');
  const [newUserRole, setNewUserRole] = useState('Admin');
  const [targetEmail, setTargetEmail] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [pendingPosts, setPendingPosts] = useState([]);
  const token = localStorage.getItem('accessToken');

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [userRes, postsRes] = await Promise.all([
          fetch('http://localhost:5000/api/user', {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch('http://localhost:5000/api/posts/pending', {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        if (!userRes.ok || !postsRes.ok) {
          throw new Error('Unauthorized or failed to fetch.');
        }

        const userData = await userRes.json();
        const postData = await postsRes.json();

        const sortedPosts = Array.isArray(postData)
          ? postData.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
          : [];

        setUser(userData);
        setPendingPosts(sortedPosts);
        setLoading(false);
      } catch (err) {
        console.error('Error loading admin panel:', err);
        setLoading(false);
      }
    };

    fetchAll();
  }, [token]);

  const handleCreateUser = (e) => {
    e.preventDefault();
    if (!newUserEmail.trim() || !newUserPassword.trim()) return;

    fetch('http://localhost:5000/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: newUserEmail.trim(),
        username: newUserEmail.split('@')[0],
        password: newUserPassword.trim(),
      }),
    })
      .then(() => {
        setNewUserEmail('');
        setNewUserPassword('');
        setNewUserRole('Admin');
      })
      .catch(err => console.error('Error creating user:', err));
  };

  const handleActivateUser = () => {
    if (!targetEmail.trim()) return;
    // Placeholder logic for activation
    console.log(`Activate user: ${targetEmail}`);
  };

  const handleDeactivateUser = () => {
    if (!targetEmail.trim()) return;
    // Placeholder logic for deactivation
    console.log(`Deactivate user: ${targetEmail}`);
  };

  const handleCreateCategory = (e) => {
    e.preventDefault();
    if (!newCategory.trim()) return;
    fetch('http://localhost:5000/api/categories', {
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
    fetch(`http://localhost:5000/api/content/${postId}/${action}`, {
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

  if (loading) return <p className="text-center mt-10">Loading Admin Panel...</p>;
  if (!user) return <p className="text-center text-red-600 mt-10">Unable to load admin data.</p>;

  return (
    <>
      <AdminNavbar />
    
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      {/* Admin Header */}
      <div className="text-center">
        <div className="w-24 h-24 mx-auto rounded-full bg-gray-200">
          {user.avatarUrl && <img src={user.avatarUrl} alt="Admin" className="rounded-full w-24 h-24" />}
        </div>
        <h1 className="text-xl font-bold mt-2">{user.username}</h1>
        <p className="text-sm text-gray-600">Admin Panel</p>
        <p className="text-sm text-gray-500">{user.email}</p>
      </div>

      {/* Create User */}
      <div className="bg-gray-100 p-4 rounded">
        <h2 className="font-semibold mb-4">Add an Admin or Create a User</h2>
        <form onSubmit={handleCreateUser} className="space-y-3">
          <input
            type="email"
            value={newUserEmail}
            onChange={(e) => setNewUserEmail(e.target.value)}
            className="w-full border p-2 rounded"
            placeholder="Email"
            required
          />
          <input
            type="password"
            value={newUserPassword}
            onChange={(e) => setNewUserPassword(e.target.value)}
            className="w-full border p-2 rounded"
            placeholder="Password"
            required
          />
          <select
            value={newUserRole}
            onChange={(e) => setNewUserRole(e.target.value)}
            className="w-full border p-2 rounded"
          >
            <option value="Admin">Admin</option>
            <option value="User">User</option>
          </select>
          <button type="submit" className="bg-orange-500 text-white px-4 py-1 rounded float-right">
            Create
          </button>
        </form>
      </div>

      {/* Activate/Deactivate User */}
      <div className="bg-gray-100 p-4 rounded">
        <h2 className="font-semibold mb-4">Deactivate And Activate A User</h2>
        <input
          type="email"
          value={targetEmail}
          onChange={(e) => setTargetEmail(e.target.value)}
          className="w-full border p-2 rounded mb-3"
          placeholder="Email"
        />
        <div className="flex justify-end gap-2">
          <button onClick={handleActivateUser} className="bg-blue-900 text-white px-4 py-1 rounded">
            Activate
          </button>
          <button onClick={handleDeactivateUser} className="bg-blue-900 text-white px-4 py-1 rounded">
            Deactivate
          </button>
        </div>
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
    </div></>
  );
};

export default AdminPanel;
