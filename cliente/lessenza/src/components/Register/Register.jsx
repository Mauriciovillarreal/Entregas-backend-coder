import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Register.css';

const Register = () => {
    const [form, setForm] = useState({
        first_name: '',
        last_name: '',
        email: '',
        age: '',
        password: ''
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8080/api/sessions/register', form);
            if (response.status === 200) {
                // Mostrar la notificación de éxito
                toast.success('Registro exitoso, redirigiendo a página login...', {
                    position: "bottom-left",
                    autoClose: 4000, // Tiempo que dura el toast (2 segundos)
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    style: {
                        backgroundColor: "black",
                        color: "white",
                        borderRadius: "0px"
                    },
                });

                // Esperar 2 segundos antes de redirigir
                setTimeout(() => {
                    navigate('/login');
                }, 5000); // 2 segundos
            } else {
                setError(response.data.message || 'Registration failed');
            }
        } catch (err) {
            setError('Registration failed');
        }
    };

    return (
        <main className="mainLogin">
            <div className="bg">
                <div className="login">
                    <form onSubmit={handleSubmit}>
                        <p>Crear cuenta</p>
                        <label className="uperCase">Name</label>
                        <input
                            type="text"
                            name="first_name"
                            className="control"
                            value={form.first_name}
                            onChange={handleChange}
                        />
                        <label className="uperCase">Last name</label>
                        <input
                            type="text"
                            name="last_name"
                            className="control"
                            value={form.last_name}
                            onChange={handleChange}
                        />
                        <label className="uperCase">Email</label>
                        <input
                            type="email"
                            name="email"
                            className="control"
                            value={form.email}
                            onChange={handleChange}
                        />
                        <label className="uperCase">Age</label>
                        <input
                            type="number"
                            name="age"
                            className="control"
                            value={form.age}
                            onChange={handleChange}
                        />
                        <label className="uperCase">Password</label>
                        <input
                            type="password"
                            name="password"
                            className="control"
                            value={form.password}
                            onChange={handleChange}
                        />
                        <span>
                            <p>¿Ya tenés una cuenta? <Link to="/login">Iniciar sesión</Link></p>
                        </span>
                        <hr />
                        <button type="submit" className="btnLogin">REGISTER</button>
                        {error && <p className="error">{error}</p>}
                    </form>
                </div>
            </div>
            <ToastContainer />
        </main>
    );
};

export default Register;
