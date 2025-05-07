import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart as solidHeart } from '@fortawesome/free-solid-svg-icons';
import { faHeart as regularHeart } from '@fortawesome/free-regular-svg-icons';

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
      const res = await fetch(`http://localhost:5000/api/posts/${postId}/like`, {
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
      className={`flex items-center gap-1 text-sm transition-colors ${
        liked ? 'text-red-600' : 'text-gray-500'
      }`}
    >
      <FontAwesomeIcon icon={liked ? solidHeart : regularHeart} />
      {likeCount}
    </button>
  );
};

export default Like;
