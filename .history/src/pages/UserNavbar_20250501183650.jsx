import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';

function UserNavbar() {
  const [profilePic, setProfilePic] = useState('/default-avatar.png');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetch('http://localhost:5000/api/profile', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })
        .then((res) => {
          if (!res.ok) throw new Error('Failed to fetch profile');
          return res.json();
        })
        .then((data) => {
          if (data.profile_picture) {
            setProfilePic(data.profile_picture);
          }
        })
        .catch((err) => {
          console.error('Error fetching profile in navbar:', err);
        });
    }
  }, []);

  return (
    <nav className="bg-white p-4">
      <div className="flex justify-between items-center">
        <div className="text-white text-xl">
          <img className="h-12 pl-24 pr-24" src="/moringa.png" alt="Moringa Logo" />
        </div>
        <div className="space-x-4 pr-12 flex items-center">
          <Link to="/" className="text-black-500 hover:text-gray-300">
            Home
          </Link>
          <Link to="/category/view" className="text-black-500 hover:text-gray-300">
            Category
          </Link>
          <Link to="/create" className="text-black-500 hover:text-gray-300">
            Create
          </Link>
          <Link to="/about" className="text-black-500 hover:text-gray-300">
            About
          </Link>
          <Link to="/profile/view" className="inline-block">
            />
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default UserNavbar;
