import React, { useState } from 'react'
import './LoginForm.css';
import { useDispatch } from 'react-redux';
import { selectCategory } from '../../Features/Tokenslice';
import { useNavigate } from 'react-router-dom';

const LoginForm = () => {
  const [userdetails, setUserDetails] = useState({
    username: '',
    password: ''
  })
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onchangetext = (e) => {
    setUserDetails((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));

  }

  const submitDetails = async (e) => {
    e.preventDefault();
    try {
      const formdata = new FormData();
      formdata.append('username', userdetails.username);
      formdata.append('password', userdetails.password);

      const response = await fetch('http://192.168.1.25/Queue/login.php?do=login&hotel_id=HOT000001', {
        method: 'POST',
        body: formdata,
      });
      const data = await response.json();
      console.log(data);

      if (data.Status === true) {
        navigate('/Admindashboard');
      }

      dispatch(selectCategory(
        {
          Role: data.Role,
          Username: userdetails.username
        }
      ));

    }
    catch (err) {
      console.log(err);
    }
  }

  return (
    <div>
      <div className="login-container">

        <div className="loginnavbar">

          <div className="left">
            <img src="https://www.shutterstock.com/image-vector/circle-line-simple-design-logo-600nw-2174926871.jpg" alt="" />
          </div>
          <div className="middle">
            Company Name
          </div>
          <div className="right">
          </div>
          
        </div>

        <div className="card-container">


          <form>
            <h4 className='text-center fs-2'>Login</h4>
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
            <button type="submit" className="btn btn-primary mt-2" onClick={submitDetails}>Submit</button>

          </form>

        </div>
      </div>
    </div>
  )
}

export default LoginForm
