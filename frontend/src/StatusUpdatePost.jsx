import React from 'react';
import './StatusUpdatePost.css';
import { Link } from 'react-router-dom';

function StatusUpdatePost({ username, text, createdAt }) {
    return (
        <div className="status-update-post">
          <Link to={`/${username}`} className="username">{username}</Link>
          <div className="timestamp">{new Date(createdAt).toLocaleString()}</div>
          <div>{text}</div>
        </div>
    );
}

export default StatusUpdatePost;
