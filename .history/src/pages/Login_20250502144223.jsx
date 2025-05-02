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
      credentials: 'include',
    });

    const data = await response.json();
    console.log('Login Response Data:', data);

    if (response.ok && data.access_token) {
      // Log the raw token
      console.log('Raw Token:', data.access_token);

      // Decode the token
      const decoded = jwt_decode(data.access_token);  // Use jwt_decode() correctly
      console.log('Decoded Token:', decoded);  // Log the decoded token

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
