import React, { useEffect, useState } from 'react';
import axiosInstance from '../axiosInstance';
import Modal from 'react-modal';
import { toast } from 'react-toastify';
import AdminNavbar from './Navbar';

Modal.setAppElement('#root');

const customModalStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    transform: 'translate(-50%, -50%)',
    maxHeight: '80vh',
    overflowY: 'auto',
    width: '90%',
    maxWidth: '800px',
    padding: '20px',
    borderRadius: '10px',
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    zIndex: 1000,
  },
};


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
    <div className="container-fluid">
      <div className="row">
        {/* Sidebar */}
        <div className="col-auto bg-light px-0" style={{ width: '220px', minHeight: '100vh'}}>
          <AdminNavbar />
        </div>

        {/* Main Content */}
        <div className="col ps-md-4 pe-4 pt-4">
          <h2 className="h4 fw-bold mb-4">Doctors</h2>
          <table className="table table-bordered mb-5">
            <thead className="table-light">
              <tr>
                <th>Name</th>
                <th>Specialization</th>
                <th>Email</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {doctors.map((doc) => (
                <tr key={doc.id}>
                  <td>{`${doc.user.first_name} ${doc.user.last_name}`}</td>
                  <td>{doc.specialization}</td>
                  <td>{doc.user.email}</td>
                  <td>{doc.user.is_active ? 'Active' : 'Revoked'}</td>
                  <td>
                    <button
                      className={`btn btn-sm ${doc.user.is_active ? 'btn-danger' : 'btn-success'}`}
                      onClick={() => toggleDoctorAccess(doc.id, doc.user.is_active)}
                    >
                      {doc.user.is_active ? 'Revoke Access' : 'Grant Access'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <h2 className="h4 fw-bold mb-4">Patients</h2>
          <table className="table table-bordered">
            <thead className="table-light">
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {patients.map((p) => (
                <tr key={p.id}>
                  <td>{p.full_name}</td>
                  <td>{p.email}</td>
                  <td>{p.user.is_active ? 'Active' : 'Revoked'}</td>
                  <td>
                    <div className="d-flex gap-2">
                      <button
                        className={`btn btn-sm ${p.user.is_active ? 'btn-danger' : 'btn-success'}`}
                        onClick={() => togglePatientAccess(p.id, p.user.is_active)}
                      >
                        {p.user.is_active ? 'Revoke Access' : 'Grant Access'}
                      </button>
                      <button
                        className="btn btn-sm btn-primary"
                        onClick={() => openMedicalHistory(p.id, p.user.full_name)}
                      >
                        View History
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <Modal
            isOpen={modalIsOpen}
            onRequestClose={() => setModalIsOpen(false)}
            contentLabel="Medical History"
            style={customModalStyles}
          >
            <div className="modal-header">
              <h5 className="modal-title">Medical History of {selectedPatientName}</h5>
              <button type="button" className="btn-close" onClick={() => setModalIsOpen(false)}></button>
            </div>
            <div className="modal-body">
              {medicalHistory.length === 0 ? (
                <p>No records found.</p>
              ) : (
                <ul className="list-group">
                  {medicalHistory.map((record) => (
                    <li key={record.id} className="list-group-item">
                      <p><strong>Condition:</strong> {record.condition}</p>
                      <p><strong>Treatment:</strong> {record.treatment}</p>
                      <p><strong>Medications:</strong> {record.medications}</p>
                      <p><strong>Recorded On:</strong> {new Date(record.created_at).toLocaleString()}</p>
                    </li>
                  ))}
                </ul>
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
    </div>
  );
};

export default Users;
