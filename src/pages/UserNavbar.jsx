import { Link } from 'react-router-dom';

function UserNavbar() {
  return (
    <nav className="bg-white p-4">
      <div className="flex justify-between items-center">
        <div className="text-white text-xl">
          <img className="h-12 pl-24 pr-24" src="/moringa.png" alt="Moringa Logo" />
        </div>
        <div className="space-x-4 pr-12 flex items-center">
          <Link to="/user/home" className="text-black-500 hover:text-gray-300">
            Home
          </Link>
          <Link to="/user/category" className="text-black-500 hover:text-gray-300">
            Category
          </Link>
          <Link to="/user/chat" className="text-black-500 hover:text-gray-300">
            Chat
          </Link>
          <Link to="/user/create-post" className="text-black-500 hover:text-gray-300">
            Create
          </Link>
          <Link to="/user/profile" className="inline-block">
            Profile
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default UserNavbar;
