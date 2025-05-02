import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import jwtDecode from 'jwt-decode';


const LoginForm = () => {
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
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'include'
      });

      const data = await response.json();
      console.log('Login Response Data:', data);

      if (response.ok && data.access_token) {
        // Decode the token
        const decoded = jwtDecode(data.access_token);
        const role = decoded.role; // assuming your JWT payload contains `role`

        setSuccessMsg('Login successful!');
        setEmail('');
        setPassword('');

        // Navigate based on extracted role
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
        setErrorMsg(data.error || 'Login failed');
      }
    } catch (err) {
      console.error('Login error:', err);
      setErrorMsg('Network error or server not responding.');
    }

    setLoading(false);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto mt-10 p-6 bg-white shadow rounded space-y-4"
    >
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

      <p className="text-center font-medium">
        Don’t have an account?{' '}
        <Link to="/signup" className="text-blue-500 hover:underline">
          Signup
        </Link>
      </p>
    </form>
  );
};

export default LoginForm;
