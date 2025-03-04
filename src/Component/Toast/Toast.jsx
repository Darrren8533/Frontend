import React, { useState } from 'react';
import './Toast.css';

// Import Icon
import { TiTick } from "react-icons/ti";
import { IoClose } from "react-icons/io5";
import { IoWarning } from "react-icons/io5";
import { IoCloseCircleOutline } from "react-icons/io5";

const toastDetails = {
  success: {
    icon: <TiTick className="success-icon" />, 
    defaultText: 'Success: This is a success toast.',
  },
  error: {
    icon: <IoClose className="error-icon" />,
    defaultText: 'Error: This is an error toast.',
  },
  warning: {
    icon: <IoWarning className="warning-icon" />,
    defaultText: 'Warning: This is a warning toast.',
  },
};

const Toast = ({ type, message }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isClosing, setIsClosing] = useState(false);

  if (!type) return null; 

  const { icon, defaultText } = toastDetails[type] || {};
  const displayMessage = message || defaultText;

  const closeToast = () => {
    setIsClosing(true); 
    setTimeout(() => setIsVisible(false), 5000); 
  };

  return (
    isVisible && (
      <div className={`toast-container ${isClosing ? 'hide' : ''}`}>
        <ul className="notifications">
          <li className={`toast ${type} ${isClosing ? 'hide' : ''}`}>
            <div className="column">
              <div className='displayMessage'>
                {icon}
                {displayMessage}
              </div>
            </div>
            <IoCloseCircleOutline className="close_toast_button" onClick={closeToast} />
          </li>
        </ul>
      </div>
    )
  );
};

export default Toast;