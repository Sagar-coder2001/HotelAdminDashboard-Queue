import React, { useEffect, useState } from 'react';
import './Admindashboard.css';
import Layout from '../../Components/Layout/Layout';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';


const Admindashboard = () => {
  const [openmoadl, setOpenModal] = useState(false);
  const navigate = useNavigate();
  const [opendelpop, setOpenDelPop] = useState(false);
  // const [confirmdel , setconfirmdel] = useState(false);
  const [clickbar, setclickbar] = useState(false)

  const bgcolor = useSelector((state) => state.theme.navbar);
  const modalbg = useSelector((state) => state.theme.modal)
  const hover = useSelector((state) => state.theme.hover)
  const color = useSelector((state) => state.theme.textcolor)

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
  };

  const handleCancelDelete = () => {
    setOpenDelPop(false);
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
      <i className={clickbar ? "fa-solid fa-times" : "fa-solid fa-bars"} onClick={() => setclickbar(prevState => !prevState)} style={{ position: 'fixed', top: '25px', zIndex: 2000, left: '20px', cursor: 'pointer' }}></i>

      {opendelpop && (
        <div className="delpopup">
          <div className="popup-content">
            <p> <strong>Are you sure you want to Logout this user?</strong></p>
            <button onClick={handleConfirmDelete} className='okbtn'>OK</button>
            <button onClick={handleCancelDelete}>Cancel</button>
          </div>
        </div>
      )}

      <div className={`sidebar-container ${clickbar ? 'active-class' : 'inactive-class'}`} style={{ backgroundColor: modalbg, color: color }}>
        <div className="sidebar">
          <div className="middle">
            <ul style={{ color: color }} >
              <a onClick={(e) => { openhoteldashboard(e) }} style={{ fontSize: '18px' }}>Banana-Leaf</a>
              <hr></hr>
              <li><a onClick={(e) => { openhoteldashboard(e) }} style={{ backgroundColor: hover }}>Hotel Dashboard</a></li>
              <li><a onClick={(e) => { openemployeedashboard(e) }} style={{ backgroundColor: hover }}>Employee Manage</a></li>
              <li><a onClick={(e) => { opentable(e) }} style={{ backgroundColor: hover }}>Table Managment</a></li>
              <div style={{ marginTop: '150px' }}>
                <li><a style={{ backgroundColor: hover }}>Setting</a></li>
                <li><a onClick={handlelogout} style={{ backgroundColor: hover }} >Logout</a></li>
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
