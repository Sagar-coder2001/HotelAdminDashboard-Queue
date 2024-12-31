import React, { useState } from 'react'
import Layout from '../../Components/Layout/Layout'
import Admindashboard from '../Dashboard/Admindashboard'
import { useDispatch, useSelector } from 'react-redux';
const UserProfile = () => {
    const { isLoggedIn, token, username, password } = useSelector((state) => state.loggedin);

    const [confirmpass, setconfirmpass] = useState();

    const submitDetails = async (e) => {
        e.preventDefault();
        try {
            const formdata = new FormData();
            formdata.append('username', userdetails.username);
            formdata.append('password', userdetails.password);
            formdata.append('confirmpass', confirmpass)
            const response = await fetch(`http://192.168.1.25/Queue/login.php?do=login&hotel_id=${filepath}`, {
                method: 'POST',
                body: formdata,
            });
            const data = await response.json();
            console.log(data);

            if (data.Status === true) {
                dispatch(userlogin({
                    token: data.Token,
                    username: userdetails.username,
                    password: userdetails.password,

                }));
            }
        } catch (err) {
            console.log(err);
        }
    };

    const togglePass = (id) => {
        const passwordInput = document.getElementById(id);
        passwordInput.type = passwordInput.type === 'password' ? 'text' : 'password';
    };

    const toggleconfPass = (id) => {
        const passwordInput = document.getElementById(id);
        passwordInput.type = passwordInput.type === 'confirm' ? 'text' : 'password';
    }
    
    return (
        <div>
            <Layout>
                <Admindashboard />
                <div className={`login-container`}>

                    <div className="card-container">
                        {/* {
                            showerr ? (
                                <>
                                    <div className="showerr">
                                        <div>
                                            <strong className='text-danger'>Error</strong> <span>Invalid Credentials</span>
                                        </div>
                                        <button onClick={() => setshowerr(false)}>ok</button>
                                    </div>
                                </>
                            ) : ''} */}

                        <form>
                            <h4 className="text-center fs-2">Update Profile</h4>
                            <div className="mb-3">
                                <label htmlFor="username" className="form-label">Username</label>
                                <input
                                    type="email"
                                    className="form-control"
                                    value={username}
                                    // onChange={onchangetext}
                                    id="username"
                                    name="username"
                                />
                            </div>
                                <div className="mb-3" style={{position:'relative'}}  >
                                <label htmlFor="password" className="form-label">Password</label>
                                <input
                                    type="password"
                                    className="form-control"
                                    value={password}
                                    // onChange={onchangetext}
                                    name="password"
                                    id="password"
                                />
                                <i class="fa-solid fa-eye" style={{position: 'absolute', top:'40px', right:'10px'}} onClick={() => {togglePass('password')}}></i>

                            </div>
                            <div className="mb-3" style={{position:'relative'}}>
                                <label htmlFor="password" className="form-label">Reset Password</label>
                                <input
                                    type="password"
                                    className="form-control"
                                    value={confirmpass}
                                    onChange={(e) => setconfirmpass(e.target.value)}
                                    name="confirmpass"
                                    id="confirmpass"
                                />
                                <i class="fa-solid fa-eye" style={{position: 'absolute', top:'40px', right:'10px'}} onClick={() => {toggleconfPass('confirmpass')}}></i>
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
    )
}

export default UserProfile
