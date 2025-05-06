import { Link, useLocation } from 'react-router-dom';

function TechNavbar() {
  const location = useLocation();

  const getLinkClass = (path) =>
    `font-semibold transition-colors duration-200 ${
      location.pathname === path
        ? 'text-[#FA570F]'
        : 'text-[#111111] hover:text-[#FA570F]'
    }`;

  return (
    <nav className="bg-gray-100 shadow-sm py-4 px-6">
      <div className="flex justify-between items-center max-w-7xl mx-auto">
        {/* Logo */}
        <Link to="/tech/home" className="flex items-center space-x-2">
          <img src="/moringa.png" alt="Moringa Logo" className="h-10" />
        </Link>

        {/* Nav Links */}
        <div className="flex items-center space-x-6">
          <Link to="/tech/home" className={getLinkClass('/tech/home')}>
            Home
          </Link>
          <Link to="/tech/category" className={getLinkClass('/tech/category')}>
            Category
          </Link>
          <Link to="/tech/chat" className={getLinkClass('/tech/chat')}>
            Chat
          </Link>
          <Link to="/tech/create-post" className={getLinkClass('/tech/create-post')}>
            + Create
          </Link>
          <Link to="/tech/panel" className={getLinkClass('/tech/panel')}>
            Panel
          </Link>
          <Link to="/tech/profile" className={getLinkClass('/tech/profile')}>
            <img
              src="/default-avatar.png"
              alt=""
              className="h-8 w-8 rounded-full object-cover border"
            />
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default TechNavbar;
