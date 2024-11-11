import React, { useState, useEffect } from 'react';
import './LoginForm.css';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Layout from '../../Components/Layout/Layout';
import { userlogin } from '../../Features/Userslice';

const LoginForm = () => {
  const [userdetails, setUserDetails] = useState({
    username: '',
    password: ''
  });
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Check local storage on mount
  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (isLoggedIn === 'true') {
      // Clear local storage and redirect to dashboard
      localStorage.removeItem('isLoggedIn');
      navigate('/');
    }
  }, [navigate]);

  const onchangetext = (e) => {
    setUserDetails((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const submitDetails = async (e) => {
    e.preventDefault();
    try {
      const formdata = new FormData();
      formdata.append('username', userdetails.username);
      formdata.append('password', userdetails.password);

      const response = await fetch('http://192.168.1.25/Queue/login.php?do=login&hotel_id=HOT000002', {
        method: 'POST',
        body: formdata,
      });
      const data = await response.json();
      console.log(data);

      if (data.Status === true) {
        localStorage.setItem('isLoggedIn', 'true');
        dispatch(userlogin());
        navigate('/Admindashboard', { state: { tokenid: data.Token, username: userdetails.username } });
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      <Layout>
        <div className="login-container">
          <div className="card-container">
            <form>
              <h4 className='text-center fs-2'>Hotel Login</h4>
              <div className="mb-3">
                <label htmlFor="username" className="form-label">Username</label>
                <input type="email" className="form-control" value={userdetails.username} onChange={onchangetext} id="username" name='username' />
              </div>
              <div className="mb-3">
                <label htmlFor="password" className="form-label">Password</label>
                <input type="password" className="form-control" value={userdetails.password} onChange={onchangetext} name='password' id="password" />
              </div>
              <div className="mb-3 form-check">
                <input type="checkbox" className="form-check-input" id="exampleCheck1" />
                <label htmlFor="form-check-label">Check me out</label>
              </div>
              <button type="submit" className="btn mt-2" onClick={submitDetails}><strong>Submit</strong></button>
            </form>
          </div>
        </div>
      </Layout>
    </div>
  );
};

export default LoginForm;
