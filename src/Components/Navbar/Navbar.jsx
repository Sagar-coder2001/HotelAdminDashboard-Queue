import React, { useState, useEffect } from 'react';
import './Navbar.css';
import { useSelector } from 'react-redux';

const Navbar = () => {
    // State to track if the theme is dark
    const [isDarkTheme, setIsDarkTheme] = useState(false);

    const loggedin = useSelector((state) => state.loggedin.isLoggedIn);
    console.log(loggedin);

    // Initialize theme from localStorage on component mount
    useEffect(() => {
        const storedTheme = localStorage.getItem('theme');
        if (storedTheme) {
            setIsDarkTheme(storedTheme === 'dark');
        } else {
            // Default theme if not set in localStorage
            setIsDarkTheme(false); // light theme by default
        }
    }, []);

    const toggleTheme = () => {
        const newTheme = !isDarkTheme ? 'dark' : 'light';
        setIsDarkTheme(!isDarkTheme);

        localStorage.setItem('theme', newTheme);

        document.body.setAttribute('data-theme', newTheme);
    };

    useEffect(() => {
        const theme = isDarkTheme ? 'dark' : '#aed3d0';
        document.body.setAttribute('data-theme', theme); 
    }, [isDarkTheme]);

    return (
        <div>
            <header>
                <div className={`navbar ${isDarkTheme ? 'dark' : '#aed3d0'}`}>
                    <div className="leftnavbar">
                        <a href="" className='ml-4'>Company Name</a>
                    </div>
                    {
                        loggedin && (
                            <>
                                {/* <div className="middlenavbar">
                                    <form className="d-flex" role="search">
                                        <input className="form-control me-2" type="search" placeholder="Search" aria-label="Search" />
                                        <button className="btn btn-outline-success" type="submit">Search</button>
                                    </form>
                                </div> */}
                                <div className="rightnavbar">
                                    <i className="fa-solid fa-bell"></i>
                                    <i className="fa-solid fa-moon" onClick={toggleTheme} style={{ cursor: 'pointer' }}></i>
                                    <i className="fa-solid fa-user"></i>
                                </div>
                            </>
                        )
                    }
                </div>
            </header>
        </div>
    );
};

export default Navbar;
