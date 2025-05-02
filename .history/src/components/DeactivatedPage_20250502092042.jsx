import React, { useEffect, useState } from "react";

const AdminUserManagement = ({ token }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch users from the API
  const fetchUsers = async () => {
    setLoading(true);  // Set loading to true before fetching
    setError(null);  // Clear previous error

    try {
      const res = await fetch("http://localhost:5000/api/user", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const errorData = await res.json();
        alert(`Error fetching users: ${errorData.error || res.statusText}`);
        return;
      }

      const data = await res.json();
      console.log("Fetched data:", data);  // Log fetched data

      // If the response structure is different, adjust this accordingly
      if (Array.isArray(data) && data.length === 0) {
        console.log("No users found in the API response");
      } else {
        setUsers(data);  // Update state with fetched users
      }
    } catch (err) {
      console.error("Error fetching users:", err);
      setError("An error occurred while fetching users.");
    } finally {
      setLoading(false);  // Set loading to false after fetch completes
    }
  };

  // Deactivate user by ID
  const deactivateUser = async (userId) => {
    try {
      const res = await fetch(`http://localhost:5000/api/user/${userId}/deactivate`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        alert("User deactivated");
        fetchUsers(); // Refresh user list after deactivation
      } else {
        const errorData = await res.json();
        alert(`Error deactivating user: ${errorData.error || res.statusText}`);
      }
    } catch (err) {
      console.error("Deactivation error:", err);
      alert("An error occurred while deactivating the user.");
    }
  };

  // Fetch users on initial mount or when token changes
  useEffect(() => {
    if (token) {
      fetchUsers();
    }
  }, [token]);

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-4">User Management</h2>

      {/* Loading indicator */}
      {loading ? (
        <p>Loading users...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p> // Display error message if fetching fails
      ) : (
        users.length === 0 ? (
          <p>No users found.</p>
        ) : (
          <ul className="space-y-4">
            {users.map((user) => (
              <li key={user.id} className="p-4 bg-gray-100 rounded-lg flex justify-between items-center">
                <div>
                  <p className="font-medium">{user.username}</p>
                  <p className="text-sm text-gray-600">{user.email}</p>
                  <p className="text-sm text-gray-500">Status: {user.is_active ? "Active" : "Inactive"}</p>
                </div>
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                  onClick={() => deactivateUser(user.id)}
                  disabled={!user.is_active}
                >
                  {user.is_active ? "Deactivate" : "Already Inactive"}
                </button>
              </li>
            ))}
          </ul>
        )
      )}
    </div>
  );
};

export defimport React, { useState, useEffect } from 'react';

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

export default Admin;ult AdminUserManagement;
