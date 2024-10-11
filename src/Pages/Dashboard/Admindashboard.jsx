import React, { useState } from 'react';
import './Admindashboard.css';
import Navbar from '../../Components/Navbar/Navbar';

const Admindashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // State to manage sidebar visibility

  const toggleSidebar = () => {
    setIsSidebarOpen(prevState => !prevState); // Toggle the state
  };

  return (
    <>
      <Navbar />
      <div className="admin-dashboard">
        <div className={`sidebar-container ${isSidebarOpen ? 'closed' : 'open'}`}>
          <i className={`fa-solid fa-angle-${isSidebarOpen ? 'left' : 'right'}`} onClick={toggleSidebar}></i>
          <div className="sidebar">
            <div className="top">
              Company
            </div>
            <div className="middle">
              <ul>
                <li>Home</li>
                <li>Home</li>
                <li>Home</li>
                <li>Home</li>
                <li>Home</li>
                <li>Home</li>
                <li>Home</li>
              </ul>
            </div>
          </div>
        </div>
        <div className="dashboard-container">
         
        </div>
      </div>
    </>
  );
};

export default Admindashboard;
