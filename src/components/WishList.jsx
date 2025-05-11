import React, { useState, useEffect } from 'react';

const WishList = ({ postId }) => {
  const [isSaved, setIsSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  // On mount, fetch current wishlist status
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) return;

    fetch(`https://moringa-daily-dev-nr3m.onrender.com/api/posts/${postId}/wishlist`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => res.json())
      .then(data => {
        setIsSaved(data.isSaved);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching wishlist status:', err);
        setLoading(false);
      });
  }, [postId]);

  const toggleWishlist = async () => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      alert('Please log in to save posts.');
      return;
    }

    const method = isSaved ? 'DELETE' : 'POST';

    try {
      const res = await fetch(`https://moringa-daily-dev-nr3m.onrender.com/api/posts/${postId}/wishlist`, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        setIsSaved(!isSaved);
      } else {
        console.error('Failed to update wishlist status');
      }
    } catch (err) {
      console.error('Error toggling wishlist:', err);
    }
  };

  if (loading) return null;

  return (
    <button
      onClick={toggleWishlist}
      className={`flex items-center gap-1 text-sm transition-colors ${
        isSaved ? 'text-orange-500' : 'text-gray-500'
      } hover:text-orange-600`}
    >
      {isSaved ? '🔖' : '🤍'} Save
    </button>
  );
};

export default WishList;
