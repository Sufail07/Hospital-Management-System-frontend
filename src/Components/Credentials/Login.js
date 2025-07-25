import React, { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router';
import axios from 'axios';
import { toast } from 'react-toastify'
import axiosInstance from '../axiosInstance';

function Login() {
    const [formData, setFormData] = useState({})
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    }

    const handleSubmit = async(e) => {
        e.preventDefault();
        try {
            const response = await axiosInstance.post('https://sufail07.pythonanywhere.com/api/token/', formData);
            const {access, refresh, role, username, is_active} = response.data;
            localStorage.setItem('access', access);
            localStorage.setItem('refresh', refresh)
            localStorage.setItem('role', role)
            localStorage.setItem('username', username)
            console.log(response.data);
            if (role === 'admin') navigate('/admin/dashboard');
            else if (role === 'patient' && is_active) navigate('/patient/dashboard');
            else if(role == 'doctor' && is_active)navigate('/doctor/dashboard')
        } catch (err) {
            console.log(err)
            toast.error("Invalid credentials", {
                position: 'top-center',
                theme: 'colored'
              })
        }
    }

  return (
    <>
    <div className="container mt-5" style={{ maxWidth: '500px' }}>
      <h2 className="mb-4">Login</h2>
      {message && <div className="alert alert-info">{message}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>Username</label>
          <input type="text" name="username" onChange={handleChange} className="form-control" required autoComplete='off'/>
        </div>
        <div className="mb-3">
          <label>Password</label>
          <input type="password" name="password" onChange={handleChange} className="form-control" required autoComplete='off' />
        </div>
        <button type="submit" className="btn btn-primary w-100">Login</button>
      </form>
      <div className="mt-3 text-center">
      <p>Don't have an account? <Link to="/PatientRegistration">Register Patient here</Link><br></br>
        <Link to='DoctorRegistration/'>Register Doctor here</Link>
      </p>
    </div>
    </div>
    </>
  )
}

export default Login
