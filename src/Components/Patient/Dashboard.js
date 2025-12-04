import React, { useEffect, useState } from 'react'
import {toast} from 'react-toastify';
import PatientNavbar from './Navbar';
import axiosInstance from '../axiosInstance';

function PatientDashboard() {
  const [patientName, setPatientName] = useState('')

  useEffect(() => {
    const fetchPatient = async() => {
        const token = localStorage.getItem('access')
        console.log(token)
        try {
          const response = await axiosInstance.get('https://sufail07.pythonanywhere.com/api/patients/patient/me/', {
          headers: {
            Authorization: `Bearer ${token}`
          },
        });
        const user = response.data;
        console.log(response.data)
        console.log(user.full_name)
        setPatientName(user.full_name);
        } catch(error) {
          console.log('Failed to fetch patient', error)
          toast.error('Failed to fetch patient', {
            position: 'top-center',
            theme: 'colored'
          })
        }
      }
    
    fetchPatient();
  }, [])

  return (
    <div className="d-flex" style={{ minHeight: '100vh' }}>
      <div style={{ width: '260px', flexShrink: 0 }}>
        <PatientNavbar />
      </div>
      <div className="flex-grow-1" style={{ padding: 'var(--space-8)', background: 'var(--color-gray-50)' }}>
        {/* Header */}
        <div style={{ marginBottom: 'var(--space-8)' }}>
          <h1 style={{ 
            fontSize: 'var(--text-3xl)', 
            fontWeight: 'var(--font-semibold)',
            marginBottom: 'var(--space-2)'
          }}>
            Hello, {patientName}
          </h1>
          <p style={{ color: 'var(--color-gray-600)', margin: 0 }}>
            Welcome to your patient dashboard
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-2" style={{ marginBottom: 'var(--space-8)' }}>
          <div 
            className="card" 
            style={{ cursor: 'pointer', transition: 'all 0.2s' }}
            onClick={() => window.location.href = '/patient/appointments'}
          >
            <div className="card-body">
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: 'var(--radius-lg)',
                background: '#DBEAFE',
                color: 'var(--color-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 'var(--space-4)'
              }}>
                <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h4 style={{ 
                fontSize: 'var(--text-xl)', 
                fontWeight: 'var(--font-semibold)', 
                marginBottom: 'var(--space-2)' 
              }}>
                Appointments
              </h4>
              <p style={{ 
                color: 'var(--color-gray-600)', 
                fontSize: 'var(--text-sm)', 
                marginBottom: 0 
              }}>
                Book and manage appointments
              </p>
            </div>
          </div>

          <div 
            className="card" 
            style={{ cursor: 'pointer', transition: 'all 0.2s' }}
            onClick={() => window.location.href = '/patient/history'}
          >
            <div className="card-body">
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: 'var(--radius-lg)',
                background: '#D1FAE5',
                color: 'var(--color-success)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 'var(--space-4)'
              }}>
                <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h4 style={{ 
                fontSize: 'var(--text-xl)', 
                fontWeight: 'var(--font-semibold)', 
                marginBottom: 'var(--space-2)' 
              }}>
                Medical History
              </h4>
              <p style={{ 
                color: 'var(--color-gray-600)', 
                fontSize: 'var(--text-sm)', 
                marginBottom: 0 
              }}>
                View your medical records
              </p>
            </div>
          </div>

          <div 
            className="card" 
            style={{ cursor: 'pointer', transition: 'all 0.2s' }}
            onClick={() => window.location.href = '/patient/prescriptions'}
          >
            <div className="card-body">
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: 'var(--radius-lg)',
                background: '#FEF3C7',
                color: 'var(--color-warning)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 'var(--space-4)'
              }}>
                <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
              </div>
              <h4 style={{ 
                fontSize: 'var(--text-xl)', 
                fontWeight: 'var(--font-semibold)', 
                marginBottom: 'var(--space-2)' 
              }}>
                Prescriptions
              </h4>
              <p style={{ 
                color: 'var(--color-gray-600)', 
                fontSize: 'var(--text-sm)', 
                marginBottom: 0 
              }}>
                Access your prescriptions
              </p>
            </div>
          </div>

          <div 
            className="card" 
            style={{ cursor: 'pointer', transition: 'all 0.2s' }}
            onClick={() => window.location.href = '/patient/payments'}
          >
            <div className="card-body">
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: 'var(--radius-lg)',
                background: '#FEE2E2',
                color: 'var(--color-danger)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 'var(--space-4)'
              }}>
                <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              </div>
              <h4 style={{ 
                fontSize: 'var(--text-xl)', 
                fontWeight: 'var(--font-semibold)', 
                marginBottom: 'var(--space-2)' 
              }}>
                Payments
              </h4>
              <p style={{ 
                color: 'var(--color-gray-600)', 
                fontSize: 'var(--text-sm)', 
                marginBottom: 0 
              }}>
                View payment history
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PatientDashboard;
