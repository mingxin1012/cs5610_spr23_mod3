import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useUser } from './UserContext';
import StatusUpdatePost from './StatusUpdatePost';
import './UserPage.css';
import Navbar from './Navbar';

function UserPage() {
  const { username } = useParams(); // This captures the "username" parameter from the URL
  const { activeUsername } = useUser();
  const [userDetails, setUserDetails] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [description, setDescription] = useState('');
  const [statusUpdates, setStatusUpdates] = useState([]);

  const [editingUpdateId, setEditingUpdateId] = useState(null);
  const [newUpdateText, setNewUpdateText] = useState("");

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axios.get(`/api/users/${username}`);
        setUserDetails(response.data);
        setDescription(response.data.description);

      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    };

    fetchUserDetails();
  }, [username]);
  

  
  useEffect(() => {
    if (userDetails) {
      axios.get(`/api/status/updates/${username}`)
        .then(response => setStatusUpdates(response.data))
        .catch(error => console.error('Error fetching status updates:', error));
    }
  }, [userDetails, username]);

  const handleDescriptionEdit = async () => {
    const response = await axios.put(`/api/users/updateDescription/${username}`, { description });
    if (response.status === 200) {
        setUserDetails(prevDetails => ({ ...prevDetails, description }));
      }
    setIsEditing(false);
  
  };

  const handleEdit = async (updateId) => {
    try {
      const response = await axios.put(`/api/status/update/${updateId}`, {
        text: newUpdateText
      });

      setStatusUpdates((prevUpdates) => 
        prevUpdates.map((update) =>
          update._id === updateId ? { ...update, text: newUpdateText } : update
        )
      );
      setEditingUpdateId(null); 
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const handleDelete = async (updateId) => {
    try {
      await axios.delete(`/api/status/delete/${updateId}`);
      setStatusUpdates((prevUpdates) => 
        prevUpdates.filter((update) => update._id !== updateId)
      );
    } catch (error) {
      console.error('Error deleting status:', error);
    }
  };

  return (
    <div>
      <Navbar />
      {userDetails && (
        <div className="user-profile">
          <h1 className="user-name">{userDetails.username}</h1>
          <p className="user-joined">Joined: {new Date(userDetails.joinDate).toLocaleDateString()}</p>
          <div className="user-description-container">
            {activeUsername === username && isEditing ? (
              <>
                <textarea 
                  className="description-edit"
                  value={description} 
                  onChange={(e) => setDescription(e.target.value)} 
                />
                <button onClick={handleDescriptionEdit} className="save-btn">Save</button>
              </>
            ) : (
              <>
                <p className="user-description">{description}</p>
                {activeUsername === username && (
                  <button onClick={() => setIsEditing(true)} className="edit-btn">Edit</button>
                )}
              </>
      )}
    </div>
          <h2>Status Updates</h2>
          {statusUpdates.map((update) => (
            <div key={update._id} className="status-update-container">
              <StatusUpdatePost
                username={update.username}
                createdAt={update.createdAt}
                text={editingUpdateId === update._id ? "" : update.text}
              />
              {activeUsername === update.username && (
                <div className="status-update-actions">
                  {editingUpdateId === update._id ? (
                    <>
                      <textarea 
                        value={newUpdateText}
                        onChange={(e) => setNewUpdateText(e.target.value)}
                        className="status-update-edit-textarea"
                      />
                      <button onClick={() => handleEdit(update._id)} className="status-update-save-btn">Save</button>
                      <button onClick={() => setEditingUpdateId(null)} className="status-update-cancel-btn">Cancel</button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => {
                          setEditingUpdateId(update._id);
                          setNewUpdateText(update.text);
                        }} className="status-update-edit-btn"
                      >Edit</button>
                      <button onClick={() => handleDelete(update._id)} className="status-update-delete-btn">Delete</button>
                    </>
            )}
              </div>
                      )}
              </div>
            ))}

        </div>
      )}
    </div>
  );
}

export default UserPage;