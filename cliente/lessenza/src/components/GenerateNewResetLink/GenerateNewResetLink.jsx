// GenerateNewResetLink.jsx
import React, { useState } from 'react';
import './GenerateNewResetLink.css';

const GenerateNewResetLink = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setMessage('');

    try {
      const response = await fetch('http://localhost:8080/api/sessions/generate-new-reset-link', {
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
      setError('Error sending new password reset email');
    }
  };

  return (
    <div className="generate-new-reset-link">
      <form onSubmit={handleSubmit}>
        <p>Generate New Reset Link</p>
        <label className="uperCase">Email</label>
        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="control"
        />
        <button type="submit" className="btnGenerateNewResetLink">ENVIAR NUEVO LINK</button>
        {message && <p className="message">{message}</p>}
        {error && <p className="error">{error}</p>}
      </form>
    </div>
  );
};

export default GenerateNewResetLink;
