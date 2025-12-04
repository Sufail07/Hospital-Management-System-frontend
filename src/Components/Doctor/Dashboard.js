import React, { useEffect, useState } from 'react';
import axiosInstance from '../axiosInstance';
import DoctorNavbar from './Navbar';
import { Link } from 'react-router-dom';

function DoctorDashboard() {
  const [todayAppointments, setTodayAppointments] = useState([]);

  useEffect(() => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    const formattedToday = `${yyyy}-${mm}-${dd}`;
    const fetchTodayAppointments = async () => {
      const token = localStorage.getItem('access');
      try {
        const response = await axiosInstance.get(`https://sufail07.pythonanywhere.com/api/doctors/appointments/?date=${formattedToday}/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log('API response, ', response.data)
        setTodayAppointments(response.data);
      } catch (error) {
        console.log('Failed to fetch today appointments', error);
      }
    };

    fetchTodayAppointments();
  }, []);

  return (
    <div className="d-flex" style={{ minHeight: '100vh', background: 'var(--color-gray-50)' }}>
      <div style={{ width: '260px', flexShrink: 0 }}>
        <DoctorNavbar />
      </div>
      <div className="flex-grow-1" style={{ padding: 'var(--space-8)' }}>
        {/* Header */}
        <div style={{ marginBottom: 'var(--space-8)' }}>
          <h2 style={{ 
            fontSize: 'var(--text-3xl)', 
            fontWeight: 'var(--font-bold)',
            color: 'var(--color-gray-900)',
            marginBottom: 'var(--space-2)'
          }}>
            Doctor Dashboard 👨‍⚕️
          </h2>
          <p style={{ 
            fontSize: 'var(--text-base)',
            color: 'var(--color-gray-600)',
            margin: 0
          }}>
            Welcome back! Here are your appointments for today.
          </p>
        </div>

        {/* Today's Appointments Card */}
        <div className="card fade-in">
          <div className="card-header" style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center' 
          }}>
            <h5 style={{ margin: 0, fontSize: 'var(--text-lg)', fontWeight: 'var(--font-semibold)' }}>
              Today's Appointments
            </h5>
            <span className="badge badge-primary" style={{ fontSize: 'var(--text-sm)' }}>
              {todayAppointments.length} Total
            </span>
          </div>
          <div className="card-body" style={{ padding: 0 }}>
            {todayAppointments.length === 0 ? (
              <div style={{ 
                padding: 'var(--space-8)', 
                textAlign: 'center',
                color: 'var(--color-gray-500)'
              }}>
                <svg width="64" height="64" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" style={{ margin: '0 auto var(--space-4)', opacity: 0.5 }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-medium)' }}>
                  No appointments scheduled for today
                </p>
                <p style={{ fontSize: 'var(--text-sm)', margin: 0 }}>
                  Enjoy your day off!
                </p>
              </div>
            ) : (
              <div className="table-container" style={{ border: 'none', boxShadow: 'none' }}>
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Patient</th>
                      <th>Time</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {todayAppointments.slice(0, 5).map((appointment, index) => (
                      <tr key={appointment.id}>
                        <td style={{ fontWeight: 'var(--font-medium)' }}>
                          {index + 1}
                        </td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                            <div style={{
                              width: '32px',
                              height: '32px',
                              borderRadius: 'var(--radius-full)',
                              background: 'linear-gradient(135deg, var(--color-primary-400), var(--color-primary-600))',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: 'white',
                              fontSize: 'var(--text-sm)',
                              fontWeight: 'var(--font-semibold)'
                            }}>
                              {appointment.patient_name?.charAt(0)?.toUpperCase() || 'P'}
                            </div>
                            <span style={{ fontWeight: 'var(--font-medium)' }}>
                              {appointment.patient_name}
                            </span>
                          </div>
                        </td>
                        <td style={{ color: 'var(--color-gray-700)' }}>
                          {new Date(appointment.scheduled_at).toLocaleTimeString([], { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </td>
                        <td>
                          <span className="badge badge-success">
                            Scheduled
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {todayAppointments.length > 5 && (
                  <div style={{ 
                    padding: 'var(--space-4)', 
                    textAlign: 'center',
                    background: 'var(--color-gray-50)',
                    borderTop: '1px solid var(--color-gray-200)'
                  }}>
                    <p style={{ 
                      color: 'var(--color-gray-600)', 
                      fontSize: 'var(--text-sm)',
                      margin: 0
                    }}>
                      Showing 5 of {todayAppointments.length} appointments.{' '}
                      <Link 
                        to="/doctor/appointments" 
                        style={{ 
                          color: 'var(--color-primary-600)',
                          fontWeight: 'var(--font-semibold)',
                          textDecoration: 'none'
                        }}
                      >
                        View all →
                      </Link>
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DoctorDashboard;
