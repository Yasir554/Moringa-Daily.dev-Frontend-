import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

function NavbarAbout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check if user is logged in
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    setIsLoggedIn(!!token);
  }, [location]);

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) return;

      await fetch('http://localhost:5000/api/logout', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });
    } catch (err) {
      console.error('Logout failed:', err);
    } finally {
      localStorage.removeItem('accessToken');
      navigate('/login');
    }
  };

  const getLinkClass = (path) =>
    `font-semibold transition-colors duration-200 ${
      location.pathname === path
        ? 'text-[#FA570F]'
        : 'text-[#111111] hover:text-[#FA570F]'
    }`;

  return (
    <nav className="bg-gray-100 p-5">
      <div className="flex justify-between items-center">
        <div className="text-white text-xl">
          <img className="h-12 pl-24 pr-24" src="/moringa.png" alt="Moringa Logo" />
        </div>
        <div className="space-x-4 pr-12 flex items-center">
          <Link to="/" className={getLinkClass('/')}> Home </Link>
          <Link to="/about" className={getLinkClass('/about')}> About </Link>

          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="px-4 py-1.5 rounded-full text-sm font-semibold shadow-sm bg-red-500 text-white hover:bg-red-600 transition-colors duration-200"
            >
              Logout
            </button>
          ) : (
            <Link
              to="/login"
              className={`px-4 py-1.5 rounded-full text-sm font-semibold shadow-sm transition-colors duration-200 ${
                location.pathname === '/login'
                  ? 'bg-[#FA570F] hover:bg-[#101F3C]'
                  : 'bg-[#101F3C] text-white hover:bg-[#FA570F]'
              } text-white`}
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

export default NavbarAbout;
