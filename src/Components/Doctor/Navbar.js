import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

function DoctorNavbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    const confirmLogout = window.confirm('Are you sure you want to log out?');
    if (confirmLogout) {
      localStorage.removeItem('access');
      localStorage.removeItem('refresh');
      localStorage.removeItem('role');
      localStorage.removeItem('username');

      navigate('/', { replace: true });
      window.location.reload();
    }
  };

  return (
    <div className="bg-light border-end vh-100 p-3" style={{ width: '250px' }}>
      <h5 className="mb-4">Doctor Menu</h5>
      <ul className="nav flex-column">
      <li className="nav-item mb-2">
          <Link to="/doctor/dashboard" className="nav-link">Dashboard</Link>
        </li>
        <li className="nav-item mb-2">
          <Link to="/doctor/appointments" className="nav-link">Appointments</Link>
        </li>
        <li className="nav-item mb-2">
          <Link to="/doctor/patients" className="nav-link">View Patients</Link>
        </li>
        <li className="nav-item mt-4">
          <button onClick={handleLogout} className="btn btn-outline-danger w-100">Logout</button>
        </li>
      </ul>
    </div>
  );
}

export default DoctorNavbar;
