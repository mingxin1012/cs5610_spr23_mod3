import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router';
import './CreateUser.css';
import Navbar from './Navbar';

function CreateUser() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  
  const handleRegister = async (event) => {
    event.preventDefault();
    setError('');

    try {
      await axios.post('/api/users/register', { username, password });
      localStorage.setItem('activeUsername', username);
      navigate('/')
    } catch (error) {
      setError('Registration failed: ' + error.response.data);
    }
  };

  return (
    <>
      <Navbar />
      <form onSubmit={handleRegister} className="create-user-form">
        <label>
          Username:
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
        </label>
        <label>
          Password:
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </label>
        <button type="submit">Register</button>
        {error && <p className="error">{error}</p>}
      </form>
    </>
  );
}

export default CreateUser;