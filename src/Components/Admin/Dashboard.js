import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';
import AdminNavbar from './Navbar';
import axiosInstance from '../axiosInstance';

function AdminDashboard() {
  const [adminName, setAdminName] = useState('');
  const [stats, setStats] = useState({
    totalPatients: 0,
    totalDoctors: 0,
    totalAppointments: 0,
    pendingAppointments: 0
  });

  useEffect(() => {
    const fetchAdmin = async () => {
      const token = localStorage.getItem('access');
      try {
        const response = await axiosInstance.get('https://sufail07.pythonanywhere.com/api/admin/me/', {
          headers: {
            Authorization: `Bearer ${token}`
          },
        });
        const user = response.data;
        setAdminName(user.user.username);
      } catch (error) {
        console.error('Failed to fetch admin', error);
        toast.error('Failed to fetch admin data', {
          position: 'top-center',
          theme: 'colored'
        });
      }
    };

    const fetchDashboardStats = async () => {
      const token = localStorage.getItem('access');
      try {
        const response = await axiosInstance.get('https://sufail07.pythonanywhere.com/api/admin/dashboard/stats/', {
          headers: {
            Authorization: `Bearer ${token}`
          },
        });
        setStats(response.data);
      } catch (error) {
        console.error('Failed to fetch dashboard stats', error);
        toast.error('Failed to fetch dashboard statistics', {
          position: 'top-center',
          theme: 'colored'
        });
      }
    };

    fetchAdmin();
    fetchDashboardStats();
  }, []);

  return (
    <div className="container-fluid">
      <div className="row">
        {/* Sidebar */}
        <div className="col-auto px-0 bg-light border-end" style={{ width: '220px', minHeight: '100vh' }}>
          <AdminNavbar />
        </div>

        {/* Main content */}
        <div className="col ps-md-4 pe-4 pt-4">
          <h3>Hello, {adminName}!</h3>
          <p>Welcome to your admin dashboard. Manage the system from here.</p>

          {/* Dashboard Statistics */}
          <div className="row mt-4">
            <div className="col-md-4 mb-3">
              <div className="card bg-primary text-white">
                <div className="card-body">
                  <h5 className="card-title">Total Patients</h5>
                  <h2 className="card-text">{stats.totalPatients}</h2>
                </div>
              </div>
            </div>

            <div className="col-md-4 mb-3">
              <div className="card bg-success text-white">
                <div className="card-body">
                  <h5 className="card-title">Total Doctors</h5>
                  <h2 className="card-text">{stats.totalDoctors}</h2>
                </div>
              </div>
            </div>

            <div className="col-md-4 mb-3">
              <div className="card bg-info text-white">
                <div className="card-body">
                  <h5 className="card-title">Total Appointments</h5>
                  <h2 className="card-text">{stats.totalAppointments}</h2>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>  
    </div>
  );
}

export default AdminDashboard;
