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
  const [showerr , setshowerr] = useState(false)
  const [filepath , setfilepath] = useState('')

  const [isDarkTheme, setIsDarkTheme] = useState(false);


  useEffect(() => {
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme === 'dark') {
      setIsDarkTheme(true);
    } else {
      setIsDarkTheme(false);
    }
  }, []);

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (isLoggedIn === 'true') {
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

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);

    const file = queryParams.get('HID');

    setfilepath(file);
  }, [])


  const submitDetails = async (e) => {
    e.preventDefault();
    // navigate('/Hotel_dashboard');
    try {
      const formdata = new FormData();
      formdata.append('username', userdetails.username);
      formdata.append('password', userdetails.password);
      const response = await fetch(`http://192.168.1.25/Queue/login.php?do=login&hotel_id=${filepath}`, {
        method: 'POST',
        body: formdata,
      });
      const data = await response.json();
      console.log(data);

      if (data.Status === true) {
        localStorage.setItem('isLoggedIn', 'true');
        dispatch(userlogin());
        navigate('/Hotel_dashboard', { state: { tokenid: data.Token, username: userdetails.username } });
      }
      if(data.Status === false){
        setshowerr(true);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      <Layout>
        {/* Apply dynamic class for background color based on the theme */}
        <div className={`login-container ${isDarkTheme ? 'dark' : 'light'}`}>
          {
            showerr ? (
              <>
              <div className="showerr">
                <div>
                <span>Invalid Credentials</span>
                </div>
                <button onClick={() => setshowerr(false)}>ok</button>
              </div>
              </>
            ) : 
            <div className="card-container">
            <form>
              <h4 className="text-center fs-2">Hotel Login</h4>
              <div className="mb-3">
                <label htmlFor="username" className="form-label">Username</label>
                <input 
                  type="email" 
                  className="form-control" 
                  value={userdetails.username} 
                  onChange={onchangetext} 
                  id="username" 
                  name="username" 
                />
              </div>
              <div className="mb-3">
                <label htmlFor="password" className="form-label">Password</label>
                <input 
                  type="password" 
                  className="form-control" 
                  value={userdetails.password} 
                  onChange={onchangetext} 
                  name="password" 
                  id="password" 
                />
              </div>
              <div className="mb-3 form-check">
                <input type="checkbox" className="form-check-input" id="exampleCheck1" />
                <label htmlFor="form-check-label">Check me out</label>
              </div>
              <button 
                type="submit" 
                className="btn mt-2" 
                onClick={submitDetails}
              >
                <strong>Submit</strong>
              </button>
            </form>
          </div>
          }
       
        </div>
      </Layout>
    </div>
  );
};

export default LoginForm;
