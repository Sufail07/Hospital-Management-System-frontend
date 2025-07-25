import React, { useEffect, useState } from 'react';
import axios from 'axios';
import PatientNavbar from './Navbar';
import Modal from 'react-modal';
import { toast } from 'react-toastify';
import axiosInstance from '../axiosInstance';

Modal.setAppElement('#root');

function Prescriptions() {
    const [prescriptions, setPrescriptions] = useState([]);
    const [selectedPrescription, setSelectedPrescription] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);


    const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        width: '500px',
        borderRadius: '10px',
        backgroundColor: '#fff',
        color: '#000',
        padding: '20px',
        zIndex: 1050,
    },
    overlay: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        zIndex: 1040,
    }
    };

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
            console.log('Prescriptions: ', response.data);
            setPrescriptions(response.data);
        } catch (error) {
            console.log("Failed to fetch prescriptions");
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
            console.log("Stripe session error: ", error);
            toast.error('Failed to initiate payment');
        }
    };


    return (
      <div className="d-flex">
      <PatientNavbar />
      
      <div className="container-fluid p-4">
          <h2 className="mb-4">My Prescriptions</h2>

          <div className="table-responsive">
              <table className="table table-bordered table-striped">
                  <thead className="table-light">
                      <tr>
                          <th>Doctor</th>
                          <th>Date</th>
                          <th>Status</th>
                          <th>Action</th>
                      </tr>
                  </thead>
                  <tbody>
                      {prescriptions.map((prescription) => (
                          <tr key={prescription.id}>
                              <td>{prescription.doctor_name}</td>
                              <td>{new Date(prescription.created_at).toLocaleString()}</td>
                              <td>{prescription.is_paid ? 'Paid' : 'Pending Payment'}</td>
                              <td>
                                  <div className="d-flex gap-2">
                                      <button
                                          className={`btn ${prescription.is_paid ? 'btn-primary disabled' : 'btn-primary'}`}
                                          onClick={() => handlePay(prescription.id)}
                                      >
                                          Pay
                                      </button>
                                      <button
                                          className={`btn ${
                                              prescription.is_paid
                                                  ? 'btn-success'
                                                  : 'btn-secondary disabled'
                                          }`}
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
                                          View
                                      </button>
                                  </div>
                              </td>
                          </tr>
                      ))}
                  </tbody>
              </table>
          </div>

          <Modal
              isOpen={modalOpen}
              onRequestClose={() => setModalOpen(false)}
              style={customStyles}
              overlayClassName="modal-backdrop show d-block"
          >
              <div className="modal-content p-4">
                  <h5 className="modal-title mb-3">Prescription Details</h5>
                  {selectedPrescription && (
                      <div>
                          <p><strong>Doctor:</strong> {selectedPrescription.doctor_name}</p>
                          <p><strong>Date:</strong> {new Date(selectedPrescription.created_at).toLocaleString()}</p>
                          <div>
                              <strong>Medications:</strong>
                              <ul>
                                  {JSON.parse(selectedPrescription.medications).map((med, index) => (
                                      <li key={index}>
                                          <strong>{med.name}</strong> – {med.dosage} – ₹{med.cost}
                                      </li>
                                  ))}
                              </ul>
                          </div>
                      </div>
                  )}
                  <div className="mt-3 text-end">
                      <button
                          onClick={() => setModalOpen(false)}
                          className="btn btn-secondary"
                      >
                          Close
                      </button>
                  </div>
              </div>
          </Modal>
      </div>
  </div>
    );
}

export default Prescriptions;
