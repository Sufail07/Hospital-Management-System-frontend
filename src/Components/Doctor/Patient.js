import React, { useEffect, useState } from 'react';
import axiosInstance from '../axiosInstance';
import Modal from 'react-modal';
import { toast } from 'react-toastify';
import DoctorNavbar from './Navbar';

Modal.setAppElement('#root');

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '600px',
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '10px',
  },
  overlay: {
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
};

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
      console.log(error.response);
    }
  };

  return (
    <div className="d-flex">
      <DoctorNavbar />

      <div className="container p-4">
        <h3 className="mb-4">All Patients</h3>

        <table className="table table-bordered table-striped">
          <thead className="table-light">
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
                <td>{patient.full_name}</td>
                <td>{patient.email}</td>
                <td>{patient.phone}</td>
                <td>
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => fetchMedicalHistory(patient)}
                  >
                    View Medical History
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <Modal
          isOpen={modalOpen}
          onRequestClose={() => setModalOpen(false)}
          style={customStyles}
        >
          <h5 className="mb-3">Medical History for {selectedPatient?.full_name}</h5>

          {medicalHistory.length === 0 ? (
            <p>No medical history available.</p>
          ) : (
            <ul>
              {medicalHistory.map((entry, index) => {
                let meds = [];
                try {
                  meds = JSON.parse(entry.medications);
                } catch (e) {
                  console.error('Invalid medications JSON', e);
                }

                return (
                  <li key={index} className="mb-3">
                    <p>
                      <strong>Condition:</strong> {entry.diagnosis} &nbsp;
                      <em>({new Date(entry.recorded_at).toLocaleDateString()})</em>
                    </p>
                    <p>
                      <strong>Medications:</strong>{' '}
                      {meds.map((each, i) => (
                        <span key={i}>
                          <strong>{each.name}</strong>: {each.dosage}
                          {i < meds.length - 1 && ', '}
                        </span>
                      ))}
                    </p>
                  </li>
                );
              })}
            </ul>
          )}

          <div className="text-end mt-3">
            <button className="btn btn-secondary" onClick={() => setModalOpen(false)}>
              Close
            </button>
          </div>
        </Modal>
      </div>
    </div>
  );
}

export default ViewPatients;
