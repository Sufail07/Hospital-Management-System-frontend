import React, { useEffect } from 'react'
import { Link, useNavigate } from 'react-router'

function PatientNavbar() {
  const navigate = useNavigate();
  
  const handleLogout = () => {
    const confirm = window.confirm('Are you sure you want to log out?')
    if (confirm) {
      localStorage.removeItem('access')
      localStorage.removeItem('refresh')
      localStorage.removeItem('role')
      localStorage.removeItem('username')
  
      navigate('/', {replace: true});
      window.location.reload();
    }

  };

  return (
    <div className="bg-light border-end vh-100 p-3" style={{ width: '250px' }}>
      <h5 className="mb-4">Patient Menu</h5>
      <ul className="nav flex-column">
        <li className="nav-item mb-2">
          <Link to="/patient/dashboard" className="nav-link">Dashboard</Link>
        </li>
        <li className="nav-item mb-2">
          <Link to="/patient/appointments" className="nav-link">Appointments</Link>
        </li>
        <li className="nav-item mb-2">
          <Link to="/patient/history" className="nav-link">Medical History</Link>
        </li>
        <li className="nav-item mb-2">
          <Link to="/patient/prescriptions" className="nav-link">Prescriptions</Link>
        </li>
        <li className="nav-item mb-2">
          <Link to="/patient/payments" className="nav-link">Payment History</Link>
        </li>
        <li className="nav-item mt-4">
          <button onClick={handleLogout} className="btn btn-outline-danger w-100">Logout</button>
        </li>
      </ul>
    </div>
  )
}

export default PatientNavbar;

