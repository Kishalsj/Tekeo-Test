import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import './Login.css';
import { assets } from '../../assets/assets';

const Login = ({ setLoggedIn }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState(''); // State to track error message
  const navigate = useNavigate();

  const handleLogin = () => {
    if (username === 'admin' && password === 'admin123') {
      localStorage.setItem('isLoggedIn', true);
      setLoggedIn(true);
      navigate('/list');
    } else {
      setErrorMessage('Invalid username or password'); // Set the error message
    }
  };

  return (
    <div className="login-popup">
      <h2>Admin Login</h2>
      <img 
          className="profilephoto" 
          src={assets.profile_image} 
          alt="Profile" 
      />
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      {/* Display the error message if it exists */}
      {errorMessage && (
        <div className="error-container">
          <span className="error-icon">⚠️</span>
          <p className="error-message">{errorMessage}</p>
        </div>
      )}
      <button onClick={handleLogin}>
        Login
      </button>
    </div>
  );
};

Login.propTypes = {
  setLoggedIn: PropTypes.func.isRequired,
};

export default Login;

