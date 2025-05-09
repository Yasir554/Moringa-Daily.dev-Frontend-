// Updated UserNavbar.jsx
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function UserNavbar() {
  const [user, setUser] = useState(null);
  const token = localStorage.getItem("accessToken");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/user", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        setUser(data);
      } catch (err) {
        console.error("Failed to fetch user:", err);
      }
    };

    if (token) fetchUser();
  }, [token]);

  return (
    <nav className="bg-white p-4">
      <div className="flex justify-between items-center">
        <img className="h-12 pl-24 pr-24" src="/moringa.png" alt="Moringa Logo" />
        <div className="space-x-4 pr-12 flex items-center">
          <Link to="/user/home" className="text-black hover:text-gray-500">Home</Link>
          <Link to="/user/category" className="text-black hover:text-gray-500">Category</Link>
          <Link to="/user/chat" className="text-black hover:text-gray-500">Chat</Link>
          <Link to="/user/create-post" className="text-black hover:text-gray-500">Create</Link>
          <Link to="/user/profile" className="text-black hover:text-gray-500">Profile</Link>
          {user && (
            <div className="flex items-center space-x-2">
              {user.profile_picture && (
                <img
                  src={user.profile_picture}
                  alt="avatar"
                  className="w-8 h-8 rounded-full"
                />
              )}
              <span className="text-sm font-medium">{user.username}</span>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default UserNavbar;
