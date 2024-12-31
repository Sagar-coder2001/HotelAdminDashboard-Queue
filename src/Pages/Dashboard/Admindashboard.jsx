import React, { useEffect, useState } from 'react';
import './Admindashboard.css';
import Layout from '../../Components/Layout/Layout';
import { useNavigate } from 'react-router-dom';


const Admindashboard = () => {
  const [openmoadl, setOpenModal] = useState(false);
  const navigate = useNavigate();
  const [opendelpop , setOpenDelPop] = useState(false);
  // const [confirmdel , setconfirmdel] = useState(false);

  const handlelogout = () => {
    setOpenDelPop(true);
    // setconfirmdel()
  }
  const userlogout = () => {
    localStorage.removeItem('isLoggedIn',);
    navigate('/');
  }
  
  const handleConfirmDelete = () => {
    userlogout();
    setOpenDelPop(false);
    // setconfirmdel(null);
  };

  const handleCancelDelete = () => {
    setOpenDelPop(false);

    // setconfirmdel(null);
  };


  const addEmpUser = () => {
    console.log("add");
    setOpenModal(true);
  }

  const opentable = () => {
    navigate('/Table_dashboard');
  }
  const openhoteldashboard = () => {
    navigate('/Hotel_dashboard');
  }
  const openemployeedashboard = () => {
    navigate('/Employee_dashboard');
  }

  return (
    <Layout>
      {/* <div className="admin-dashboard"> */}
      {opendelpop && (
            <div className="delpopup">
              <div className="popup-content">
                <p> <strong>Are you sure you want to delete this user?</strong></p>
                <button onClick={handleConfirmDelete} className='okbtn'>OK</button>
                <button onClick={handleCancelDelete}>Cancel</button>
              </div>
            </div>
          )}

      <div className='sidebar-container'>
        <div className="sidebar">
          <div className="middle">
            <a href="" style={{ textAlign: 'center' }}>Company</a>
            <ul>
              <li><a onClick={(e) => { openhoteldashboard(e) }}>Banana-Leaf</a></li>
              <li><a onClick={(e) => { openhoteldashboard(e) }}>Hotel Dashboard</a></li>
              <li><a onClick={(e) => { openemployeedashboard(e) }}>Employee Manage</a></li>
              <li><a onClick={(e) => { opentable(e) }}>Table Managment</a></li>
              <div style={{ marginTop: '150px' }}>
                <li><a>Setting</a></li>
                <li><a onClick={handlelogout} >Logout</a></li>
              </div>
            </ul>
          </div>
        </div>
      </div>
      {/* </div> */}
    </Layout>
  );
};

export default Admindashboard;
