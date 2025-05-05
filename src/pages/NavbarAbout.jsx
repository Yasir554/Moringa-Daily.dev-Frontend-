import { Link, useLocation } from 'react-router-dom';

function NavbarAbout() {
  const location = useLocation();

  const getLinkClass = (path) =>
    `font-semibold transition-colors duration-200 ${
      location.pathname === path
        ? 'text-[#FA570F]'
        : 'text-[#111111] hover:text-[#FA570F]'
    }`;

  const isLoginPage = location.pathname === '/login';

  return (
    <nav className="bg-gray-100 p-5">
      <div className="flex justify-between items-center">
        <div className="text-white text-xl">
          <img className="h-12 pl-24 pr-24" src="/moringa.png" alt="Moringa Logo" />
        </div>
        <div className="space-x-4 pr-12 flex items-center">
          <Link to="/" className={getLinkClass('/')}> Home </Link>
          <Link to="/about" className={getLinkClass('/about')}> About </Link>

          <Link
            to="/login"
            className={`px-4 py-1.5 rounded-full text-sm font-semibold shadow-sm transition-colors duration-200 ${
              isLoginPage
                ? 'bg-[#FA570F] hover:bg-[#101F3C]'
                : 'bg-[#101F3C] text-white hover:bg-[#FA570F]'
            } text-white`}
          >
            Login
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default NavbarAbout;
