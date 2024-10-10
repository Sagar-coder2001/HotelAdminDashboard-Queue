import React from 'react'
import './Navbar.css';

const Navbar = () => {
 
    return (
        <div>
            <header>
                <div className="navbar">
                    <div className="leftnavbar">
                       <a href="" className='ml-4'>Company Name</a>
                    </div>
                    <div className="middlenavbar">
                        <form class="d-flex" role="search">
                            <input class="form-control me-2" type="search" placeholder="Search" aria-label="Search"/>
                            <button class="btn btn-outline-success" type="submit">Search</button>
                        </form>
                    </div>
                    <div className="rightnavbar">
                       <i class="fa-solid fa-bell"></i>
                       <i class="fa-solid fa-moon"></i>
                        <i class="fa-solid fa-user"></i>
                    </div>
                </div>
            </header>

        </div>
    )
}

export default Navbar
