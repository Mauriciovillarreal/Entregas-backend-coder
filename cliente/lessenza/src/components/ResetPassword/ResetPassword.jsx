import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import './ResetPassword.css';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error('Passwords do not match', {
        position: "bottom-left",
        style: {
          backgroundColor: "black",
          color: "white",
          borderRadius: "0px"
        },
        progressClassName: 'toastify__progress-bar',
        icon: () => (
          <svg viewBox="0 0 24 24" width="24" height="24" fill="white">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/>
          </svg>
        )
      });
      return;
    }

    try {
      const response = await axios.post('http://localhost:8080/api/sessions/reset-password', { token, newPassword: password });
      toast.success(response.data.message, {
        position: "bottom-left",
        style: {
          backgroundColor: "black",
          color: "white",
          borderRadius: "0px"
        },
        progressClassName: 'toastify__progress-bar',
        icon: () => (
          <svg viewBox="0 0 24 24" width="24" height="24" fill="white">
            <path d="M9 16.2l-3.5-3.5 1.4-1.4L9 13.4l7.1-7.1 1.4 1.4L9 16.2z" />
          </svg>
        )
      });

      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error resetting password', {
        position: "bottom-left",
        style: {
          backgroundColor: "black",
          color: "white",
          borderRadius: "0px"
        },
        progressClassName: 'toastify__progress-bar',
        icon: () => (
          <svg viewBox="0 0 24 24" width="24" height="24" fill="white">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/>
          </svg>
        )
      });
    }
  };

  return (
    <div className="reset-password-container">
      <p>Reiniciar Password</p>
      <form onSubmit={handleResetPassword}>
        <div>
          <label>New Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <div>
          <label>Confirm New Password</label>
          <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
        </div>
        <button type="submit">ENVIAR</button>
      </form>
    </div>
  );
};

export default ResetPassword;
