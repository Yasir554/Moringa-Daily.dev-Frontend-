import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

function AdminNavbar() {
  const [user, setUser] = useState(null);
  const location = useLocation();
  const token = localStorage.getItem("accessToken");

  const getLinkClass = (path) =>
    `font-semibold transition-colors duration-200 ${
      location.pathname === path
        ? 'text-[#FA570F]'
        : 'text-[#111111] hover:text-[#FA570F]'
    }`;

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
        console.error("Failed to fetch admin user:", err);
      }
    };

    if (token) fetchUser();
  }, [token]);

  return (
    <nav className="bg-gray-100 shadow-sm py-4 px-6">
      <div className="flex justify-between items-center max-w-7xl mx-auto">
        {/* Logo */}
        <Link to="/admin/home" className="flex items-center space-x-2">
          <img src="/moringa.png" alt="Moringa Logo" className="h-10" />
        </Link>

        {/* Nav Links */}
        <div className="flex items-center space-x-6">
          <Link to="/admin/home" className={getLinkClass('/admin/home')}>
            Home
          </Link>
          <Link to="/admin/category" className={getLinkClass('/admin/category')}>
            Category
          </Link>
          <Link to="/admin/chat" className={getLinkClass('/admin/chat')}>
            Chat
          </Link>
          <Link to="/admin/create-post" className={getLinkClass('/admin/create-post')}>
            + Create
          </Link>
          <Link to="/admin/panel" className={getLinkClass('/admin/panel')}>
            Panel
          </Link>
          <Link to="/admin/profile" className={getLinkClass('/admin/profile')}>
            {user?.profile_picture ? (
              <img
                src={user.profile_picture}
                alt="avatar"
                className="h-8 w-8 rounded-full object-cover border"
              />
            ) : (
              <img
                src="/default-avatar.png"
                alt="default avatar"
                className="h-8 w-8 rounded-full object-cover border"
              />
            )}
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default AdminNavbar;
