// ForgotPassword.jsx
import React, { useState } from 'react';
import './ForgotPassword.css';
import { Link } from 'react-router-dom';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError('');
        setMessage('');

        try {
            const response = await fetch('http://localhost:8080/api/sessions/forgot-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (response.ok) {
                setMessage(data.message);
            } else {
                setError(data.message);
            }
        } catch (error) {
            setError('Error sending password reset email');
        }
    };

    return (
        <div className="forgot-password">
            <form onSubmit={handleSubmit}>
                <p>Has olvidado tu contraseña</p>
                <label className="uperCase">Email</label>
                <input
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    className="control"
                />
                <p>¿Caducó su enlace de reinicio? <Link to="/generate-new-reset-link">Generar un nuevo link</Link></p>
                <button type="submit" className="btnForgotPassword">ENVIAR</button>
                {message && <p className="message">{message}</p>}
                {error && <p className="error">{error}</p>}
            </form>
        </div>
    );
};

export default ForgotPassword;
