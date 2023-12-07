import React, { useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useUser } from './UserContext';
import './Navbar.css';

export default function Navbar() {
  const { activeUsername, setActiveUsername } = useUser();

  useEffect(() => {
    async function checkIfUserIsLoggedIn() {
      try {
        const response = await axios.get('/api/users/isLoggedIn');
        console.log("checkIfUserIsLoggedIn", response.data.username);
        setActiveUsername(response.data.username);
      } catch (error) {
        console.error('Error checking login status:', error);
      }
    }
    checkIfUserIsLoggedIn();
  }, []);

  async function logOutUser() {
    await axios.post('/api/users/logOut');
    localStorage.removeItem("activeUsername");
    setActiveUsername(null);
  }

  return (
    <div className='navbar'>
      <Link to="/">Home</Link>
      <div className="navbar-links">
        {!activeUsername ? (
          <>
            <Link to="/login">Log In</Link>
            <Link to="/register">Sign Up</Link>
          </>
        ) : (
          <>
            <Link to={`/${activeUsername}`}>{activeUsername}</Link>
            <button onClick={logOutUser}>Log Out</button>
          </>
        )}
      </div>
    </div>
  );
}