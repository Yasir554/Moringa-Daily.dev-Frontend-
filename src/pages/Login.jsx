import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import NavbarAbout from './NavbarAbout'; // ✅ Import the Navbar

// Improved JWT decoder with error handling
const decodeJWT = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Failed to decode token:', error);
    return null;
  }
};

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
        credentials: 'include',
      });

      const data = await response.json();
      console.log('Login Response Data:', data);

      if (response.ok && data.access_token) {
        console.log('Raw Token:', data.access_token);

        const decoded = decodeJWT(data.access_token);
        console.log('Decoded Token Payload:', decoded);

        if (!decoded) {
          setErrorMsg('Failed to decode token.');
          setLoading(false);
          return;
        }

        const role = decoded.role;
        if (!role) {
          console.warn('Token decoded but missing "role":', decoded);
          setErrorMsg('Login failed: user role missing in token.');
          setLoading(false);
          return;
        }

        setSuccessMsg('Login successful!');
        setEmail('');
        setPassword('');

        switch (role) {
          case 'student':
            navigate('/user/home');
            break;
          case 'techwriter':
            navigate('/tech/home');
            break;
          case 'admin':
            navigate('/admin/home');
            break;
          default:
            navigate('/');
        }
      } else {
        setErrorMsg(data.error || 'Login failed.');
      }
    } catch (err) {
      console.error('Login error:', err);
      setErrorMsg('Network error or server not responding.');
    }

    setLoading(false);
  };

  return (
    <>
      <NavbarAbout /> {/* ✅ Navigation bar rendered here */}

      <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-10 p-6 bg-white shadow rounded space-y-4">
        <h1 className="text-2xl font-bold text-center">Login</h1>

        {errorMsg && <p className="text-red-500 text-sm">{errorMsg}</p>}
        {successMsg && <p className="text-green-500 text-sm">{successMsg}</p>}
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
        <button
          type="submit"
          className="w-full py-2 bg-orange-500 hover:bg-orange-600 text-white rounded"
          disabled={loading}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>

        <p className="font-bold">
          Don't have an account?
          <Link to="/signup" className="text-blue-500 pl-2 font-semibold">
            Signup
          </Link>
        </p>
      </form>
    </>
  );
};

export default Login;
