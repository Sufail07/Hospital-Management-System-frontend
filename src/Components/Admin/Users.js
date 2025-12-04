import React, { useEffect, useState } from 'react';
import axiosInstance from '../axiosInstance';
import Modal from 'react-modal';
import { toast } from 'react-toastify';
import AdminNavbar from './Navbar';

Modal.setAppElement('#root');


const Users = () => {
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const [medicalHistory, setMedicalHistory] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedPatientName, setSelectedPatientName] = useState('');

  useEffect(() => {
    fetchDoctors();
    fetchPatients();
  }, []);

  const fetchDoctors = async () => {
    try {
      const res = await axiosInstance.get('https://sufail07.pythonanywhere.com/api/admin/doctor/', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access')}`,
        },
      });
      setDoctors(res.data);
    } catch (err) {
      toast.error('Failed to fetch doctors');
    }
  };

  const fetchPatients = async () => {
    try {
      const res = await axiosInstance.get('https://sufail07.pythonanywhere.com/api/admin/patient/', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access')}`,
        },
      });
      setPatients(res.data);
      console.log(res.data)
    } catch (err) {
      toast.error('Failed to fetch patients');
    }
  };

  const toggleDoctorAccess = async (doctorId, isActive) => {
    try {
      const url = isActive
        ? `https://sufail07.pythonanywhere.com/api/admin/revoke_access_doctor/${doctorId}/`
        : `https://sufail07.pythonanywhere.com/api/admin/grant_access_doctor/${doctorId}/`;

      await axiosInstance.put(url);
      toast.success(`Doctor ${isActive ? 'revoked' : 'granted'} successfully`);
      fetchDoctors();
    } catch (err) {
      toast.error('Failed to update doctor access');
    }
  };

  const togglePatientAccess = async (patientId, isActive) => {
    try {
      const url = isActive
        ? `https://sufail07.pythonanywhere.com/api/admin/revoke_access_patient/${patientId}/`
        : `https://sufail07.pythonanywhere.com/api/admin/grant_access_patient/${patientId}/`;

      await axiosInstance.put(url,{}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access')}`,
        },
      });
      toast.success(`Patient access ${isActive ? 'revoked' : 'granted'} successfully`);
      fetchPatients();
    } catch (err) {
      toast.error('Failed to update patient access');
    }
  };

  const openMedicalHistory = async (patientId, patientName) => {
    try {
      const res = await axiosInstance.get(`https://sufail07.pythonanywhere.com/api/admin/medicalhistory/patient/${patientId}/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access')}`,
        },
      });
      setMedicalHistory(res.data);
      setSelectedPatientName(patientName);
      setModalIsOpen(true);
    } catch (err) {
      toast.error('Failed to fetch medical history');
    }
  };

  return (
    <div className="d-flex" style={{ minHeight: '100vh', background: 'var(--color-gray-50)' }}>
      {/* Sidebar */}
      <div style={{ width: '260px', flexShrink: 0 }}>
        <AdminNavbar />
      </div>

      {/* Main Content */}
      <div className="flex-grow-1" style={{ padding: 'var(--space-8)' }}>
        {/* Header */}
        <div style={{ marginBottom: 'var(--space-8)' }}>
          <h2 style={{ 
            fontSize: 'var(--text-3xl)', 
            fontWeight: 'var(--font-bold)',
            color: 'var(--color-gray-900)',
            marginBottom: 'var(--space-2)'
          }}>
            User Management
          </h2>
          <p style={{ 
            fontSize: 'var(--text-base)',
            color: 'var(--color-gray-600)',
            margin: 0
          }}>
            Manage doctors and patients access to the system
          </p>
        </div>

        {/* Doctors Section */}
        <div className="card fade-in" style={{ marginBottom: 'var(--space-8)' }}>
          <div className="card-header" style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center' 
          }}>
            <h5 style={{ margin: 0, fontSize: 'var(--text-lg)', fontWeight: 'var(--font-semibold)' }}>
              Doctors
            </h5>
            <span className="badge badge-primary" style={{ fontSize: 'var(--text-sm)' }}>
              {doctors.length} Total
            </span>
          </div>
          <div className="card-body" style={{ padding: 0 }}>
            <div className="table-container" style={{ border: 'none', boxShadow: 'none' }}>
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Specialization</th>
                    <th>Email</th>
                    <th>Status</th>
                    <th style={{ textAlign: 'center' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {doctors.map((doc) => (
                    <tr key={doc.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                          <div style={{
                            width: '36px',
                            height: '36px',
                            borderRadius: 'var(--radius-full)',
                            background: 'linear-gradient(135deg, var(--color-secondary-400), var(--color-secondary-600))',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            fontSize: 'var(--text-sm)',
                            fontWeight: 'var(--font-semibold)'
                          }}>
                            {doc.user.first_name?.charAt(0)}{doc.user.last_name?.charAt(0)}
                          </div>
                          <span style={{ fontWeight: 'var(--font-medium)' }}>
                            Dr. {doc.user.first_name} {doc.user.last_name}
                          </span>
                        </div>
                      </td>
                      <td style={{ color: 'var(--color-gray-700)' }}>{doc.specialization}</td>
                      <td style={{ color: 'var(--color-gray-600)', fontSize: 'var(--text-sm)' }}>
                        {doc.user.email}
                      </td>
                      <td>
                        <span className={`badge ${doc.user.is_active ? 'badge-success' : 'badge-danger'}`}>
                          {doc.user.is_active ? 'Active' : 'Revoked'}
                        </span>
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <button
                          className={`btn btn-sm ${doc.user.is_active ? 'btn-danger' : 'btn-success'}`}
                          onClick={() => toggleDoctorAccess(doc.id, doc.user.is_active)}
                          style={{ minWidth: '110px' }}
                        >
                          {doc.user.is_active ? (
                            <>
                              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" style={{ marginRight: 'var(--space-1)' }}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                              </svg>
                              Revoke
                            </>
                          ) : (
                            <>
                              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" style={{ marginRight: 'var(--space-1)' }}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                              </svg>
                              Grant
                            </>
                          )}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Patients Section */}
        <div className="card fade-in" style={{ animationDelay: '100ms' }}>
          <div className="card-header" style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center' 
          }}>
            <h5 style={{ margin: 0, fontSize: 'var(--text-lg)', fontWeight: 'var(--font-semibold)' }}>
              Patients
            </h5>
            <span className="badge badge-primary" style={{ fontSize: 'var(--text-sm)' }}>
              {patients.length} Total
            </span>
          </div>
          <div className="card-body" style={{ padding: 0 }}>
            <div className="table-container" style={{ border: 'none', boxShadow: 'none' }}>
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Status</th>
                    <th style={{ textAlign: 'center' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {patients.map((p) => (
                    <tr key={p.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                          <div style={{
                            width: '36px',
                            height: '36px',
                            borderRadius: 'var(--radius-full)',
                            background: 'linear-gradient(135deg, var(--color-primary-400), var(--color-primary-600))',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            fontSize: 'var(--text-sm)',
                            fontWeight: 'var(--font-semibold)'
                          }}>
                            {p.full_name?.charAt(0)?.toUpperCase() || 'P'}
                          </div>
                          <span style={{ fontWeight: 'var(--font-medium)' }}>
                            {p.full_name}
                          </span>
                        </div>
                      </td>
                      <td style={{ color: 'var(--color-gray-600)', fontSize: 'var(--text-sm)' }}>
                        {p.email}
                      </td>
                      <td>
                        <span className={`badge ${p.user.is_active ? 'badge-success' : 'badge-danger'}`}>
                          {p.user.is_active ? 'Active' : 'Revoked'}
                        </span>
                      </td>
                      <td>
                        <div className="table-actions" style={{ justifyContent: 'center' }}>
                          <button
                            className={`btn btn-sm ${p.user.is_active ? 'btn-danger' : 'btn-success'}`}
                            onClick={() => togglePatientAccess(p.id, p.user.is_active)}
                            style={{ minWidth: '110px' }}
                          >
                            {p.user.is_active ? (
                              <>
                                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" style={{ marginRight: 'var(--space-1)' }}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                                Revoke
                              </>
                            ) : (
                              <>
                                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" style={{ marginRight: 'var(--space-1)' }}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                                Grant
                              </>
                            )}
                          </button>
                          <button
                            className="btn btn-sm btn-primary"
                            onClick={() => openMedicalHistory(p.id, p.user.full_name)}
                          >
                            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" style={{ marginRight: 'var(--space-1)' }}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            View History
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Medical History Modal */}
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={() => setModalIsOpen(false)}
          contentLabel="Medical History"
          style={{
            content: {
              top: '50%',
              left: '50%',
              right: 'auto',
              bottom: 'auto',
              transform: 'translate(-50%, -50%)',
              maxHeight: '80vh',
              overflowY: 'auto',
              width: '90%',
              maxWidth: '700px',
              padding: 0,
              borderRadius: 'var(--radius-xl)',
              border: 'none',
              boxShadow: 'var(--shadow-xl)',
            },
            overlay: {
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              backdropFilter: 'blur(4px)',
              zIndex: 1050,
            },
          }}
        >
          <div className="modal-header">
            <h5 className="modal-title">Medical History of {selectedPatientName}</h5>
            <button type="button" className="btn-close" onClick={() => setModalIsOpen(false)}></button>
          </div>
          <div className="modal-body">
            {medicalHistory.length === 0 ? (
              <div style={{ 
                textAlign: 'center', 
                padding: 'var(--space-8)',
                color: 'var(--color-gray-500)'
              }}>
                <svg width="64" height="64" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" style={{ margin: '0 auto var(--space-4)', opacity: 0.5 }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-medium)', marginBottom: 'var(--space-2)' }}>
                  No medical records found
                </p>
                <p style={{ fontSize: 'var(--text-sm)', margin: 0 }}>
                  This patient has no medical history recorded yet
                </p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                {medicalHistory.map((record) => (
                  <div key={record.id} className="card" style={{ boxShadow: 'var(--shadow-sm)' }}>
                    <div className="card-body">
                      <div style={{ marginBottom: 'var(--space-3)' }}>
                        <strong style={{ color: 'var(--color-gray-700)', fontSize: 'var(--text-sm)' }}>
                          Condition:
                        </strong>
                        <p style={{ margin: '4px 0 0 0', color: 'var(--color-gray-900)' }}>
                          {record.condition}
                        </p>
                      </div>
                      <div style={{ marginBottom: 'var(--space-3)' }}>
                        <strong style={{ color: 'var(--color-gray-700)', fontSize: 'var(--text-sm)' }}>
                          Treatment:
                        </strong>
                        <p style={{ margin: '4px 0 0 0', color: 'var(--color-gray-900)' }}>
                          {record.treatment}
                        </p>
                      </div>
                      <div style={{ marginBottom: 'var(--space-3)' }}>
                        <strong style={{ color: 'var(--color-gray-700)', fontSize: 'var(--text-sm)' }}>
                          Medications:
                        </strong>
                        <p style={{ margin: '4px 0 0 0', color: 'var(--color-gray-900)' }}>
                          {record.medications}
                        </p>
                      </div>
                      <div style={{ 
                        paddingTop: 'var(--space-3)', 
                        borderTop: '1px solid var(--color-gray-200)',
                        fontSize: 'var(--text-xs)',
                        color: 'var(--color-gray-500)'
                      }}>
                        Recorded on: {new Date(record.created_at).toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="modal-footer">
            <button onClick={() => setModalIsOpen(false)} className="btn btn-secondary">
              Close
            </button>
          </div>
        </Modal>

      </div>
    </div>
  );
};

export default Users;
