import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import NavbarAbout from './NavbarAbout';

const decodeJWT = (token) => {
  try {
    const payload = token.split('.')[1];
    return JSON.parse(atob(payload));
  } catch (err) {
    console.error('Failed to decode token:', err);
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

  const handleSubmit = async e => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);

    try {
      const res = await fetch('https://moringa-daily-dev-nr3m.onrender.com/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (res.ok && data.access_token) {
        localStorage.setItem('accessToken', data.access_token);

        const decoded = decodeJWT(data.access_token);
        if (!decoded?.role) throw new Error('Missing role in token');

        // ✅ Store minimal and reliable data
        localStorage.setItem('role', decoded.role);
        localStorage.setItem('user_id', decoded.sub);

        setSuccessMsg('Login successful!');
        setEmail('');
        setPassword('');

        switch (decoded.role) {
          case 'admin':
            navigate('/admin/home');
            break;
          case 'techwriter':
            navigate('/tech/home');
            break;
          case 'user':
            navigate('/user/home');
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
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <NavbarAbout />
      <div className="flex-grow flex items-start justify-center px-4 mt-[30px]">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md bg-gray-100 rounded-lg shadow-md px-8 py-12 space-y-6"
        >
          <h1 className="text-3xl font-bold text-center text-orange-600">Login</h1>
          {errorMsg && <p className="text-red-500 text-sm text-center">{errorMsg}</p>}
          {successMsg && <p className="text-green-500 text-sm text-center">{successMsg}</p>}
          <div>
            <label className="text-sm font-bold text-gray-700 block mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Enter email"
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
          <div>
            <label className="text-sm font-bold text-gray-700 block mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Enter password"
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-orange-500 hover:bg-orange-600 text-white rounded font-semibold"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
          <p className="text-sm text-center text-gray-700">
            Don’t have an account?
            <Link to="/signup" className="text-blue-600 font-semibold pl-1 hover:underline">
              Sign up
            </Link>
          </p>
        </form>
      </div>
    </>
  );
};

export default Login;
