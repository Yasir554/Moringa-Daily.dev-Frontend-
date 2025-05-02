import { Link } from 'react-router-dom';

function AboutNavbar() {
  return (
    <nav className="bg-white p-4">
      <div className="flex justify-between items-center">
        <div className="text-white text-xl">
          <img className='h-12 pl-24' src="/moringa.png" alt="" />
        </div>
        <div className="space-x-4 pr-12">
        <Link to="/" className="text-black-500 hover:text-gray-300">
            Home
          </Link>
          <Link to="/login" className="text-black-500 hover:text-gray-300">
            Login
          </Link>
        </div>
      </div>
    </nav>
  );
}


export default HomeNavbar;