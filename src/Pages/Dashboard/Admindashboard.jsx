import React, { useEffect, useState } from 'react';
import './Admindashboard.css';
import { Navigate, useLocation } from 'react-router-dom';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement // Import ArcElement for pie chart
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2'; // Corrected Pie import
import Layout from '../../Components/Layout/Layout';
import { useNavigate } from 'react-router-dom';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement // Register ArcElement for pie charts
);

const Admindashboard = () => {
  const location = useLocation();
  const { tokenid, username } = location.state || {};
  const [token, setToken] = useState(tokenid || '');
  const [user, setUsername] = useState(username || '');
  const [openmoadl, setOpenModal] = useState(false);
  const [newuser, setNewuser] = useState('');
  const [password, setPassword] = useState('');
  const [userexist, setUserExist] = useState(false);
  const [alluserdata, setAllUserdata] = useState([]);


  const [barData, setBarData] = useState({
    labels: [],
    datasets: [
      {
        label: 'AC People',
        data: [],
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
      },
      {
        label: 'Non-AC People',
        data: [],
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
      {
        label: 'Total People',
        data: [],
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
      },
    ],
  });
  const navigate = useNavigate();

  const [pieData, setPieData] = useState({
    labels: ['AC People', 'Non-AC People', 'Total People'],
    datasets: [{
      data: [],
      backgroundColor: [
        'rgba(75, 192, 192, 0.5)',
        'rgba(255, 99, 132, 0.5)',
        'rgba(54, 162, 235, 0.5)',
      ],
    }],
  });

  const [activeSection, setActiveSection] = useState('dashboard'); // Track active section

  const getLastThreeDates = () => {
    const dates = [];
    const today = new Date();

    for (let i = 0; i < 3; i++) {
      const date = new Date();
      date.setDate(today.getDate() - i);
      dates.push(date.toISOString().split('T')[0]); // Format YYYY-MM-DD
    }

    return dates.reverse(); // Return in chronological order
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const formdata = new FormData();
        formdata.append('token', token);
        formdata.append('username', user);

        const response = await fetch('http://192.168.1.25/Queue/Hotel_Admin/dashboard.php', {
          method: 'POST',
          body: formdata,
        });

        if (!response.ok) throw new Error('Network response was not ok');

        const data = await response.json();
        console.log('API Response:', data); // Log the full API response

        const lastThreeDates = getLastThreeDates();
        console.log('Last Three Dates:', lastThreeDates); // Log the last three dates

        const acCounts = lastThreeDates.map(date => Number(data.AC[date]) || 0);
        const nonAcCounts = lastThreeDates.map(date => Number(data.Non_AC[date]) || 0);
        const totalCounts = lastThreeDates.map(date => Number(data.Total[date]) || 0);

        // Update barData with the new values
        setBarData({
          labels: lastThreeDates,
          datasets: [
            {
              label: 'AC People',
              data: acCounts,
              backgroundColor: 'rgba(75, 192, 192, 0.5)',
            },
            {
              label: 'Non-AC People',
              data: nonAcCounts,
              backgroundColor: 'rgba(255, 99, 132, 0.5)',
            },
            {
              label: 'Total People',
              data: totalCounts,
              backgroundColor: 'rgba(54, 162, 235, 0.5)',
            },
          ],
        });

        const totalAc = acCounts.reduce((sum, count) => sum + count, 0);
        const totalNonAc = nonAcCounts.reduce((sum, count) => sum + count, 0);
        const totalPeople = totalCounts.reduce((sum, count) => sum + count, 0);

        setPieData(prevData => ({
          ...prevData,
          datasets: [{
            ...prevData.datasets[0],
            data: [totalAc, totalNonAc, totalPeople],
          }],
        }));

      } catch (err) {
        console.error('Error fetching data:', err);
      }
    };

    fetchData();
  }, [token, user]);

  const handlelogout = () => {
    localStorage.removeItem('isLoggedIn',);
    // navigate('/');
  }

  const handleSubmit = async (e) => {
    e.preventDefault();  // Prevent form from reloading the page
    const formData = new FormData();
    formData.append('username', user);
    formData.append('token', token);
    formData.append('new_user', newuser);
    formData.append('password', password);
    formData.append('role', 'emp');

    try {
      const response = await fetch('http://192.168.1.25/Queue/Hotel_Admin/user.php?for=add', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to submit the data');
      }

      const data = await response.json();
      console.log('User added successfully:', data);

      if (data.Status === false) {
        setUserExist(true);
      }

      // Close the modal after successful submission
      setOpenModal(false);

      // Optionally, you can reset the form fields
      setNewuser('');
      setPassword('');

    } catch (error) {
      console.error('Error submitting data:', error);
      alert('Error: ' + error.message);
    }
  };

  useEffect(async () => {
    const formData = new FormData();
    formData.append('username', user);
    formData.append('token', token);
    try {
      const response = await fetch('http://192.168.1.25/Queue/Hotel_Admin/user.php?for=get', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to submit the data');
      }

      const data = await response.json();
      console.log('hotel data:', data.User);
      setAllUserdata(data.User);
      if (data.Status === false) {
        setUserExist(true);
      }
      setOpenModal(false);
      setNewuser('');
      setPassword('');
    } catch (error) {
      console.error('Error submitting data:', error);
      alert('Error: ' + error.message);
    }

  }, [])

  const userlogout = async (delete_user) => {
    const formData = new FormData();
    formData.append('username', user);
    formData.append('token', token);
    formData.append('delete_user', delete_user);

    try {
      const response = await fetch('http://192.168.1.25/Queue/Hotel_Admin/user.php?for=remove', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to submit the data');
      }

      const data = await response.json();
      console.log('User added successfully:', data);

      // Close the modal after successful submission
      setOpenModal(false);

      // Optionally, you can reset the form fields
      setNewuser('');
      setPassword('');

    } catch (error) {
      console.error('Error submitting data:', error);
      alert('Error: ' + error.message);
    }
  }

  useEffect(() => {
    const s = localStorage.getItem('isLoggedIn');
    if (s === null && s === '') {
      navigate('/');
    }
  }, [])

  const addEmpUser = () => {
    console.log("add");
    setOpenModal(true);
  }

  const renderContent = () => {
    switch (activeSection) {
      case 'queueManage':
        return (
          <div className="dashboard-container mt-5">
            <div className="employee-manage">
              <div className="addbtn">
                <button className='mt-4' onClick={addEmpUser}>Add User</button>
              </div>
              {
                openmoadl && (
                  <div className="user-details-card text-center">
                    <form>
                      <h3>User Details</h3>
                      <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => setOpenModal(false)}
                        style={{
                          border: 'none',
                          background: 'none',
                          fontSize: '1.2rem',
                          color: 'red',
                          cursor: 'pointer',
                          outline: 'none',
                        }}
                      >
                        &#10006;
                      </button>



                      <div className="row mt-4">
                        <label htmlFor="username" className="col-4 col-form-label text-start">Username:</label>
                        <div className="col-8">
                          <input type="text" className="form-control" value={newuser}
                            onChange={(e) => setNewuser(e.target.value)} />
                        </div>
                      </div>
                      <div className="row mt-4">
                        <label htmlFor="contact" className="col-5 col-form-label text-start">Password</label>
                        <div className="col-7">
                          <input type="text" className="form-control" value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required />
                        </div>
                      </div>
                      <hr />
                      <div className="input-group row mb-3 ">
                        <span className='queuefetchbtn col-4 m-auto' style={{ margin: '0px 5px', borderRadius: '4px' }} onClick={handleSubmit}>Submit</span>
                      </div>
                    </form>
                  </div>

                )
              }

              {
                userexist && (
                  <div className='user-details-card'>
                    <div className="card" style={{ padding: '10px', marginTop: '20px' }}>
                      username already exists
                    </div>
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => setUserExist(false)}
                      style={{
                        top: '0',
                        right: '0',
                        border: 'none',
                        background: 'none',
                        fontSize: '1rem',
                        color: 'red',
                        cursor: 'pointer',
                        outline: 'none',
                      }}
                    >
                      &#10006;
                    </button>
                  </div>
                )
              }


              <div className="employee-table">
                <div className="table-container">
                  <table className="custom-table">
                    <thead>
                      <tr style={{ backgroundColor: 'white' }}>
                        <th style={{ padding: '10px' }}>Sr. No</th>
                        <th>Username</th>
                        <th>Role</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(alluserdata.length > 0) ? (
                        alluserdata.map((emp, index) => (
                          <tr key={index} style={{ cursor: 'pointer', position: 'relative' }}>
                            <td>
                              <span style={{ position: 'absolute', top: '10px', left: '10px' }}>
                                {index + 1}
                              </span>
                            </td>
                            <td>{emp.Username}</td>
                            <td>{emp.Role}</td> {/* Adjust this field based on actual API response */}
                            <td>
                              <span
                                className="data-bs-toggle"
                                data-bs-target="#exampleModal"
                                onClick={() => userlogout(emp.Username)}
                              >
                                <i className="fa-solid fa-trash text-danger"></i>
                              </span>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="4" style={{ textAlign: 'center' }}>
                            No employees found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>


            </div>
          </div>
        )

        case 'tableManage' :
            return (
              <div className='mt-5 dashboard-container'>
                Table Manage
              </div>
            )
            
      case 'dashboard':
      default:
        return (
          <div className="dashboard-container">
            <div className="upper-dashboard">
              <strong style={{ fontSize: '25px' }}>Welcome!</strong>
              <h3 style={{ textAlign: 'center' }}>Hotel Admin Dashboard</h3>
              <div className="upper">
                <div className="col4">Daily Game Visit <br /> $200</div>
                <div className="col4">Revenue<br /> $200</div>
                <div className="col4">Orders<br /> $200</div>
              </div>
            </div>
            <div className="lower">
              <div className="col6">
                <Bar
                  data={barData}
                  style={{ width: '100%', height: '100%' }}
                  options={{
                    scales: {
                      y: {
                        beginAtZero: true,
                        ticks: {
                          callback: function (value) {
                            return Number.isInteger(value) ? value : ''; // Show only integers
                          },
                        },
                      },
                    },
                  }}
                />
              </div>
              <div className="col6 piechart">
                <Pie
                  data={pieData}
                  width={'300px'}
                  height={'300px'}
                  options={{
                    responsive: true,
                    plugins: {
                      legend: {
                        position: 'top',
                      },
                      tooltip: {
                        callbacks: {
                          label: function (tooltipItem) {
                            return `${tooltipItem.label}: ${tooltipItem.raw}`; // Show label and value
                          },
                        },
                      },
                    },
                  }}
                />
              </div>
            </div>
          </div>
        );
    }
  };
  return (
    <Layout>
      <div className="admin-dashboard">
        <div className='sidebar-container'>
          <div className="sidebar">
            <div className="middle">
              <a href="" style={{ textAlign: 'center' }}>Company</a>
              <ul>
                <li><a href='#' onClick={(e) => { e.preventDefault(); setActiveSection('dashboard'); }}>Hotel Dashboard</a></li>
                <li><a onClick={(e) => { e.preventDefault(); setActiveSection('queueManage'); }}>Employee Manage</a></li>

                <li><a onClick={(e) => { e.preventDefault(); setActiveSection('tableManage'); }}>Table Managment</a></li>
                <li><a >Home</a></li>
                <div style={{ marginTop: '150px' }}>
                  <li><a>Setting</a></li>
                  {/* <li><a href="#" onClick={toggleTheme}>Dark Theme</a></li> */}
                  <li><a onClick={handlelogout} >Logout</a></li>
                </div>

              </ul>
            </div>
          </div>
        </div>
        {renderContent()} {/* Render the content based on active section */}
      </div>
    </Layout>
  );
};

export default Admindashboard;
