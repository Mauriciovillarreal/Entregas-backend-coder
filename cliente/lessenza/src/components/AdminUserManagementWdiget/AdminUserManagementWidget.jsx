import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../AuthContext/AuthContext';

export const AdminUserManagementWidget = () => {
    const { user } = useContext(AuthContext); // Extraemos el usuario autenticado del contexto

    return (
        <div>
        
            {user && user.role === 'admin' && (
                <Link to={`/admin/users/${user._id}`}>
                    <button className="realTime">
                        Gestionar usuarios
                    </button>
                </Link>
            )}
        </div>
    );
};
