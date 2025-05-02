import React, { useState, useEffect } from 'react';

const DeactivateUsers = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:5000/api/admin/users', {
          headers: { 'Authorization': `Bearer ${token}` },
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

  if (error) return <div>Error: {error}</div>;

  return (
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
  );
};

export default DeactivateUsers;
