import { useNavigate } from 'react-router';
import React, { useState } from 'react';
import axios from 'axios';
import Navbar from './Navbar';
import './Login.css';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();
    setError('');

    try {
      const response = await axios.post('/api/users/login', { username, password });
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('activeUsername', username);
      navigate('/');
    } catch (error) {
      setError('Login failed: ' + error.response.data.message); 
    }
  };

  return (
    <>
      <Navbar />
      <form onSubmit={handleLogin} className="login-form">
        <label>
          Username:
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
        </label>
        <label>
          Password:
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </label>
        <button type="submit">Login</button>
        {error && <p className="error">{error}</p>}
      </form>
    </>
  );
}

export default Login;