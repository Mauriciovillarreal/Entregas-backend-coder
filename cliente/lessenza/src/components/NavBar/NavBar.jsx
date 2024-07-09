import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../AuthContext/AuthContext';
import LoginWidget from "../LoginWidget/LoginWidget";
import "./NavBar.css";
import { CartWidget } from '../CartWidget/CartWidget';
import { ChatWidget } from '../ChatWidget/ChatWidget';
import { RealTimeProductsWidget } from '../RealTimeProductsWidget/RealTimeProductsWidget';

export const NavBar = () => {
  const { user, logout } = useContext(AuthContext);
  const [isOffcanvasOpen, setIsOffcanvasOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      window.location.href = '/login';
    } catch (error) {
      console.error('Error al cerrar sesión:', error.message);
    }
  };

  const toggleOffcanvas = () => {
    setIsOffcanvasOpen(!isOffcanvasOpen);
  };

  const closeOffcanvas = () => {
    setIsOffcanvasOpen(false);
  };

  return (
    <header>
      <div>
        <h1><Link to="/">L'ESSENZA</Link></h1>
      </div>
      {user && user.role !== 'admin' && <ChatWidget />}
      <div className='loginWidget'>
        {user ? (
          <>
            <button className="toggle-button" onClick={toggleOffcanvas}>
              <img src="../img/user.png" alt="" />
            </button>
            <CartWidget />
            <div className={`offcanvas-nav ${isOffcanvasOpen ? 'open' : ''}`}>
              <button className="close-button" style={{ width: '10px' }} onClick={closeOffcanvas}>
                <img src="../img/cerrar-cruz.png" alt="" />
              </button>
              <div className='userInfo'>
                <h5>{user.first_name} {user.last_name}</h5>
                <h6>Email: {user.email}</h6>
                <h6>Role: {user.role}</h6>
              </div>
              <div className='containerBtn'>
              
                {user.role === 'admin' && <RealTimeProductsWidget />}
            
              <button  className='btnUser' onClick={handleLogout}>Cerrar sesión</button>
            </div>
          </div>
      </>
      ) : (
      <LoginWidget />
        )}
    </div>
    </header >
  );
};

export default NavBar;
