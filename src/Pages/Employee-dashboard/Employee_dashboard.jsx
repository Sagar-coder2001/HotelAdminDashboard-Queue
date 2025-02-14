import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../Dashboard/Admindashboard.css';
import Layout from '../../Components/Layout/Layout';
import Admindashboard from '../Dashboard/Admindashboard';
import '../Employee-dashboard/Employeedashboard.css';
import { useSelector } from 'react-redux';
import DataTable from 'react-data-table-component';

const Employee_dashboard = () => {
  const location = useLocation();
  const [openModal, setOpenModal] = useState(false);
  const [newuser, setNewuser] = useState('');
  const [password, setPassword] = useState('');
  const [userExist, setUserExist] = useState(false);
  const [allUserdata, setAllUserdata] = useState([
  ]);
  const [selectedRole, setSelectedRole] = useState('emp');
  const [delpopbox, setdelpopbox] = useState(false);
  const [confirmdel, setconfirmdel] = useState(false);
  const bgcolor = useSelector((state) => state.theme.navbar);
  const modalbg = useSelector((state) => state.theme.modal)
  const color = useSelector((state) => state.theme.textcolor)
  const { token, username } = useSelector((state) => state.loggedin);
  const [useraddloading, setauseraddloading] = useState(false);


  const navigate = useNavigate();

  // Handle user form submission
  const handleSubmit = async (e) => {
    setauseraddloading(true)
    e.preventDefault();
    const formData = new FormData();
    formData.append('username', username);
    formData.append('token', token);
    formData.append('new_user', newuser);
    formData.append('password', password);
    formData.append('role', selectedRole);
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

      if (data.Status === true) {
        window.location.reload();
      }

      if (data.Status === false) {
        setUserExist(true);
      }

      setOpenModal(false);
      setNewuser('');
      setPassword('');
      setSelectedRole('emp'); // Reset role to default after submission

    } catch (error) {
      console.error('Error submitting data:', error);
      alert('Error: ' + error.message);
    }
    finally {
      setauseraddloading(false);
    }
  };

  // Fetch user data
  useEffect(() => {
    const fetchData = async () => {
      const formData = new FormData();
      formData.append('username', username);
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
        console.log(data)
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
  }, [token, username]);


  const userlogoutpopbox = (delete_user) => {
    setdelpopbox(true);
    setconfirmdel(delete_user);
  };

  const handleConfirmDelete = () => {
    userlogout(confirmdel);
    setdelpopbox(false);
    setconfirmdel(null);
  };

  const handleCancelDelete = () => {
    setdelpopbox(false);
    setconfirmdel(null);
  };


  const userlogout = async (delete_user) => {
    setauseraddloading(true)
    const formData = new FormData();
    formData.append('username', username);
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
      console.log('User removed successfully:', data);
      setOpenModal(false);
      setNewuser('');
      setPassword('');
      window.location.reload();
    } catch (error) {
      console.error('Error submitting data:', error);
      alert('Error: ' + error.message);
    }
    finally {
      setauseraddloading(false)
    }
  };
  const addEmpUser = () => {
    console.log("add");
    setOpenModal(true);
  };


  const columns = [
    {
      name: <><div className='heading'>Sr. No</div></>,
      selector: (row, index) => <><div className='srno'>{index + 1}</div></>,
      sortable: true,
    },
    {
      name: <><div className='heading'>Username</div></>,
      selector: row => <><div className='srno'>{row.Username}</div></>,
      sortable: true,
    },
    {
      name: <><div className='heading'>Role</div></>,
      selector: row => <><div className='srno'>{row.Role}</div></>,
      sortable: true,
    },
    {
      name: <><div className='heading'>Action</div></>,
      cell: row => (
        <span
          className="data-bs-toggle"
          data-bs-target="#exampleModal"
          onClick={() => userlogoutpopbox(row.Username)}
        >
          <i className="fa-solid fa-trash text-danger srno"></i>
        </span>
      ),
    }
  ];


  // const columns = [
  //   {
  //     name: <><div className='heading'>Sr. No</div></>,
  //     selector: () => <><div className='srno'>1</div></>,
  //     sortable: true,
  //   },
  //   {
  //     name: <><div className='heading'>Username</div></>,
  //     selector: row => <><div className='srno'>pranav</div></>,

  //     sortable: true,
  //   },
  //   {
  //     name: <><div className='heading'>Role</div></>,
  //     selector: row => <><div className='srno'>emp</div></>,

  //     sortable: true,
  //   },
  //   {
  //     name: <><div className='heading'>Action</div></>,
  //     cell: row => (
  //       <span
  //         className="data-bs-toggle"
  //         data-bs-target="#exampleModal"
  //       >
  //         <i className="fa-solid fa-trash text-danger srno"></i>
  //       </span>
  //     ),
  //   }
  // ];

  return (
    <Layout>
      <Admindashboard />
      <div className="dashboard-container" style={{ marginTop: '50px' }}>
        <div className="employee-manage">
          <div className="addbtn">
            <button className='mt-4' onClick={addEmpUser}>Add User</button>
          </div>
          {openModal && (
            <div className="user-details-card text-center" style={{ backgroundColor: modalbg, color: color }}>
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
                  <label htmlFor="contact" className="col-4 col-form-label text-start">Password</label>
                  <div className="col-8">
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
                  <span className='queuefetchbtn col-4 m-auto' style={{ margin: '0px 25px', borderRadius: '4px' }} onClick={handleSubmit}>Submit</span>
                </div>
              </form>
            </div>
          )}

          {delpopbox && (
            <div className="delpopup">
              <div className="popup-content">
                <p> <strong>Are you sure you want to delete this user?</strong></p>
                <button onClick={handleConfirmDelete} className='okbtn'>OK</button>
                <button onClick={handleCancelDelete}>Cancel</button>
              </div>
            </div>
          )}

          {
            useraddloading && (
              <>
                <div className="loader-overlay delpopup">
                  <div class="spinner-border text-primary" role="status">
                    <span class="sr-only">Loading...</span>
                  </div>
                </div>
              </>
            )
          }

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

          <div className="employee-table" style={{backgroundColor: modalbg, color: color, width:'100%', height:'auto', marginTop:'20px', borderRadius:'6px'}}>
            <div className="table-container" style={{padding:'20px 0px'}} >
              <DataTable
               title={<span style={{fontSize: '24px', fontWeight: 'bold' }}>Employee Managment</span>}
                columns={columns}
                data={allUserdata}
                pagination
                paginationPerPage={15} 
                striped
                responsive
                highlightOnHover
                paginationComponentOptions={{
                  noRowsPerPage: true
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Employee_dashboard;
