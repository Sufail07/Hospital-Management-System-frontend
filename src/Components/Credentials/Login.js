import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const Login = () => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await axios.post('https://sufail07.pythonanywhere.com/api/token/', formData);
      const {access, refresh, username, role, is_active} = response.data;
      localStorage.setItem('access', access);
      localStorage.setItem('refresh', refresh);
      localStorage.setItem('role', role);
      localStorage.setItem('username', username);
      setIsLoading(false);
      
      if (role === 'admin') navigate('/admin/dashboard');
      else if (role === 'patient' && is_active) navigate('/patient/dashboard');
      else if(role === 'doctor' && is_active) navigate('/doctor/dashboard');
    } catch(err) {
      toast.error("Invalid credentials", {
        position: 'top-center',
        theme: 'colored'
      });
      setIsLoading(false);
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 'var(--space-4)',
      background: 'var(--color-gray-50)'
    }}>
      <div style={{ width: '100%', maxWidth: '420px' }}>
        {/* Logo/Brand */}
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-8)' }}>
          <div style={{
            width: '60px',
            height: '60px',
            background: 'var(--color-primary)',
            borderRadius: 'var(--radius-xl)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto var(--space-4)',
            boxShadow: 'var(--shadow-lg)'
          }}>
            <svg width="32" height="32" fill="none" stroke="white" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </div>
          <h1 style={{ 
            fontSize: 'var(--text-3xl)', 
            fontWeight: 'var(--font-bold)',
            color: 'var(--color-gray-900)',
            marginBottom: 'var(--space-2)'
          }}>
            HMS
          </h1>
          <p style={{ color: 'var(--color-gray-600)', fontSize: 'var(--text-sm)', margin: 0 }}>
            Hospital Management System
          </p>
        </div>

        {/* Login Card */}
        <div className="card">
          <div className="card-body">
            <h2 style={{ 
              fontSize: 'var(--text-2xl)',
              fontWeight: 'var(--font-semibold)',
              marginBottom: 'var(--space-2)',
              color: 'var(--color-gray-900)'
            }}>
              Welcome back
            </h2>
            <p style={{ 
              color: 'var(--color-gray-600)',
              marginBottom: 'var(--space-6)',
              fontSize: 'var(--text-sm)'
            }}>
              Sign in to continue to your dashboard
            </p>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Username</label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Enter username"
                  required
                  autoComplete="username"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Enter password"
                  required
                  autoComplete="current-password"
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary btn-block"
                disabled={isLoading}
                style={{ marginTop: 'var(--space-2)' }}
              >
                {isLoading ? (
                  <>
                    <span className="spinner"></span>
                    Signing in...
                  </>
                ) : (
                  'Sign in'
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Registration Links */}
        <div style={{ 
          marginTop: 'var(--space-6)',
          textAlign: 'center',
          padding: 'var(--space-4)',
          background: 'white',
          borderRadius: 'var(--radius-xl)',
          border: '1px solid var(--color-gray-200)'
        }}>
          <p style={{ 
            fontSize: 'var(--text-sm)',
            color: 'var(--color-gray-600)',
            marginBottom: 'var(--space-3)'
          }}>
            Don't have an account?
          </p>
          <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
            <a 
              href="/PatientRegistration" 
              className="btn btn-outline-primary"
              style={{ flex: 1 }}
            >
              Patient
            </a>
            <a 
              href="/DoctorRegistration" 
              className="btn btn-outline-primary"
              style={{ flex: 1 }}
            >
              Doctor
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
