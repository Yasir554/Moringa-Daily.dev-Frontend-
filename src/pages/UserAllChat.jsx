import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const UserAllChat = () => {
  const [chats, setChats] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:5000/api/chats', { credentials: 'include' })
      .then(res => res.json())
      .then(data => setChats(data))
      .catch(err => console.error('Error loading chats:', err));
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-xl font-bold mb-4">Chats</h2>
      <div className="space-y-4">
        {chats.map(chat => (
          <div
            key={chat.id}
            className="flex items-center justify-between p-4 bg-gray-100 rounded cursor-pointer hover:bg-gray-200"
            onClick={() => navigate(`/chat/${chat.id}`)}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-300 rounded-full" />
              <div>
                <p className="font-bold">{chat.receiverName}</p>
                <p className="text-sm text-gray-600">{chat.lastMessage}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserAllChat;