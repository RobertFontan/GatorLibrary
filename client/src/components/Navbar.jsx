import React from 'react';
import { NavLink, useLocation, Link, useNavigate } from 'react-router-dom';
import Navbar from 'react-bootstrap/Navbar';
import { useSession } from '../components/SessionContext'
import supabase from '../config/supabaseClient';
import logo1 from '../logo/logo1.png';
import './Navbar.css';

function NavBar() {
  const location = useLocation();
  const { pathname } = location;
  const splitLocation = pathname.split("/");
  const session = useSession();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      console.log('Session:', session);

      await supabase.auth.signOut();
      console.log('User signed out successfully');
      navigate('/'); 
    } catch (error) {
      console.error('Error signing out:', error.message);
    }
  };

  return (
    <Navbar className='nav'>
      <Navbar.Brand className='brand'>
        <img
          src={logo1}
          alt='SwampStream Logo' // Provide an alt attribute for accessibility
          className='brand-logo'
        />
      </Navbar.Brand>

      <NavLink className={splitLocation[1] === "home" ? "active" : ""} to="/home"> HOME </NavLink>
      <NavLink className={splitLocation[1].indexOf("watching") !== -1 ? "active" : ""} to="/watching">WATCHING</NavLink>
      <NavLink className={splitLocation[1] === "notes" ? "active" : ""} to="/notes">NOTES</NavLink>
      <NavLink className={splitLocation[1] === "saved" ? "active" : ""} to="/saved">SAVED VIDEOS</NavLink>
      <NavLink className={splitLocation[1] === "profile" ? "active" : ""} to="/profile">PROFILE</NavLink>


      {session && (
        <div className="sign-out-container">
          <button className="sign-out-button" onClick={handleSignOut}>
            <span className="button-text">Sign Out</span>
          </button>
        </div>
      )}
    </Navbar>
  );
}

export default NavBar;
