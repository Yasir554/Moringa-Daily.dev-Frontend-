import React, { useState } from 'react';

const Like = ({ postId, initialLiked = false, initialCount = 0 }) => {
  const [liked, setLiked] = useState(initialLiked);
  const [likeCount, setLikeCount] = useState(initialCount);
  const [isLoading, setIsLoading] = useState(false);

  const toggleLike = async () => {
    if (isLoading) return;

    const method = liked ? 'DELETE' : 'POST';
    const token = localStorage.getItem('access_token');

    if (!token) {
      console.error('No token found. User might not be logged in.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch(`https://moringa-daily-dev-nr3m.onrender.com/api/posts/${postId}/like`, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({}),
      });

      if (res.ok) {
        const data = await res.json();
        setLiked(!liked);
        setLikeCount(data.like_count);
      } else {
        console.error('Failed to toggle like');
      }
    } catch (err) {
      console.error('Error during like toggle:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={toggleLike}
      disabled={isLoading}
      className="flex items-center gap-1 text-sm hover:text-red-600 transition-colors"
    >
      {liked ? '❤️' : '🤍'} {likeCount}
    </button>
  );
};

export default Like;
