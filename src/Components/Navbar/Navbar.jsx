import React, { useState, useEffect } from 'react';
import './Navbar.css';
import { useDispatch, useSelector } from 'react-redux';
import { dark, white } from '../../Features/Themeslice';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
    const loggedin = useSelector((state) => state.loggedin.isLoggedIn);
    console.log(loggedin);

    const navigate = useNavigate();

    const bgcolor = useSelector((state) => state.theme.navbar);
    const textcolor = useSelector((state) => state.theme.textcolor);

    const dispatch = useDispatch()

    const toggleTheme = () => {
        if (bgcolor == 'black') {
            dispatch(white());
            localStorage.removeItem('theme');
            setChangeicon(false)
        }
        else {
            dispatch(dark())
            setChangeicon(true)
        }
    };
    return (
        <div>
            <header>
                <div className='navbar' style={{ backgroundColor: bgcolor, color: textcolor }}>
                    <div className="leftnavbar">
                        <a href="" className='ml-4'>Banana-Leaf</a>
                    </div>
                    <>
                        <div className="rightnavbar">
                            <i className="fa-solid fa-bell"></i>
                            <i className="fa-solid fa-moon" onClick={toggleTheme} style={{ cursor: 'pointer' }}></i>
                            <i className="fa-solid fa-user" style={{ cursor: 'pointer' }} onClick={() => navigate('/Userprofile', {
                            })}></i>
                        </div>
                    </>
                </div>
            </header>
        </div>
    );
};

export default Navbar;
