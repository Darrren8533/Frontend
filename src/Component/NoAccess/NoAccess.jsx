import './NoAccess.css';
import React from 'react';
import { useNavigate } from 'react-router-dom';

const NoAccess = () => {
  const navigate = useNavigate();

  return (
    <div className="no-access-container">
      <h1>Please Login Again</h1>
      <p>We're sorry, your session has been expired, please login again.</p>
      <button 
        onClick={() => navigate('/login')} 
        className="no-access-button"
      >
        Continue
      </button>
    </div>
  );
};

export default NoAccess;
