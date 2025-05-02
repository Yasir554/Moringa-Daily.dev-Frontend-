// src/components/Share.jsx
import React, { useState, useEffect } from 'react';
import { Dialog } from '@headlessui/react';

const Share = ({ postId }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [chatUsers, setChatUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sharedUserId, setSharedUserId] = useState(null);

  // Fetch chat users on modal open
  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      fetch('http://localhost:5000/api/chats/users', {
        credentials: 'include'
      })
        .then(res => res.json())
        .then(data => {
          setChatUsers(data);
          setLoading(false);
        })
        .catch(err => {
          console.error('Error fetching chat users:', err);
          setLoading(false);
        });
    }
  }, [isOpen]);

  const handleShare = (receiverId) => {
    fetch('http://localhost:5000/api/share', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ postId, receiverId })
    })
      .then(res => {
        if (!res.ok) throw new Error();
        alert('Post shared successfully!');
        setIsOpen(false);
      })
      .catch(err => {
        console.error('Error sharing post:', err);
        alert('Failed to share post.');
      });
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="text-sm text-blue-600 hover:underline"
      >
        Share
      </button>

      <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="fixed inset-0 bg-black bg-opacity-30" aria-hidden="true" />

        <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full z-50">
          <Dialog.Title className="text-lg font-bold mb-4">Share Post</Dialog.Title>

          {loading ? (
            <p>Loading...</p>
          ) : (
            <ul className="space-y-3 max-h-60 overflow-y-auto">
              {chatUsers.map(user => (
                <li
                  key={user.id}
                  className="flex justify-between items-center p-2 border rounded hover:bg-gray-100"
                >
                  <span>{user.name}</span>
                  <button
                    onClick={() => handleShare(user.id)}
                    className="bg-blue-500 text-white text-sm px-3 py-1 rounded hover:bg-blue-600"
                  >
                    Share
                  </button>
                </li>
              ))}
            </ul>
          )}

          <button
            onClick={() => setIsOpen(false)}
            className="mt-4 text-sm text-gray-500 hover:underline"
          >
            Cancel
          </button>
        </div>
      </Dialog>
    </>
  );
};

export default Share;
