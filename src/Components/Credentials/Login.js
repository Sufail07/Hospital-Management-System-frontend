import React, { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router';
import axios from 'axios';
import { toast } from 'react-toastify'
import axiosInstance from '../axiosInstance';

const BootstrapLoginBox = () => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setIsLoading(true);
    try {
      const response = await axios.post('https://sufail07.pythonanywhere.com/api/token/', formData);
      const {access, refresh, username, role, is_active} = response.data;
      localStorage.setItem('access', access);
      localStorage.setItem('refresh', refresh)
      localStorage.setItem('role', role)
      localStorage.setItem('username', username)
      console.log(response.data);
      setIsLoading(false);
      if (role === 'admin') navigate('/admin/dashboard');
      else if (role === 'patient' && is_active) navigate('/patient/dashboard');
      else if(role === 'doctor' && is_active)navigate('/doctor/dashboard')
    } catch(err) {
      console.log(err)
      toast.error("Invalid credentials", {
          position: 'top-center',
          theme: 'colored'
        })
      setIsLoading(false);
      }
  };

  return (
    <div className="d-flex align-items-center justify-content-center min-vh-100 bg-light p-3">
      <div className="card shadow-lg border-0 rounded-3" style={{ maxWidth: '420px', width: '100%' }}>
        <div className="card-body p-4">
          {/* Header */}
          <div className="text-center mb-4">
            <div className="bg-dark rounded-3 d-flex align-items-center justify-content-center mx-auto mb-3" style={{ width: '50px', height: '50px' }}>
              <svg className="text-white" width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h2 className="h4 fw-semibold text-dark mb-1">Welcome back</h2>
            <p className="text-muted">Please sign in to your account</p>
          </div>

          {/* Message */}
          {message && (
            <div className="alert alert-success text-center small" role="alert">
              {message}
            </div>
          )}

          {/* Form */}
          <form className="mb-3" onSubmit={handleSubmit}>
            {/* Username */}
            <div className="mb-3">
              <label className="form-label">Username</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="form-control"
                placeholder="Enter your username"
                required
                autoComplete="off"
              />
            </div>

            {/* Password */}
            <div className="mb-3">
              <label className="form-label">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="form-control"
                placeholder="Enter your password"
                required
                autoComplete="off"
              />
            </div>

            {/* Login Button */}
            <button
              type="submit"
              className="btn btn-dark w-100"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="d-flex align-items-center justify-content-center">
                  <div className="spinner-border spinner-border-sm me-2" role="status"></div>
                  Signing in...
                </div>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Registration Links */}
          <div className="text-center mt-4">
            <p className="text-muted small mb-2">Don't have an account?</p>
            <div className="d-grid gap-2">
              <a href="/PatientRegistration" className="btn btn-outline-secondary btn-sm">
                Register as Patient
              </a>
              <a href="/DoctorRegistration" className="btn btn-outline-secondary btn-sm">
                Register as Doctor
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BootstrapLoginBox;
