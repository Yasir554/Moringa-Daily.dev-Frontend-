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

export default AdminUserManagement;
