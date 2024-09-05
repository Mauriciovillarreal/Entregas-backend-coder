// src/components/UserInfoWidget/UserInfoWidget.js
import React from 'react';
import { RealTimeProductsWidget } from '../RealTimeProductsWidget/RealTimeProductsWidget';
import { Link } from 'react-router-dom';
import './UserInfoWidget.css'
import { AdminUserManagementWidget } from '../AdminUserManagementWdiget/AdminUserManagementWidget';

const UserInfoWidget = ({ user, handleLogout }) => {
    return (
        <div className="containerUser">
            <div className='userInfo'>
                <h5>{user.first_name}</h5>
                <Link to="/profil">Mi perfil ► </Link>
                <div className="role">
                    <h3>{user.role}</h3>

                </div>
            </div>
            <div className='containerBtn'>
                {user.role === 'premium' && <RealTimeProductsWidget />}
                {user.role === 'admin' && <RealTimeProductsWidget />}
                {user.role === 'admin' && <AdminUserManagementWidget />}
                <hr />
                <button className='btnUser' onClick={handleLogout}>Salir</button>
            </div>
        </div>
    );
};

export default UserInfoWidget;
