import React, { useState, useEffect } from 'react';

const DeactivateUsers = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('https://moringa-daily-dev-nr3m.onrender.com/api/admin/users', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) throw new Error('Failed to fetch users');
        setUsers(await response.json());
      } catch (err) {
        setError(err.message);
      }
    };

    fetchUsers();
  }, []);

  const handleDeactivateUser = async (userId) => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`https://moringa-daily-dev-nr3m.onrender.com/admin/users/${userId}/deactivate`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error('Failed to deactivate user');
      setUsers(users.map((user) => (user.id === userId ? { ...user, active: false } : user)));
    } catch (err) {
      setError(err.message);
    }
  };

  if (error) return <div>Error: {error}</div>;

  return (
    <div className="bg-white shadow-md rounded-lg p-6 max-w-2xl mx-auto mt-10">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">Manage Users</h2>
      {users.map((user) => (
        <div
          key={user.id}
          className={`flex justify-between items-center border-b py-3 ${
            user.active === false ? 'text-gray-400' : 'text-gray-800'
          }`}
        >
          <div>
            <p className="font-medium">
              {user.email}
              <span className="ml-2 text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
                {user.role}
              </span>
              {user.active === false && (
                <span className="ml-2 text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded-full">
                  Deactivated
                </span>
              )}
            </p>
          </div>
          {user.active !== false && (
            <button
              onClick={() => handleDeactivateUser(user.id)}
              className="text-sm px-3 py-1 bg-red-100 text-red-600 hover:bg-red-200 rounded transition"
            >
              Deactivate
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

export default DeactivateUsers;
