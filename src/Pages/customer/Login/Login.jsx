import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../Login/Login.css';

// Import Assets
import video from '../../../public/Sarawak_2.mp4';
import logo from '../../../public/Sarawak_icon.png';

// Import Icons
import { FaUserCircle } from 'react-icons/fa';
import { RiLockPasswordFill } from 'react-icons/ri';

// Import API function
import { loginUser } from '../../../../../Backend/Api/api';

// Import Toast
import Toast from '../../../Component/Toast/Toast';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  // Toast Function
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [toastType, setToastType] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userData = { username, password };

    try {
      const response = await loginUser(userData);
      const data = await response.json();

      if (response.ok && data.success) {
        // Save data to localStorage
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('username', username);
        localStorage.setItem('userGroup', data.userGroup);
        localStorage.setItem('userID', data.userID);
        localStorage.setItem('uActivation', data.uActivation);

        // Logging for verification
        console.log('User Group:', data.userGroup);
        console.log('User Activation:', data.uActivation);

        // Show toast and navigate after a delay
        if (data.uActivation === 'Inactive') {
          displayToast('error', 'Your account is inactive.');
          setTimeout(() => navigate('/no-access'), 2000);
        } else if (data.userGroup === 'Customer') {
          displayToast('success', 'Login successful! Redirecting...');
          setTimeout(() => navigate('/login/home'), 2000); 
        } else if (data.userGroup === 'Owner') {
          displayToast('success', 'Login successful! Redirecting...');
          setTimeout(() => navigate('/login/owner_dashboard'), 2000); 
        } else if (data.userGroup === 'Moderator') {
          displayToast('success', 'Login successful! Redirecting...');
          setTimeout(() => navigate('/login/moderator_dashboard'), 2000); 
        } else if (data.userGroup === 'Administrator') {
          displayToast('success', 'Login successful! Redirecting...');
          setTimeout(() => navigate('/login/administrator_dashboard'), 2000); 
        } else {
          displayToast('error', 'Invalid user group.');
        }
      } else {
        // Handle failed login attempt
        displayToast('error', data.message || 'Invalid username or password.');
      }
    } catch (error) {
      console.error('Error during login:', error);
      displayToast('error', 'An unexpected error occurred. Please try again.');
    }
  };

  // Toast Display Function
  const displayToast = (type, message) => {
    setToastType(type);
    setToastMessage(message);
    setShowToast(true);


    setTimeout(() => setShowToast(false), 5000);
  };

  return (
    <div className="loginPage flex">
      {/* Display Toast */}
      {showToast && <Toast type={toastType} message={toastMessage} />}

      <div className="container flex">
        <div className="videoDiv">
          <video src={video} autoPlay muted loop></video>
          <div className="textDiv">
            <h2 className="title_A">Hello Sarawak</h2>
            <h3 className="title_B">Your Journey Begins</h3>
          </div>
          <div className="footerDiv flex">
            <span className="text">Don't Have An Account?</span>
            <Link to={'/register'}>
              <button className="btn">Sign Up</button>
            </Link>
          </div>
        </div>

        <div className="formDiv flex">
          <div className="headerDiv">
            <img src={logo} alt="Logo" />
            <div className="textDiv">
              <h3 className="title_C">
                Welcome To
                <br />
                Hello Sarawak
              </h3>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="form grid">
            <div className="inputDiv">
              <label htmlFor="username">Username</label>
              <div className="input flex">
                <FaUserCircle className="icon" />
                <input
                  type="text"
                  id="username"
                  placeholder="Enter Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="inputDiv">
              <label htmlFor="password">Password</label>
              <div className="input flex">
                <RiLockPasswordFill className="icon" />
                <input
                  type="password"
                  id="password"
                  placeholder="Enter Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <br />

            <button type="submit" className="btn">
              <span>Login</span>
            </button>

            <button onClick={() => navigate('/register')} className="btn_responsive">
              <span>Sign Up</span>
            </button>

            <span className="forgotpassword">
              Forgot Password? <Link to="/login">Click Here</Link>
            </span>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
