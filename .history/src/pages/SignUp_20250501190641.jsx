import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // ✅ Import navigate


const RegisterForm = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const navigate = useNavigate(); // ✅ Create navigate function

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    const response = await fetch('http://localhost:5000/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ username, email, password })
    });

    const data = await response.json();

    if (!response.ok) {
      setErrorMsg(data.error || 'Registration failed');
    } else {
      setSuccessMsg('Registration successful!');
      setUsername('');
      setEmail('');
      setPassword('');

      // ✅ Redirect to login page after short delay (optional)
      setTimeout(() => {
        navigate('/login');
      }, 1000);
    }
  };

  return (
    <>
      <Navbar />
      <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4 space-y-4">
        <h1 className="text-2xl text-center">Sign up</h1>

        {errorMsg && <p className="text-red-500">{errorMsg}</p>}
        {successMsg && <p className="text-green-500">{successMsg}</p>}

        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          className="w-full p-2 border border-gray-300 rounded"
          required
        />
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
          Register
        </button>
      </form>
    </>
  );
};

export default RegisterForm;
