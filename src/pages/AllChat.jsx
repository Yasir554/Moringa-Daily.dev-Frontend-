import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import io from 'socket.io-client';

import AdminNavbar from '../pages/AdminNavbar';
import TechNavbar from '../pages/TechNavbar';
import UserNavbar from '../pages/UserNavbar';

const socket = io('http://localhost:5000');

const AllChat = () => {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [userRole, setUserRole] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('access_token');

    fetch('http://localhost:5000/api/user', {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch user');
        return res.json();
      })
      .then(data => setUserRole(data.role || 'user'))
      .catch(err => {
        console.error('Failed to fetch user role:', err);
        setUserRole('user');
      });

    fetch('http://localhost:5000/api/chats', {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch chats');
        return res.json();
      })
      .then(data => {
        setChats(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error loading chats:', err);
        setError('Failed to load chats');
        setLoading(false);
      });

    socket.on('new_chat', (newChat) => {
      setChats(prev =>
        prev.some(chat => chat.id === newChat.id)
          ? prev.map(chat => (chat.id === newChat.id ? newChat : chat))
          : [newChat, ...prev]
      );
    });

    return () => socket.off('new_chat');
  }, []);

  const renderNavbar = () => {
    if (userRole === 'admin') return <AdminNavbar />;
    if (userRole === 'techwriter') return <TechNavbar />;
    return <UserNavbar />;
  };

  return (
    <div className="min-h-screen bg-[#F7F8FA]">
      {renderNavbar()}

      <div className="max-w-3xl mx-auto p-4 mt-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-[#0B1C39]">Chats</h2>
          <button
            onClick={() => setShowSearch(true)}
            className="bg-[#F46422] hover:bg-orange-600 text-white text-2xl rounded-full w-10 h-10 flex items-center justify-center"
          >
            +
          </button>
        </div>

        {loading && <p className="text-gray-500">Loading chats...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {!loading && !error && chats.length === 0 && (
          <p className="text-gray-500">No chats yet.</p>
        )}

        <div className="space-y-4">
          {chats.map(chat => (
            <div
              key={chat.id}
              className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm cursor-pointer hover:bg-gray-50 transition"
              onClick={() => navigate(`/chat/${chat.id}`)}
            >
              <div className="flex items-center gap-3">
                {chat.avatarUrl ? (
                  <img
                    src={chat.avatarUrl}
                    alt="avatar"
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-white">
                    <span className="text-sm">👤</span>
                  </div>
                )}
                <div>
                  <p className="font-bold text-[#0B1C39]">{chat.receiverName}</p>
                  <p className="text-sm text-gray-600">{chat.lastMessage}</p>
                </div>
              </div>
              <div className="text-xs text-gray-400">
                {chat.lastMessageTime &&
                  formatDistanceToNow(new Date(chat.lastMessageTime), {
                    addSuffix: true,
                  })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {showSearch && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
            <h3 className="text-lg font-bold mb-4 text-[#0B1C39]">
              Search Users to Start Chat
            </h3>
            <input
              type="text"
              placeholder="Enter username or email"
              className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
            />
            <div className="flex justify-end">
              <button
                onClick={() => setShowSearch(false)}
                className="bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded mr-2"
              >
                Cancel
              </button>
              <button className="bg-[#0B1C39] hover:bg-blue-900 text-white px-4 py-2 rounded">
                Search
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllChat;
