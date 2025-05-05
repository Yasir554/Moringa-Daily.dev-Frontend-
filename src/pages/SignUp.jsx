import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NavbarAbout from './NavbarAbout';

const RegisterForm = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    const response = await fetch('http://localhost:5000/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ username, email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      setErrorMsg(data.error || 'Registration failed');
    } else {
      setSuccessMsg('Registration successful!');
      setUsername('');
      setEmail('');
      setPassword('');
      setTimeout(() => navigate('/login'), 1000);
    }
  };

  return (
    <>
      <NavbarAbout />

      <div className="flex-grow flex items-start justify-center px-4 mt-[30px]">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md bg-gray-100 rounded-lg shadow-md px-8 py-20 space-y-6"
        >
          <h1 className="text-3xl font-bold text-center text-orange-600">Sign Up</h1>

          {errorMsg && <p className="text-red-500 text-sm text-center">{errorMsg}</p>}
          {successMsg && <p className="text-green-500 text-sm text-center">{successMsg}</p>}

          <div>
            <label className="text-sm font-bold text-gray-700 block mb-1">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-400"
              required
            />
          </div>

          <div>
            <label className="text-sm font-bold text-gray-700 block mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email"
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-400"
              required
            />
          </div>

          <div>
            <label className="text-sm font-bold text-gray-700 block mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-400"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-orange-500 hover:bg-orange-600 text-white rounded font-semibold transition-colors"
          >
            Register
          </button>
        </form>
      </div>
    </>
  );
};

export default RegisterForm;
