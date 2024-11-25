import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../Dashboard/Admindashboard.css';

import Layout from '../../Components/Layout/Layout';
import Admindashboard from '../Dashboard/Admindashboard';

const Employee_dashboard = () => {
  const location = useLocation();
  const { tokenid, username } = location.state || {};
  const [token, setToken] = useState(tokenid || '');
  const [user, setUsername] = useState(username || '');
  const [openModal, setOpenModal] = useState(false);
  const [newuser, setNewuser] = useState('');
  const [password, setPassword] = useState('');
  const [userExist, setUserExist] = useState(false);
  const [allUserdata, setAllUserdata] = useState([]);
  const [selectedRole, setSelectedRole] = useState('emp'); // State to track the selected role

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();  // Prevent form from reloading the page
    const formData = new FormData();
    formData.append('username', user);
    formData.append('token', token);
    formData.append('new_user', newuser);
    formData.append('password', password);
    formData.append('role', selectedRole); // Send the selected role

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
      setSelectedRole('emp'); // Reset role to default after submission

    } catch (error) {
      console.error('Error submitting data:', error);
      alert('Error: ' + error.message);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const formData = new FormData();
      formData.append('username', user);
      formData.append('token', token);

      try {
        const response = await fetch('http://192.168.1.25/Queue/Hotel_Admin/user.php?for=get', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error('Failed to fetch data');
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
        console.error('Error fetching data:', error);
        alert('Error: ' + error.message);
      }
    };

    fetchData();

  }, [token, user]);

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
  };

  const addEmpUser = () => {
    console.log("add");
    setOpenModal(true);
  };

  return (
    <Layout>
      <Admindashboard />
      <div className="dashboard-container mt-5">
        <div className="employee-manage">
          <div className="addbtn">
            <button className='mt-4' onClick={addEmpUser}>Add User</button>
          </div>
          {openModal && (
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
                <div className="row mt-4">
                  <label htmlFor="role" className="col-4 col-form-label text-start">Role</label>
                  <div className="col-8">
                    <select
                      className="form-control"
                      value={selectedRole}
                      onChange={(e) => setSelectedRole(e.target.value)} // Update the role state
                    >
                      <option value="emp">Employee</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                </div>
                <hr />
                <div className="input-group row mb-3">
                  <span className='queuefetchbtn col-4 m-auto' style={{ margin: '0px 5px', borderRadius: '4px' }} onClick={handleSubmit}>Submit</span>
                </div>
              </form>
            </div>
          )}

          {userExist && (
            <div className='user-details-card'>
              <div className="card" style={{ padding: '10px', marginTop: '20px' }}>
                Username already exists
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
          )}

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
                  {allUserdata.length ? (
                    allUserdata.map((emp, index) => (
                      <tr key={index} style={{ cursor: 'pointer', position: 'relative' }}>
                        <td>
                          <span>
                            {index + 1}
                          </span>
                        </td>
                        <td>{emp.Username}</td>
                        <td>{emp.Role}</td>
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
    </Layout>
  );
};

export default Employee_dashboard;
