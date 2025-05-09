import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const TechProfile = () => {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem('accessToken');

  useEffect(() => {
    if (!token) {
      setError('No token found, please log in');
      return;
    }

    const fetchProfile = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/profile', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch profile');
        }

        const data = await response.json();
        setProfile(data);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchProfile();
  }, [token]);

  const handleEdit = () => {
    console.log('Navigating to edit profile page');
    // navigate('/tech/edit-profile'); // Uncomment if route exists
  };

  const handleLogout = () => {
    fetch('http://localhost:5000/api/logout', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
      .then(() => {
        localStorage.removeItem('accessToken');
        navigate('/login');
      })
      .catch(err => {
        console.error('Logout failed', err);
      });
  };

  if (error) {
    return <div className="text-center text-red-500 mt-10">{error}</div>;
  }

  return profile ? (
    <div className="max-w-md mx-auto p-4 space-y-4 text-center">
      {profile.profile_picture && (
        <img
          className="w-32 h-32 rounded-full object-cover mx-auto"
          src={profile.profile_picture}
          alt="Profile"
        />
      )}
      <p><strong>Username:</strong> {profile.username}</p>
      <p><strong>Bio:</strong> {profile.bio}</p>
      <p><strong>Website:</strong> {profile.website}</p>

      <div className="flex justify-center space-x-4 mt-6">
        <button
          onClick={handleEdit}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Edit Profile
        </button>
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
        >
          Logout
        </button>
      </div>
    </div>
  ) : (
    <p className="text-center mt-10">Loading...</p>
  );
};

export default TechProfile;
