
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';  // Import the useNavigate hook

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const navigate = useNavigate();  // Initialize the navigate function

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    const response = await fetch('http://localhost:5000/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include', // Add this if you're using Flask session-based auth
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (response.ok && data.access_token) {
      localStorage.setItem('token', data.access_token);  // Save the token to localStorage
      setSuccessMsg('Login successful!');
      setEmail('');
      setPassword('');
      
      // Redirect to the home page after successful login
      navigate('/');  // Redirect to the home page (or any other page you want)
    } else {
      setErrorMsg(data.error || 'Login failed');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4 space-y-4">
      <h1 className="text-2xl text-center">Login</h1>

      {errorMsg && <p className="text-red-500">{errorMsg}</p>}
      {successMsg && <p className="text-green-500">{successMsg}</p>}

      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        className="w-full p-2 border border-gray-300 rounded"
        required
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        className="w-full p-2 border border-gray-300 rounded"
        required
      />
      <button type="submit" className="w-full py-2 bg-orange-500 text-white rounded">
        Login
      </button>
    </form>
  );
};


export default LoginForm;
