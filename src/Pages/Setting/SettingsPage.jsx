import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import Layout from '../../Components/Layout/Layout';
import Admindashboard from '../Dashboard/Admindashboard';
import '../Dashboard/Admindashboard.css';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';

const EyeIcon = ({ onClick, isVisible }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth="1.5"
    stroke="currentColor"
    className="h-5 w-5 text-muted cursor-pointer"
    onClick={onClick}
  >
    {isVisible ? (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88"
      />
    ) : (
      <>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
        />
      </>
    )}
  </svg>
);

const SettingsPage = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // State for adding a new user
  const [newUsername, setNewUsername] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('');
  const [confirmNewUserPassword, setConfirmNewUserPassword] = useState('');
  const [newUserMessage, setNewUserMessage] = useState('');
  const [selectedRole, setSelectedRole] = useState('emp'); // Role state for new user

  const { isLoggedIn, token, username, password } = useSelector((state) => state.loggedin);

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setMessage("New password and confirm password do not match.");
    } else {
      try {
        setLoading(true);
        const formData = new FormData();
        formData.append('username', username );
        formData.append('token', token);
        formData.append('new_password', confirmPassword);

        const response = await fetch('http://192.168.1.25/Queue/Hotel_Admin/user.php?for=changePassword', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const result = await response.json();
        console.log(result);

        if (result.Authentication == false) {
          navigate('/Login');
        }
        setMessage(result.Message);
      } catch (err) {
        console.error(err.message);
      } finally {
        setLoading(false);
      }
      setNewPassword('');
      setConfirmPassword('');
    }
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    if (!newUsername || !newUserPassword || !confirmNewUserPassword) {
      setNewUserMessage("All fields are required.");
    } else if (newUserPassword !== confirmNewUserPassword) {
      setNewUserMessage("New password and confirm password do not match.");
    } else {
      try {
        setLoading(true);
        const formData = new FormData();
        formData.append('username', username);
        formData.append('token', token);
        formData.append('new_user', newUsername);
        formData.append('password', confirmNewUserPassword);
        formData.append('role', selectedRole); // Send selected role

        const response = await fetch('http://192.168.1.25/Queue/Hotel_Admin/user.php?for=add', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const result = await response.json();
        console.log(result);

        if (result.Authentication == false) {
          navigate('/Login');
        }
        setNewUserMessage(result.Message);
      } catch (err) {
        console.error(err.message);
      } finally {
        setLoading(false);
      }
      setNewUsername('');
      setNewUserPassword('');
      setConfirmNewUserPassword('');
      setSelectedRole('emp'); // Reset role selection
    }
  };

  return (
    <Layout>
      <Admindashboard />
      <motion.div
        initial={{ opacity: 0 , y: -50 }} 
        animate={{ opacity: 1, y: 0}} 
        transition={{ duration: 1 }}
      className="dashboard-container">
        <div style={{ marginTop: '50px', marginBottom: '20px' }}>
          <h1 className="text-center mb-4">Settings</h1>

          <div className="card mb-4">
            <div className="card-body">
              <h5 className="card-title">User Information</h5>
              <div className="mb-3">
                <label className="form-label">Username</label>
                <p className="form-control">{username}</p>
              </div>

              <h5 className="card-title">Change Password</h5>
              <form onSubmit={handlePasswordChange}>
                <div className="mb-3">
                  <label className="form-label">New Password</label>
                  <div className="input-group">
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="form-control"
                      required
                    />
                    <button
                      type="button"
                      className="input-group-text"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                    >
                      <EyeIcon onClick={() => setShowNewPassword(!showNewPassword)} isVisible={showNewPassword} />
                    </button>
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label">Confirm New Password</label>
                  <div className="input-group">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="form-control"
                      required
                    />
                    <button
                      type="button"
                      className="input-group-text"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      <EyeIcon onClick={() => setShowConfirmPassword(!showConfirmPassword)} isVisible={showConfirmPassword} />
                    </button>
                  </div>
                </div>

                {message && <div className="text-danger mb-3">{message}</div>}

                <button type="submit" className="btn btn-primary w-100">
                  Change Password
                </button>
              </form>
            </div>
          </div>

          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Add User</h5>
              <form onSubmit={handleAddUser}>
                <div className="mb-3">
                  <label className="form-label">Username</label>
                  <input
                    type="text"
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                    className="form-control"
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Password</label>
                  <div className="input-group">
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      value={newUserPassword}
                      onChange={(e) => setNewUserPassword(e.target.value)}
                      className="form-control"
                      required
                    />
                    <button
                      type="button"
                      className="input-group-text"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                    >
                      <EyeIcon onClick={() => setShowNewPassword(!showNewPassword)} isVisible={showNewPassword} />
                    </button>
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label">Confirm Password</label>
                  <div className="input-group">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={confirmNewUserPassword}
                      onChange={(e) => setConfirmNewUserPassword(e.target.value)}
                      className="form-control"
                      required
                    />
                    <button
                      type="button"
                      className="input-group-text"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      <EyeIcon onClick={() => setShowConfirmPassword(!showConfirmPassword)} isVisible={showConfirmPassword} />
                    </button>
                  </div>
                </div>

                <div className="row m-4">
                  <label htmlFor="role" className="col-4 col-form-label text-start">Role</label>
                  <div className="col-8">
                    <select
                      className="form-control"
                      value={selectedRole}
                      onChange={(e) => setSelectedRole(e.target.value)}
                    >
                      <option value="emp">Employee</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                </div>

                {newUserMessage && <div className="text-success mb-3">{newUserMessage}</div>}

                <button type="submit" className="btn btn-success w-100">
                  Add User
                </button>
              </form>
            </div>
          </div>
        </div>
      </motion.div>
    </Layout>
  );
};

export default SettingsPage;
