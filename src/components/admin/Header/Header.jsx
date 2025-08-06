import React, { useState } from 'react';
import { BsFillBellFill, BsFillEnvelopeFill, BsPersonCircle, BsSearch, BsJustify, BsChevronDown } from 'react-icons/bs';
import './Header.css';

function Header({ OpenSidebar }) {
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <header className='header'>
      <div className='menu-icon'>
        <BsJustify className='icon' onClick={OpenSidebar} />
      </div>
      <div className='header-item-container'> 
          <div className='header-left'>
            <BsSearch className='icon' />
            <input 
              type="text" 
              placeholder="Search..." 
              className="search-input"
            />
          </div>
          <div className='header-right'>
              <div className="icon-container">
                <BsFillBellFill className='icon' />
                <span className="notification-badge">3</span>
              </div>
              <div className="icon-container">
                <BsFillEnvelopeFill className='icon' />
                <span className="notification-badge">5</span>
              </div>
              <div 
                className="profile-container"
                onClick={() => setShowDropdown(!showDropdown)}
              >
                <BsPersonCircle className='icon profile-icon' />
                <span className="profile-name">Admin</span>
                <BsChevronDown className={`dropdown-icon ${showDropdown ? 'rotate' : ''}`} />
                  <div className={`dropdown-menu ${showDropdown ? 'show' : ''}`}>
                    <div className="dropdown-item">Profile</div>
                    <div className="dropdown-item">Settings</div>
                    <div className="dropdown-item">Logout</div>
                  </div>
              </div>
          </div>
      </div>
   
    </header>
  );
}

export default Header;