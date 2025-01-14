
import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import Sidebar from './components/Sidebar/Sidebar';
import Add from './pages/Add/Add';
import List from './pages/List/List';
import Orders from './pages/Orders/Orders';
import Login from './components/Login/Login';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AdminChat from './components/AdminChat/AdminChat';

const App = () => {
  const [isLoggedIn, setLoggedIn] = useState(false);
  const url = 'http://localhost:4000';

  useEffect(() => {
    // Check login status on app load
    const status = localStorage.getItem('isLoggedIn');
    setLoggedIn(status === 'true');
  }, []);

  const handleLogout = () => {
    // Clear login status and set loggedIn state to false
    localStorage.removeItem('isLoggedIn');
    setLoggedIn(false);
  };

  if (!isLoggedIn) {
    return <Login setLoggedIn={setLoggedIn} />;
  }

  return (
    <div>
      <ToastContainer />
      <Navbar handleLogout={handleLogout} /> {/* Pass logout function to Navbar */}
      <hr />
      <div className="app-content">
        <Sidebar />
        <Routes>
          <Route path="/add" element={<Add url={url} />} />
          <Route path="/list" element={<List url={url} />} />
          <Route path="/orders" element={<Orders url={url} />} />
          <Route path="*" element={<Navigate to="/list" />} />
          <Route path="/chat" element={<AdminChat/>} />


        </Routes>
      </div>
    </div>
  );
};

export default App;
