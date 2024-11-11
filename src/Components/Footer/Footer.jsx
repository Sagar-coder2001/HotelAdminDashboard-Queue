import React, { useEffect, useState } from 'react'
import './Footer.css'

const Footer = () => {
  const [isDarkTheme, setIsDarkTheme] = useState(false);

  useEffect(() => {
    // Check theme on component mount
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme) {
        setIsDarkTheme(storedTheme === 'dark');
    } else {
        setIsDarkTheme(false); // Default theme
    }
}, []);


  return (
    <div>
      <div className={`footer-container ${isDarkTheme ? 'dark-footer' : 'light-footer'}`}>
        Copy & Coyright 2024
      </div>
    </div>
  )
}

export default Footer
