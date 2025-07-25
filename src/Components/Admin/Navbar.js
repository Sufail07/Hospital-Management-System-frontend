import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

function AdminNavbar() {
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
    <div className="bg-light border-end vh-100 p-3 h-100" style={{ width: '220px', minHeight: '100vh' }}>
      <h5 className="mb-4">Admin Menu</h5>
      <ul className="nav flex-column">
      <li className="nav-item mb-2">
          <Link to="/admin/dashboard" className="nav-link">Dashboard</Link>
        </li>
        <li className="nav-item mb-2">
          <Link to="/admin/users" className="nav-link">Manage Users</Link>
        </li>
        <li className="nav-item mb-2">
          <Link to="/admin/appointments" className="nav-link">Manage Appointments</Link>
        </li>
        <li className="nav-item mt-4">
          <button onClick={handleLogout} className="btn btn-outline-danger w-100">Logout</button>
        </li>
      </ul>
    </div>
  );
}

export default AdminNavbar;
