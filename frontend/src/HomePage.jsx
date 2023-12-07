import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import StatusUpdate from './StatusUpdate';
import StatusUpdatePost from './StatusUpdatePost';
import axios from 'axios';
import { useUser } from './UserContext';

export default function HomePage() {
  const [statusUpdates, setStatusUpdates] = useState([]);
  const { activeUsername } = useUser();
  
  useEffect(() => {
    axios.get('/api/status/updates')
      .then(response => setStatusUpdates(response.data))
      .catch(error => console.error('Error fetching status updates:', error));
  }, []);

  const addNewStatusUpdate = (newUpdate) => {
    setStatusUpdates([newUpdate, ...statusUpdates]);
  };
  
  return (
    <div>
      <Navbar />
      {activeUsername && <StatusUpdate onNewPost={addNewStatusUpdate} />}
      {statusUpdates.map(update => (
        <StatusUpdatePost
          key={update._id}
          username={update.username}
          createdAt={update.createdAt}
          text={update.text}
        />
      ))}
    </div>
  );
}
