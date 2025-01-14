import React, { useContext, useState } from 'react';
import './LoginPopup.css';
import { assets } from '../../assets/assets';
import { StoreContext } from '../../context/StoreContext';
import axios from 'axios';

const LoginPopup = ({ setShowLogin }) => {
  const { url, setToken } = useContext(StoreContext);

  const [currState, setCurrState] = useState('Login');
  const [data, setData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    setData((data) => ({ ...data, [name]: value }));
  };

  const onLogin = async (event) => {
    event.preventDefault();
    let newUrl = url;
    if (currState === 'Login') {
      newUrl += '/api/user/login';
    } else {
      newUrl += '/api/user/register';
    }

    try {
      const response = await axios.post(newUrl, data);

      if (response.data.success) {
        setToken(response.data.token);
        localStorage.setItem('token', response.data.token);
        setShowLogin(false);
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target.classList.contains('login-popup')) {
      setShowLogin(false);
    }
  };

  return (
    <div className="login-popup" onClick={handleOverlayClick}>
      <div
        className="login-popup-container"
        style={{
          backgroundImage: `url(${
            currState === 'Sign Up' ? assets.signup_img : assets.login_img
          })`,
        }}
      >
        {/* Close button in the top-right corner */}
        <button
          className="login-popup-close-button"
          onClick={() => setShowLogin(false)}
        >
          ✕
        </button>
        <div className="login-popup-overlay">
          <div className="login-popup-form">
            <form onSubmit={onLogin}>
              <div className="login-popup-inputs">
                {currState === 'Sign Up' && (
                  <input
                    name="name"
                    onChange={onChangeHandler}
                    value={data.name}
                    type="text"
                    placeholder="Your name"
                    required
                  />
                )}
                <input
                  name="email"
                  onChange={onChangeHandler}
                  value={data.email}
                  type="email"
                  placeholder="Your email"
                  required
                />
                <input
                  name="password"
                  onChange={onChangeHandler}
                  value={data.password}
                  type="password"
                  placeholder="Password"
                  required
                />
              </div>
              <button type="submit">
                {currState === 'Sign Up' ? 'Create account' : 'Login'}
              </button>
            </form>

            {/* By continuing text in the right corner */}
            <div className="login-popup-condition">
              <input type="checkbox" required />
              <p>
                By continuing, I agree to the terms of use & privacy policy.
              </p>
            </div>

            {/* Create account / Login section in the right corner */}
            <div className="login-popup-footer">
              {currState === 'Login' ? (
                <p>
                  Create a new account?{' '}
                  <span onClick={() => setCurrState('Sign Up')}>Click here</span>
                </p>
              ) : (
                <p>
                  Already have an account?{' '}
                  <span onClick={() => setCurrState('Login')}>Login here</span>
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPopup;
