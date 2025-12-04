import React, { useEffect, useState } from 'react';
import PatientNavbar from './Navbar';
import Modal from 'react-modal';
import { toast } from 'react-toastify';
import axiosInstance from '../axiosInstance';

Modal.setAppElement('#root');

function Prescriptions() {
    const [prescriptions, setPrescriptions] = useState([]);
    const [selectedPrescription, setSelectedPrescription] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);

    useEffect(() => {
        fetchPrescriptions();
    }, []);

    const fetchPrescriptions = async () => {
        try {
            const access = localStorage.getItem('access');
            const response = await axiosInstance.get('https://sufail07.pythonanywhere.com/api/patients/prescriptions/', {
                headers: {
                    Authorization: `Bearer ${access}`
                }
            });
            setPrescriptions(response.data);
        } catch (error) {
            toast.error("Failed to fetch prescriptions", {
                position: 'top-center',
                theme: 'colored'
            });
        }
    };

    const handleView = (prescription) => {
        setSelectedPrescription(prescription);
        setModalOpen(true);
    };

    const handlePay = async (id) => {
        try {
            const token = localStorage.getItem('access');
            const response = await axiosInstance.get(`https://sufail07.pythonanywhere.com/api/patients/pay/prescription/${id}/`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            window.location.href = response.data.checkout_url;
        } catch (error) {
            toast.error('Failed to initiate payment');
        }
    };

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
              Prescriptions
            </h1>
            <p style={{ color: 'var(--color-gray-600)', margin: 0 }}>
              View and manage your prescriptions
            </p>
          </div>

          {prescriptions.length === 0 ? (
            <div className="card">
              <div className="card-body" style={{ padding: 'var(--space-8)', textAlign: 'center' }}>
                <svg width="64" height="64" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" style={{ margin: '0 auto var(--space-4)', opacity: 0.3 }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
                <p style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-medium)', marginBottom: 'var(--space-2)', color: 'var(--color-gray-500)' }}>
                  No prescriptions yet
                </p>
                <p style={{ fontSize: 'var(--text-sm)', margin: 0, color: 'var(--color-gray-500)' }}>
                  Your prescriptions will appear here
                </p>
              </div>
            </div>
          ) : (
            <div style={{ display: 'grid', gap: 'var(--space-6)' }}>
              {prescriptions.map((prescription) => (
                <div key={prescription.id} className="card">
                  <div className="card-body">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-4)' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-2)' }}>
                          <div style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: 'var(--radius-full)',
                            background: '#FEF3C7',
                            color: 'var(--color-warning)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}>
                            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                            </svg>
                          </div>
                          <div>
                            <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-semibold)', margin: 0 }}>
                              Dr. {prescription.doctor_name}
                            </h3>
                            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-gray-600)', margin: 0 }}>
                              {new Date(prescription.created_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </div>
                      <span className={`badge ${prescription.is_paid ? 'badge-success' : 'badge-warning'}`}>
                        {prescription.is_paid ? 'Paid' : 'Pending Payment'}
                      </span>
                    </div>

                    <div className="table-actions" style={{ justifyContent: 'flex-start' }}>
                      {!prescription.is_paid && (
                        <button
                          className="btn btn-primary"
                          onClick={() => handlePay(prescription.id)}
                        >
                          Pay Now
                        </button>
                      )}
                      <button
                        className={`btn ${prescription.is_paid ? 'btn-primary' : 'btn-secondary'}`}
                        onClick={() => {
                          if (prescription.is_paid) {
                            handleView(prescription);
                          } else {
                            toast.warning('Please complete payment to view the prescription', {
                              position: 'top-center',
                              theme: 'colored'
                            });
                          }
                        }}
                disabled={!prescription.is_paid}
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Modal */}
          {modalOpen && (
            <div className="modal" onClick={() => setModalOpen(false)}>
              <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                  <h3 className="modal-title">Prescription Details</h3>
                  <button type="button" className="btn-close" onClick={() => setModalOpen(false)}></button>
                </div>
                <div className="modal-body">
                  {selectedPrescription && (
                    <div>
                      <div style={{ marginBottom: 'var(--space-4)', paddingBottom: 'var(--space-4)', borderBottom: '1px solid var(--color-gray-200)' }}>
                        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-gray-600)', marginBottom: 'var(--space-1)' }}>
                          Doctor
                        </p>
                        <p style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--font-medium)', margin: 0 }}>
                          Dr. {selectedPrescription.doctor_name}
                        </p>
                      </div>

                      <div style={{ marginBottom: 'var(--space-4)', paddingBottom: 'var(--space-4)', borderBottom: '1px solid var(--color-gray-200)' }}>
                        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-gray-600)', marginBottom: 'var(--space-1)' }}>
                          Date
                        </p>
                        <p style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--font-medium)', margin: 0 }}>
                          {new Date(selectedPrescription.created_at).toLocaleDateString()}
                        </p>
                      </div>

                      <div>
                        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-gray-600)', marginBottom: 'var(--space-3)' }}>
                          Medications
                        </p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                          {JSON.parse(selectedPrescription.medications).map((med, index) => (
                            <div key={index} style={{ 
                              padding: 'var(--space-3)', 
                              background: 'var(--color-gray-50)', 
                              borderRadius: 'var(--radius-md)',
                              border: '1px solid var(--color-gray-200)'
                            }}>
                              <p style={{ fontWeight: 'var(--font-semibold)', marginBottom: 'var(--space-1)', color: 'var(--color-gray-900)' }}>
                                {med.name}
                              </p>
                              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-gray-600)', marginBottom: 'var(--space-1)' }}>
                                Dosage: {med.dosage}
                              </p>
                              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-gray-900)', fontWeight: 'var(--font-medium)', margin: 0 }}>
                                Cost: ₹{med.cost}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <div className="modal-footer">
                  <button onClick={() => setModalOpen(false)} className="btn btn-secondary">
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

export default Prescriptions;
