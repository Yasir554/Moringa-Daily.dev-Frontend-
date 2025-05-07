
import React, { useState, useEffect } from 'react';

const ProfileView = () => {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Get token from localStorage
    const token = localStorage.getItem('token');
    if (!token) {
      setError('No token found, please log in');
      return;
    }

    const fetchProfile = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/profile', {
          method: 'GET',
          headers: {


            Authorization: `Bearer ${token}`,  // Use the token in the Authorization header

            'Content-Type': 'application/json'
          }
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
  }, []);  // Empty dependency array to run only once when the component mounts

  const handleEdit = () => {
    // Logic to navigate to the edit profile page (assuming you have routing)
    console.log('Navigating to edit profile page');
  };

  const handleLogout = () => {
    // Clear token and navigate to login page
    localStorage.removeItem('token');
    console.log('Logging out');
    // Optionally redirect to login page
    // navigate('/login');  // Uncomment if you have navigation to the login page
  };

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
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
      <p><strong>Username:</strong> {profile.username}</p> {/* Added the username here */}
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
    <p className="text-center">Loading...</p>
  );
};


export default ProfileView;
