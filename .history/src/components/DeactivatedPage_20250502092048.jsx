import React, { useState, useEffect } from 'react';

const Admin = () => {
  const [profile, setProfile] = useState(null);
  const [users, setUsers] = useState([]);
  const [content, setContent] = useState([]);
  const [categories, setCategories] = useState([]);
  const [newUser, setNewUser] = useState({ email: '', password: '', role: 'user' });
  const [newCategory, setNewCategory] = useState({ name: '' });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showPanel, setShowPanel] = useState(false);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const token = localStorage.getItem('token');

        const [profileRes, usersRes, contentRes, categoriesRes] = await Promise.all([
          fetch('http://localhost:5000/api/user', { headers: { 'Authorization': `Bearer ${token}` } }),
          fetch('http://localhost:5000/api/admin/users', { headers: { 'Authorization': `Bearer ${token}` } }),
          fetch('http://localhost:5000/api/content', { headers: { 'Authorization': `Bearer ${token}` } }),
          fetch('http://localhost:5000/api/categories', { headers: { 'Authorization': `Bearer ${token}` } }),
        ]);

        if (!profileRes.ok || !usersRes.ok || !contentRes.ok || !categoriesRes.ok) {
          throw new Error('Failed to fetch admin data');
        }

        setProfile(await profileRes.json());
        setUsers(await usersRes.json());
        setContent(await contentRes.json());
        setCategories(await categoriesRes.json());
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, []);

  const handleNewUserChange = (e) => {
    setNewUser({ ...newUser, [e.target.name]: e.target.value });
  };

  const handleCreateUser = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch('http://localhost:5000/api/admin/users', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUser),
      });
      if (!response.ok) throw new Error('Failed to create user');
      const createdUser = await response.json();
      setUsers([...users, createdUser]);
      setNewUser({ email: '', password: '', role: 'user' });
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeactivateUser = async (userId) => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`http://localhost:5000/api/admin/users/${userId}/deactivate`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error('Failed to deactivate user');
      setUsers(users.map((user) => (user.id === userId ? { ...user, active: false } : user)));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleApproveContent = async (contentId) => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`http://localhost:5000/api/content/${contentId}/approve`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error('Failed to approve content');
      setContent(content.map((item) => (item.id === contentId ? { ...item, approved: true } : item)));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleFlagContent = async (contentId) => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`http://localhost:5000/api/content/${contentId}/flag`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error('Failed to flag content');
      setContent(content.map((item) => (item.id === contentId ? { ...item, flagged: true } : item)));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleNewCategoryChange = (e) => {
    setNewCategory({ ...newCategory, [e.target.name]: e.target.value });
  };

  const handleCreateCategory = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch('http://localhost:5000/api/categories', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newCategory),
      });
      if (!response.ok) throw new Error('Failed to create category');
      const createdCategory = await response.json();
      setCategories([...categories, createdCategory]);
      setNewCategory({ name: '' });
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <h1 className="text-3xl font-bold text-center text-gray-800">Admin Dashboard</h1>

      <button
        onClick={() => setShowPanel(!showPanel)}
        className="w-full bg-orange-500 text-white py-2 rounded hover:bg-blue-600 mb-4"
      >
        {showPanel ? 'Hide Admin Panel' : 'Show Admin Panel'}
      </button>

      {showPanel && (
        <>
          {/* Profile Section */}
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4">Profile</h2>
            {profile && (
              <div>
                <p>Email: {profile.email}</p>
                <p>Role: {profile.role}</p>
              </div>
            )}
          </div>

          {/* Create User Section */}
          <div className="bg-white shadow-md rounded-lg p-6 space-y-4">
            <h2 className="text-2xl font-semibold">Add New User</h2>
            <input
              type="email"
              name="email"
              value={newUser.email}
              onChange={handleNewUserChange}
              placeholder="Email"
              className="w-full p-2 border border-gray-300 rounded"
            />
            <input
              type="password"
              name="password"
              value={newUser.password}
              onChange={handleNewUserChange}
              placeholder="Password"
              className="w-full p-2 border border-gray-300 rounded"
            />
            <select
              name="role"
              value={newUser.role}
              onChange={handleNewUserChange}
              className="w-full p-2 border border-gray-300 rounded"
            >
              <option value="user">User</option>
              <option value="techwriter">Tech Writer</option>
              <option value="admin">Admin</option>
            </select>
            <button
              onClick={handleCreateUser}
              className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600"
            >
              Create User
            </button>
          </div>

          {/* Manage Users */}
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4">Manage Users</h2>
            {users.map((user) => (
              <div key={user.id} className="flex justify-between items-center border-b py-2">
                <div>
                  <p>{user.email} ({user.role}) {user.active === false && '(Deactivated)'}</p>
                </div>
                {user.active !== false && (
                  <button
                    onClick={() => handleDeactivateUser(user.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Deactivate
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Manage Content */}
          <div className="bg-white shadow-md rounded-lg p-6 space-y-4">
            <h2 className="text-2xl font-semibold">Manage Content</h2>
            {content.map((item) => (
              <div key={item.id} className="border-b pb-4">
                <h3 className="font-bold">{item.title}</h3>
                <p>{item.body}</p>
                <div className="flex space-x-4 mt-2">
                  {!item.approved && (
                    <button
                      onClick={() => handleApproveContent(item.id)}
                      className="text-green-500 hover:text-green-600"
                    >
                      Approve
                    </button>
                  )}
                  <button
                    onClick={() => handleFlagContent(item.id)}
                    className="text-red-500 hover:text-red-600"
                  >
                    Flag
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Create Category Section */}
          <div className="bg-white shadow-md rounded-lg p-6 space-y-4">
            <h2 className="text-2xl font-semibold">Add New Category</h2>
            <input
              type="text"
              name="name"
              value={newCategory.name}
              onChange={handleNewCategoryChange}
              placeholder="Category Name"
              className="w-full p-2 border border-gray-300 rounded"
            />
            <button
              onClick={handleCreateCategory}
              className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600"
            >
              Create Category
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Admin;