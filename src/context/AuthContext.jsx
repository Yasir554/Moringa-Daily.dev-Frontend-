import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const role = localStorage.getItem('role');
    const userId = localStorage.getItem('user_id');

    if (role && userId) {
      setCurrentUser({ role, userId });
    }

    setLoading(false); // Auth check complete
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>; // Optional: Spinner
  }

  return (
    <AuthContext.Provider value={{ currentUser, setCurrentUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
