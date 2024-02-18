import React from 'react'
import { useState, useEffect } from 'react';
import { NavLink, useLocation} from 'react-router-dom'
import logo1 from '../logo/logo1.png';
import Navbar from 'react-bootstrap/Navbar';
import './Navbar.css'

function NavBar(){
    const location = useLocation();
    const { pathname } = location;
    const splitLocation = pathname.split("/");

    useEffect(() => {

    }, [location])
    return(
        <Navbar className='nav'>
            <Navbar.Brand className='brand'>
        <img
          src={logo1}
          alt='SwampStream Logo' // Provide an alt attribute for accessibility
          className='brand-logo'
        />
       
      </Navbar.Brand>
            <NavLink className={splitLocation[1] === "home" ? "active" : ""} to="/"> HOME </NavLink>
            <NavLink className={splitLocation[1].indexOf("watching") != -1 ? "active" : ""} to="/watching">WATCHING</NavLink>
            <NavLink className={splitLocation[1] === "notes" ? "active" : ""} to="/notes">NOTES</NavLink>
            <NavLink className={splitLocation[1] === "saved" ? "active" : ""} to="/saved">SAVED VIDEOS</NavLink>
            <NavLink className={splitLocation[1] === "profile" ? "active" : ""} to="/profile">PROFILE</NavLink>
        </Navbar>
    )

}

export default NavBar