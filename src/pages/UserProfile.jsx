import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Like from '../components/Like';
import Comment from '../components/Comment';
import Share from '../components/Share';
import WishList from '../components/WishList';
import UserNavbar from '../pages/UserNavbar';

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [requestSent, setRequestSent] = useState(false);
  const [openCommentsForPostId, setOpenCommentsForPostId] = useState(null);
  const [comments, setComments] = useState([]);
  const navigate = useNavigate();
  const accessToken = localStorage.getItem('accessToken') || localStorage.getItem('token');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const headers = {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        };

        const [userRes, subsRes, wishRes] = await Promise.all([
          fetch('http://localhost:5000/api/user', { headers }),
          fetch('http://localhost:5000/api/subscriptions/categories', { headers }),
          fetch('http://localhost:5000/api/wishlist', { headers }),
        ]);

        if (!userRes.ok || !subsRes.ok || !wishRes.ok) {
          if (userRes.status === 401 || subsRes.status === 401 || wishRes.status === 401) {
            console.error('Unauthorized access. Redirecting to login.');
            navigate('/login');
            return;
          }
          throw new Error('Failed to fetch some data.');
        }

        const userData = await userRes.json();
        const subscriptions = await subsRes.json();
        const wishlist = await wishRes.json();
        setUser({ ...userData, subscriptions, wishlist });
        setLoading(false);
      } catch (err) {
        console.error('Error fetching user data:', err);
        setLoading(false);
      }
    };

    fetchUserData();
  }, [accessToken, navigate]);

  const handleLogout = () => {
    fetch('http://localhost:5000/api/logout', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    })
      .then(() => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('token');
        navigate('/login');
      })
      .catch(err => {
        console.error('Logout failed', err);
      });
  };

  const handleRequestTechWriter = () => {
    fetch('http://localhost:5000/api/request-tech-writer', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ userId: user.id }),
    })
      .then(res => {
        if (!res.ok) throw new Error();
        setRequestSent(true);
      })
      .catch(() => alert('Failed to send request.'));
  };

  if (loading) return <p className="text-center mt-10">Loading profile...</p>;
  if (!user) return <p className="text-center text-red-600 mt-10">Unable to load user data.</p>;

  return (<>
    <UserNavbar />
  
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <div className="text-center">
        <div className="w-24 h-24 mx-auto rounded-full bg-gray-200">
          {user.profile_picture ? (
            <img src={user.profile_picture} alt="Profile" className="rounded-full h-full w-full object-cover" />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500 text-4xl">👤</div>
          )}
        </div>
        <h1 className="text-xl font-bold mt-2">{user.username || user.name}</h1>
        <p className="text-gray-500 text-sm">{user.email}</p>
        <p className="text-sm text-gray-500 capitalize">{user.role}</p>
        <button
          onClick={handleLogout}
          className="mt-4 bg-gray-800 text-white px-5 py-1 rounded text-sm hover:bg-gray-700"
        >
          Log Out
        </button>
      </div>

      {user.role !== 'tech_writer' && (
        <div className="bg-gray-100 p-4 sm:p-6 rounded">
          <h2 className="font-semibold text-lg mb-1">Want to become a Tech Writer</h2>
          <p className="text-sm text-gray-700">
            Send a request to the admin. Once approved, you'll get the full Tech Writer dashboard!
          </p>
          <div className="text-right mt-2">
            <button
              onClick={handleRequestTechWriter}
              disabled={requestSent}
              className={`px-4 py-1 rounded text-white text-sm ${
                requestSent ? 'bg-gray-400 cursor-not-allowed' : 'bg-orange-500 hover:bg-orange-600'
              }`}
            >
              Request
            </button>
          </div>
        </div>
      )}

      <div className="bg-gray-100 p-4 sm:p-6 rounded">
        <h2 className="font-semibold mb-2">My Subscriptions</h2>
        <div className="flex gap-2 flex-wrap">
          {user.subscriptions?.length > 0 ? (
            user.subscriptions.map((cat, i) => (
              <span key={i} className="bg-gray-800 text-white px-3 py-1 rounded text-sm">
                {cat.name || cat}
              </span>
            ))
          ) : (
            <p className="text-gray-500">No subscriptions yet.</p>
          )}
        </div>
      </div>

      <div className="bg-gray-100 p-4 sm:p-6 rounded">
        <h2 className="flex items-center font-semibold mb-2 text-lg">🔖 My Wishlist</h2>
        {user.wishlist?.length > 0 ? (
          user.wishlist.map((item) => (
            <div key={item.id} className="border-t pt-2">
              <p className="font-medium">{item.title}</p>
              <div className="flex items-center gap-2 text-gray-500 text-xs">
                <span>{item.author || 'Unknown Author'}</span>
                <span>• {item.created_at?.slice(0, 10)}</span>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500">Your wishlist is empty.</p>
        )}
      </div>
    </div></>
  );
};

export default UserProfile;
