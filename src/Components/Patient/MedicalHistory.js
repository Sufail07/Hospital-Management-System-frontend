import React, { useEffect, useState } from 'react';
import axiosInstance from '../axiosInstance';
import PatientNavbar from './Navbar';
import { toast } from 'react-toastify';

function MedicalHistory() {
  const [medicalHistory, setMedicalHistory] = useState([]);

  useEffect(() => {
    const fetchMedicalHistory = async () => {
      try {
        const token = localStorage.getItem('access');
        const response = await axiosInstance.get('https://sufail07.pythonanywhere.com/api/patients/medicalhistory/', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setMedicalHistory(response.data);
      } catch (error) {
        console.error('Error fetching medical history:', error.response);
        toast.error("Failed to load medical history");
      }
    };

    fetchMedicalHistory();
  }, []);

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
            Medical History
          </h1>
          <p style={{ color: 'var(--color-gray-600)', margin: 0 }}>
            Your complete medical records and history
          </p>
        </div>

        {/* Medical History Content */}
        {medicalHistory.length === 0 ? (
          <div className="card">
            <div className="card-body" style={{ padding: 'var(--space-8)', textAlign: 'center' }}>
              <svg width="64" height="64" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" style={{ margin: '0 auto var(--space-4)', opacity: 0.3 }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-medium)', marginBottom: 'var(--space-2)', color: 'var(--color-gray-500)' }}>
                No medical history available
              </p>
              <p style={{ fontSize: 'var(--text-sm)', margin: 0, color: 'var(--color-gray-500)' }}>
                Your medical records will appear here
              </p>
            </div>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: 'var(--space-6)' }}>
            {medicalHistory.map((entry) => {
              let medications = [];
              try {
                medications = JSON.parse(entry.medications);
              } catch (err) {
                console.warn('Failed to parse medications:', entry.medications);
              }

              return (
                <div key={entry.id} className="card">
                  <div className="card-body">
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-3)', marginBottom: 'var(--space-4)' }}>
                      <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: 'var(--radius-full)',
                        background: '#D1FAE5',
                        color: 'var(--color-success)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}>
                        <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <div style={{ flex: 1 }}>
                        <h3 style={{ fontSize: 'var(--text-xl)', fontWeight: 'var(--font-semibold)', marginBottom: 'var(--space-1)' }}>
                          {entry.diagnosis}
                        </h3>
                        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-gray-600)', margin: 0 }}>
                          Recorded on {new Date(entry.recorded_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    {/* Allergies */}
                    <div style={{ marginBottom: 'var(--space-4)', paddingBottom: 'var(--space-4)', borderBottom: '1px solid var(--color-gray-200)' }}>
                      <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-gray-600)', marginBottom: 'var(--space-2)', fontWeight: 'var(--font-medium)' }}>
                        Allergies
                      </p>
                      <p style={{ fontSize: 'var(--text-base)', margin: 0 }}>
                        {entry.allergies || 'None reported'}
                      </p>
                    </div>

                    {/* Medications */}
                    <div>
                      <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-gray-600)', marginBottom: 'var(--space-3)', fontWeight: 'var(--font-medium)' }}>
                        Medications
                      </p>
                      {medications.length === 0 ? (
                        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-gray-500)', margin: 0 }}>
                          No medications prescribed
                        </p>
                      ) : (
                        <div style={{ display: 'grid', gap: 'var(--space-2)' }}>
                          {medications.map((med, i) => (
                            <div key={i} style={{ 
                              padding: 'var(--space-3)', 
                              background: 'var(--color-gray-50)', 
                              borderRadius: 'var(--radius-md)',
                              border: '1px solid var(--color-gray-200)',
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center'
                            }}>
                              <div>
                                <p style={{ fontWeight: 'var(--font-semibold)', marginBottom: 'var(--space-1)', color: 'var(--color-gray-900)' }}>
                                  {med.name}
                                </p>
                                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-gray-600)', margin: 0 }}>
                                  {med.dosage}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default MedicalHistory;
