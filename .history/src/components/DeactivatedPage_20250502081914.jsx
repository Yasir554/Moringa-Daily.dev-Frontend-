import React, { useEffect, useState } from "react";

const AdminUserManagement = ({ token }) => {
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/user", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!res.ok) {
        const errorData = await res.json();
        alert(`Error fetching users: ${errorData.error || res.statusText}`);
        return;
      }

      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error("Error fetching users:", err);
      alert("An error occurred while fetching users.");
    }
  };

  const deactivateUser = async (userId) => {
    try {
      const res = await fetch(`http://localhost:5000/api/user/${userId}/deactivate`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      });

      if (res.ok) {
        alert("User deactivated");
        fetchUsers(); // Refresh user list
      } else {
        const errorData = await res.json();
        alert(`Error deactivating user: ${errorData.error || res.statusText}`);
      }
    } catch (err) {
      console.error("Deactivation error:", err);
      alert("An error occurred while deactivating the user.");
    }
  };

  useEffect(() => {
    if (token) {
      fetchUsers();
    }
  }, [token]);

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-4">User Management</h2>
      <ul className="space-y-4">
        {users.map(user => (
          <li
            key={user.id}
            className="p-4 bg-gray-100 rounded-lg flex justify-between items-center"
          >
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
              Deactivate
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminUserManagement;
