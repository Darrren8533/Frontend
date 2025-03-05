import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Register.css';

// Import Assets using ES Modules
import video from '../../../public/Sarawak_2.mp4';
import logo from '../../../public/Sarawak_icon.png';

// Import Icons
import { FaMailBulk, FaUserCircle } from 'react-icons/fa';
import { RiLockPasswordFill, RiLockPasswordLine } from 'react-icons/ri';
import { FaUserAlt } from 'react-icons/fa';

// Import API function
import { signupUser } from '../../../../Api/api';

// Import Toast
import Toast from '../../../Component/Toast/Toast';

import VisualCaptcha from '../../../Component/VisualCaptcha/VisualCaptcha'; 

const Register = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();
  const userGroup = 'Customer';
  const [isCaptchaValid, setIsCaptchaValid] = useState(false);

  // Toast Function
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [toastType, setToastType] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if passwords match
    if (password !== confirmPassword) {
      displayToast('error', 'Passwords do not match.');
      return;
    }

    // Check if captcha is valid
    if (!isCaptchaValid) {
      displayToast('error', 'Please complete the verification code.');
      return;
    }

    // Check if passwords match
    if (password !== confirmPassword) {
      displayToast('error', 'Passwords do not match.');
      return;
    }

    const userData = {
      firstName,
      lastName,
      username,
      email,
      password,
      userGroup,
    };

    try {
      // Call the signupUser function and await the response
      const response = await signupUser(userData);
      const data = await response.json(); // Parse the JSON response

      // Handle response based on success or error
      if (response.ok && data.success) {
        displayToast('success', 'Registration successful!');
        setTimeout(() => navigate('/login'), 1000); 
      } else {
        displayToast('error', data.message || 'Error during registration.');
      }
    } catch (error) {
      console.error('Error during registration:', error);
      displayToast('error', 'An error occurred during registration.');
    }
  };

  // Function to display Toast
  const displayToast = (type, message) => {
    setToastType(type);
    setToastMessage(message);
    setShowToast(true);


    setTimeout(() => setShowToast(false), 3000);
  };

  return (
    <div className="registerPage flex">
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
            <span className="text">Already Have Account?</span>
            <Link to={'/login'}>
              <button className="btn">Sign In</button>
            </Link>
          </div>
        </div>

        <div className="formDiv flex">
          <div className="headerDiv">
            <img src={logo} alt="Logo Image" />
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
              <label htmlFor="firstName">First Name</label>
              <div className="input flex">
                <FaUserCircle className="icon" />
                <input
                  type="text"
                  id="firstName"
                  placeholder="Enter First Name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="inputDiv">
              <label htmlFor="lastName">Last Name</label>
              <div className="input flex">
                <FaUserCircle className="icon" />
                <input
                  type="text"
                  id="lastName"
                  placeholder="Enter Last Name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="inputDiv">
              <label htmlFor="username">Username</label>
              <div className="input flex">
                <FaUserAlt className="icon" />
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
              <label htmlFor="email">Email</label>
              <div className="input flex">
                <FaMailBulk className="icon" />
                <input
                  type="email"
                  id="email"
                  placeholder="Enter Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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

            <div className="inputDiv">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <div className="input flex">
                <RiLockPasswordLine className="icon" />
                <input
                  type="password"
                  id="confirmPassword"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Add the CAPTCHA component just before the submit button */}
            <VisualCaptcha onValidationChange={setIsCaptchaValid} />

            <div className="container_button">
              <button type="submit" className="btn">
                <span>Sign Up</span>
              </button>

              <button onClick={() => navigate('/login')} className="btn_responsive_signUp">
                <span>Login</span>
              </button>
            </div>

            <span className="forgotpassword">
              Forgot Password? <Link to="/login">Click Here</Link>
            </span>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
