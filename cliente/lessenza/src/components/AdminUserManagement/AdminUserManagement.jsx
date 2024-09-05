import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../AuthContext/AuthContext';
import axiosInstance from '../../AxiosInstance/AxiosInstance';
import { Container } from 'react-bootstrap';

const AdminUserManagement = () => {
    const { user, loading } = useContext(AuthContext); // Obtener el usuario autenticado y el estado de carga
    const [users, setUsers] = useState([]); // Inicializar como un array vacío
    const [selectedUser, setSelectedUser] = useState(null); // Usuario seleccionado para edición
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        console.log("Usuario desde AuthContext:", user); // Debug: Verificar el valor de user

        if (!loading) {
            if (!user || user.role !== 'admin') {
                // Si no es admin, redirigir al inicio o a una página de error
                alert('No tienes permisos para acceder a esta página.');
                navigate('/');
            } else {
                // Si el usuario es admin, cargar la lista de usuarios
                fetchUsers();
            }
        }
    }, [loading, user]);

    // Función para obtener todos los usuarios
    const fetchUsers = async () => {
        try {
            const response = await axiosInstance.get('/api/users');
            
            // Verifica que la estructura de la respuesta es correcta
            console.log("Respuesta completa de la API:", response);
    
            if (response.data && response.data.data) {
                console.log("Usuarios obtenidos desde la API:", response.data.data); // Debug: Verificar los datos de usuarios
                setUsers(response.data.data);
            } else {
                console.error("La estructura de la respuesta no es la esperada:", response.data);
                setUsers([]); // Si no hay usuarios, definir como array vacío
            }
        } catch (err) {
            console.error("Error al obtener usuarios:", err);
            setError('Error al cargar los usuarios.');
            setUsers([]); // Establecer como array vacío si ocurre un error
        }
    };
    

    // Función para seleccionar un usuario para editar o cambiar el rol
    const handleSelectUser = (user) => {
        setSelectedUser(user);
    };

    // Función para cambiar el rol del usuario seleccionado
    const handleRoleChange = async () => {
        if (!selectedUser) return;

        try {
            const response = await axiosInstance.post(`/api/users/premium/${selectedUser._id}`);
            alert('Rol del usuario actualizado.');
            setSelectedUser(response.data.data);
            fetchUsers(); // Refrescar la lista de usuarios después del cambio
        } catch (err) {
            alert('Error al actualizar el rol del usuario.');
        }
    };

    // Función para eliminar al usuario seleccionado
    const handleDeleteUser = async () => {
        if (!selectedUser) return;

        const confirmDelete = window.confirm(`¿Estás seguro de eliminar al usuario ${selectedUser.first_name}?`);
        if (confirmDelete) {
            try {
                await axiosInstance.delete(`/api/users/${selectedUser._id}`);
                alert('Usuario eliminado con éxito.');
                setSelectedUser(null); // Limpiar la selección
                fetchUsers(); // Refrescar la lista de usuarios después de la eliminación
            } catch (err) {
                alert('Error al eliminar el usuario.');
            }
        }
    };

    // Debug: Verificar el estado de users antes de renderizar la lista
    console.log("Estado de users en render:", users);

    if (loading) return <p>Cargando...</p>;
    if (error) return <p>{error}</p>;

    return (
        <Container>
            <h1>Gestión de Usuarios</h1>
            
            {/* Lista de Usuarios */}
            <div>
                <h2>Lista de Usuarios</h2>
                <ul>
                    {users.length > 0 ? (
                        users.map((user) => (
                            <li key={user._id}>
                                {user.first_name} {user.email}
                                <button onClick={() => handleSelectUser(user)}>Editar</button>
                            </li>
                        ))
                    ) : (
                        <p>No hay usuarios disponibles.</p>
                    )}
                </ul>
            </div>

            {/* Detalles del usuario seleccionado */}
            {selectedUser && (
                <div>
                    <h2>Detalles del Usuario</h2>
                    <p>Nombre: {selectedUser.first_name}</p>
                    <p>Email: {selectedUser.email}</p>
                    <p>Rol actual: {selectedUser.role}</p>

                    <button onClick={handleRoleChange}>
                        {selectedUser.role === 'user' ? 'Cambiar a Premium' : 'Cambiar a Usuario'}
                    </button>
                    <button onClick={handleDeleteUser} style={{ marginLeft: '10px', color: 'red' }}>
                        Eliminar Usuario
                    </button>
                </div>
            )}
        </Container>
    );
};

export default AdminUserManagement;
