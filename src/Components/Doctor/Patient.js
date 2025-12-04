import React, { useEffect, useState } from 'react';
import axiosInstance from '../axiosInstance';
import { toast } from 'react-toastify';
import DoctorNavbar from './Navbar';

function ViewPatients() {
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [medicalHistory, setMedicalHistory] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const response = await axiosInstance.get('https://sufail07.pythonanywhere.com/api/doctors/patients/', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access')}`
        }
      });
      setPatients(response.data);
    } catch (error) {
      toast.error("Failed to fetch patients");
    }
  };

  const fetchMedicalHistory = async (patient) => {
    try {
      const res = await axiosInstance.get(`https://sufail07.pythonanywhere.com/api/doctors/medicalhistory/${patient.id}/patient-history`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access')}`
        }
      });
      setMedicalHistory(res.data);
      setSelectedPatient(patient);
      setModalOpen(true);
    } catch (error) {
      toast.error("Failed to fetch medical history");
    }
  };

  return (
    <div className="d-flex" style={{ minHeight: '100vh' }}>
      <div style={{ width: '260px', flexShrink: 0 }}>
        <DoctorNavbar />
      </div>

      <div className="flex-grow-1" style={{ padding: 'var(--space-8)', background: 'var(--color-gray-50)' }}>
        {/* Header */}
        <div style={{ marginBottom: 'var(--space-8)' }}>
          <h1 style={{ 
            fontSize: 'var(--text-3xl)', 
            fontWeight: 'var(--font-semibold)',
            marginBottom: 'var(--space-2)'
          }}>
            Patients
          </h1>
          <p style={{ color: 'var(--color-gray-600)', margin: 0 }}>
            View patient information and medical history
          </p>
        </div>

        {/* Patients Table */}
        <div className="card">
          <div className="card-header">
            <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-semibold)', margin: 0 }}>
              All Patients
            </h3>
          </div>
          <div className="card-body" style={{ padding: 0 }}>
            <div className="table-container" style={{ border: 'none', boxShadow: 'none', borderRadius: 0 }}>
              <table className="table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {patients.map((patient) => (
                    <tr key={patient.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                          <div style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: 'var(--radius-full)',
                            background: 'var(--color-primary)',
                            color: 'white',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: 'var(--text-sm)',
                            fontWeight: 'var(--font-semibold)'
                          }}>
                            {patient.full_name?.charAt(0)?.toUpperCase() || 'P'}
                          </div>
                          <span style={{ fontWeight: 'var(--font-medium)' }}>
                            {patient.full_name}
                          </span>
                        </div>
                      </td>
                      <td style={{ color: 'var(--color-gray-700)' }}>{patient.email}</td>
                      <td style={{ color: 'var(--color-gray-700)' }}>{patient.phone}</td>
                      <td>
                        <button
                          className="btn btn-sm btn-primary"
                          onClick={() => fetchMedicalHistory(patient)}
                        >
                          View History
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Medical History Modal */}
        {modalOpen && (
          <div className="modal" onClick={() => setModalOpen(false)}>
            <div className="modal-dialog" style={{ maxWidth: '700px' }} onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3 className="modal-title">Medical History - {selectedPatient?.full_name}</h3>
                <button type="button" className="btn-close" onClick={() => setModalOpen(false)}></button>
              </div>
              <div className="modal-body">
                {medicalHistory.length === 0 ? (
                  <div style={{ padding: 'var(--space-8)', textAlign: 'center', color: 'var(--color-gray-500)' }}>
                    <svg width="64" height="64" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" style={{ margin: '0 auto var(--space-4)', opacity: 0.3 }}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <p style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-medium)', marginBottom: 'var(--space-2)' }}>
                      No medical history available
                    </p>
                    <p style={{ fontSize: 'var(--text-sm)', margin: 0 }}>
                      This patient has no recorded medical history
                    </p>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                    {medicalHistory.map((entry, index) => {
                      let meds = [];
                      try {
                        meds = JSON.parse(entry.medications);
                      } catch (e) {
                        console.error('Invalid medications JSON', e);
                      }

                      return (
                        <div key={index} style={{ 
                          padding: 'var(--space-4)', 
                          background: 'var(--color-gray-50)', 
                          borderRadius: 'var(--radius-lg)',
                          border: '1px solid var(--color-gray-200)'
                        }}>
                          <div style={{ marginBottom: 'var(--space-3)', paddingBottom: 'var(--space-3)', borderBottom: '1px solid var(--color-gray-200)' }}>
                            <h4 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-semibold)', marginBottom: 'var(--space-1)' }}>
                              {entry.diagnosis}
                            </h4>
                            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-gray-600)', margin: 0 }}>
                              Recorded on {new Date(entry.recorded_at).toLocaleDateString()}
                            </p>
                          </div>

                          <div style={{ marginBottom: 'var(--space-3)' }}>
                            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-gray-600)', marginBottom: 'var(--space-1)', fontWeight: 'var(--font-medium)' }}>
                              Allergies
                            </p>
                            <p style={{ fontSize: 'var(--text-base)', margin: 0 }}>
                              {entry.allergies || 'None reported'}
                            </p>
                          </div>

                          <div>
                            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-gray-600)', marginBottom: 'var(--space-2)', fontWeight: 'var(--font-medium)' }}>
                              Medications
                            </p>
                            {meds.length === 0 ? (
                              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-gray-500)', margin: 0 }}>
                                No medications prescribed
                              </p>
                            ) : (
                              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                                {meds.map((med, i) => (
                                  <div key={i} style={{ 
                                    padding: 'var(--space-2)', 
                                    background: 'white', 
                                    borderRadius: 'var(--radius-md)',
                                    border: '1px solid var(--color-gray-200)',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center'
                                  }}>
                                    <div>
                                      <p style={{ fontWeight: 'var(--font-semibold)', marginBottom: 'var(--space-1)' }}>
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
                      );
                    })}
                  </div>
                )}
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setModalOpen(false)}>
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ViewPatients;
