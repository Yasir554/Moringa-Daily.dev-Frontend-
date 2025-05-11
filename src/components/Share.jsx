import React, { useState, useEffect } from 'react';
import { Dialog } from '@headlessui/react';

const Share = ({ postId }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [chatUsers, setChatUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedUsername, setSelectedUsername] = useState('');
  const [successMessage, setSuccessMessage] = useState('');  // Success message for share confirmation

  // Fetch chat users based on search query
  useEffect(() => {
    if (searchQuery.length > 0) {
      setLoading(true);
      fetch(`http://localhost:5000/api/search/users?query=${searchQuery}`, {
        credentials: 'include'
      })
        .then(res => res.json())
        .then(data => {
          setFilteredUsers(data);
          setLoading(false);
        })
        .catch(err => {
          console.error('Error fetching users:', err);
          setLoading(false);
        });
    } else {
      setFilteredUsers([]);
    }
  }, [searchQuery]);

  const handleShare = (receiverUsername) => {
    setLoading(true);  // Show loading spinner while sharing
    fetch('http://localhost:5000/api/share', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ postId, receiverUsername })
    })
      .then(res => {
        if (!res.ok) throw new Error();
        setSuccessMessage('Post shared successfully!');  // Set success message
        setLoading(false);  // Hide loading spinner
        setIsOpen(false);  // Close the modal
      })
      .catch(err => {
        console.error('Error sharing post:', err);
        setSuccessMessage('Failed to share post.');  // Set error message
        setLoading(false);
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

          {/* Success/Error message */}
          {successMessage && (
            <div className="text-center mb-4 text-green-500">{successMessage}</div>
          )}

          {/* Search Input */}
          <input
            type="text"
            placeholder="Search for a user..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border p-2 rounded w-full mb-4"
          />

          {loading ? (
            <p>Loading...</p>
          ) : (
            <ul className="space-y-3 max-h-60 overflow-y-auto">
              {filteredUsers.map(user => (
                <li
                  key={user.id}
                  className="flex justify-between items-center p-2 border rounded hover:bg-gray-100"
                >
                  <span>{user.username}</span>
                  <button
                    onClick={() => handleShare(user.username)} // Pass username, not email
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
