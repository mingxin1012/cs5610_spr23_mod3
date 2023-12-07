import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useUser } from './UserContext';
import './StatusUpdate.css';

function StatusUpdate({ onNewPost }) {
  const [statusText, setStatusText] = useState('');
  const [statusUpdates, setStatusUpdates] = useState([]);
  const { activeUsername } = useUser();
  useEffect(() => {
    axios.get('/api/status/updates')
      .then(response => setStatusUpdates(response.data))
      .catch(error => console.error('Error fetching status updates:', error));
  }, []);

  const handlePostUpdate = async (event) => {
    event.preventDefault();
    try {
       
        const response = await axios.post('/api/status/post', { username: activeUsername,  text: statusText });
        if (response.status === 200) {
          onNewPost(response.data);
        }
        setStatusUpdates([...statusUpdates, response.data]);
        setStatusText(''); // Clear input field
    } catch (error) {
        console.error('Error posting status update:', error); 
    }
  };

  return (
    <div className="status-update-container">
      <form onSubmit={handlePostUpdate} className="status-update-form">
        <textarea
          className="status-update-textarea"
          value={statusText}
          onChange={(e) => setStatusText(e.target.value)}
        ></textarea>
        <button type="submit" className="status-update-submit-btn">Post Update</button>
      </form>
    </div>

  );
}

export default StatusUpdate;
