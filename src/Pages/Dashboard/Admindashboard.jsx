import React, { useState, useEffect } from 'react';
import './Admindashboard.css';
import Navbar from '../../Components/Navbar/Navbar';

const Admindashboard = () => {
  const [showbar, setShowbar] = useState('');

  return (
    <>
      <div className="admin-dashboard">
        <Navbar />
        <div className="container-flui">
          {/* Conditionally add a class to sidebar-container based on showbar value */}
          <div className={`sidebar-container ${showbar === 'true' ? 'show-sidebar' : ''}`}>
          <i class="fa-solid fa-bars"></i>
            <div>
              <h5>Company</h5>
            </div>
          </div>
          <div className="dashboard-container">
            <h2>Dashboard</h2>
          </div>
        </div>
      </div>
    </>
  );
};

export default Admindashboard;
