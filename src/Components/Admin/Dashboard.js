import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify';
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
    <div className="d-flex" style={{ minHeight: '100vh' }}>
      {/* Sidebar */}
      <div style={{ width: '260px', flexShrink: 0 }}>
        <AdminNavbar />
      </div>

      {/* Main Content */}
      <div className="flex-grow-1" style={{ padding: 'var(--space-8)', background: 'var(--color-gray-50)' }}>
        {/* Header */}
        <div style={{ marginBottom: 'var(--space-8)' }}>
          <h1 style={{ 
            fontSize: 'var(--text-3xl)', 
            fontWeight: 'var(--font-semibold)',
            marginBottom: 'var(--space-2)'
          }}>
            Hello, {adminName}
          </h1>
          <p style={{ color: 'var(--color-gray-600)', margin: 0 }}>
            Here's what's happening with your hospital today.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-3" style={{ marginBottom: 'var(--space-8)' }}>
          {/* Total Patients */}
          <div className="stat-card">
            <div className="stat-card-icon">
              <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div className="stat-card-value">{stats.totalPatients}</div>
            <div className="stat-card-label">Total Patients</div>
          </div>

          {/* Total Doctors */}
          <div className="stat-card">
            <div className="stat-card-icon" style={{ background: '#D1FAE5', color: 'var(--color-success)' }}>
              <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="stat-card-value">{stats.totalDoctors}</div>
            <div className="stat-card-label">Total Doctors</div>
          </div>

          {/* Total Appointments */}
          <div className="stat-card">
            <div className="stat-card-icon" style={{ background: '#FEF3C7', color: 'var(--color-warning)' }}>
              <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="stat-card-value">{stats.totalAppointments}</div>
            <div className="stat-card-label">Total Appointments</div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card">
          <div className="card-header">
            <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-semibold)', margin: 0 }}>
              Quick Actions
            </h3>
          </div>
          <div className="card-body">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-4)' }}>
              <button 
                className="btn btn-primary"
                onClick={() => window.location.href = '/admin/users'}
              >
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                Manage Users
              </button>
              <button 
                className="btn btn-secondary"
                onClick={() => window.location.href = '/admin/appointments'}
              >
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                View Appointments
              </button>
            </div>
          </div>
        </div>
      </div>  
    </div>
  );
}

export default AdminDashboard;
