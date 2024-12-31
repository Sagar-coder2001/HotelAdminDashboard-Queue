import React, { useState, useEffect } from 'react';
import './LoginForm.css';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Layout from '../../Components/Layout/Layout';
import { userlogin ,logout } from '../../Features/Userslice';

const LoginForm = () => {
  const [userdetails, setUserDetails] = useState({
    username: '',
    password: ''
  });
  
  const loggedin = useSelector((state) => state.loggedin.isLoggedIn);
  console.log(loggedin);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showerr, setshowerr] = useState(false)
  const [filepath, setfilepath] = useState('')

  const [isDarkTheme, setIsDarkTheme] = useState(false);


  useEffect(() => {
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme === 'dark') {
      setIsDarkTheme(true);
    } else {
      setIsDarkTheme(false);
    }
  }, []);

  // useEffect(() => {
  //   const isLoggedIn = JSON.parse(localStorage.getItem('isLoggedIn'));
  //   if (isLoggedIn === 'true') {
  //     localStorage.removeItem('isLoggedIn');
  //     navigate('/');
  //   }
  // }, [navigate]);

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
        // Dispatch the login action with token and username from the response
        dispatch(userlogin({
          token: data.Token,
          username: userdetails.username,
          password : userdetails.password,

        }));
        // Navigate to Hotel Dashboard page
        navigate('/Hotel_dashboard');
      } else {
        dispatch(logout());
      }
  
      if (data.Status === false) {
        setshowerr(true);
        localStorage.removeItem('isLoggedIn');
      }
    } catch (err) {
      console.log(err);
    }
  };

  const togglePass = (id) => {
    const passwordInput = document.getElementById(id);
    passwordInput.type = passwordInput.type === 'password' ? 'text' : 'password';
};
  

  return (
    <div>
      <Layout>
        {/* Apply dynamic class for background color based on the theme */}
        <div className={`login-container ${isDarkTheme ? 'dark' : 'light'}`}>

          <div className="card-container">
            {
              showerr ? (
                <>
                  <div className="showerr">
                    <div>
                      <strong className='text-danger'>Error</strong> <span>Invalid Credentials</span>
                    </div>
                    <button onClick={() => setshowerr(false)}>ok</button>
                  </div>
                </>
              ) : ''}

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
                      <div className="mb-3" style={{position:'relative'}}>
                        <label htmlFor="password" className="form-label">Password</label>
                        <input
                          type="password"
                          className="form-control"
                          value={userdetails.password}
                          onChange={onchangetext}
                          name="password"
                          id="password"
                        />
                        <i class="fa-solid fa-eye" style={{position: 'absolute', top:'40px', right:'10px'}} onClick={() => {togglePass('password')}}></i>

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
        </div>
      </Layout>
    </div>
  );
};

export default LoginForm;
