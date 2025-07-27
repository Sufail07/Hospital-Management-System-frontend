import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import axiosInstance from '../axiosInstance';
import Navbar from './Navbar';
import { Modal, Button, Form } from 'react-bootstrap';

function DoctorAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [medications, setMedications] = useState([{ name: '', dosage: ''}]);
  const [diagnosis, setDiagnosis] = useState('');

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const token = localStorage.getItem('access');
        const response = await axiosInstance.get('https://sufail07.pythonanywhere.com/api/doctors/appointments/', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAppointments(response.data);
        console.log(response.data);
      } catch (error) {
        toast.error('Error fetching appointments', {
          position: 'top-center',
          theme: 'colored',
        });
      }
    };
    fetchAppointments();
  }, []);

  const handlePrescribeClick = (appointment) => {
    setSelectedAppointment(appointment);
    setDiagnosis('');
    setMedications([{ name: '', dosage: ''}]);
    setShowModal(true);
  };

  const handleMedicationChange = (index, field, value) => {
    const updated = [...medications];
    updated[index][field] = value;
    setMedications(updated);
  };

  const addMedicationRow = () => {
    setMedications([...medications, { name: '', dosage: ''}]);
  };

  const removeMedicationRow = (index) => {
    const updated = medications.filter((_, i) => i !== index);
    setMedications(updated);
  };

  const handleSubmitPrescription = async () => {
    const isValid = medications.every(
      (med) => med.name.trim() && med.dosage.trim()
    );

    if (!isValid) {
      toast.warning('Please fill in all medication fields', {
        position: 'top-center',
        theme: 'colored',
      });
      return;
    }

    try {
      const token = localStorage.getItem('access');
      console.log(selectedAppointment)
      await axiosInstance.post('https://sufail07.pythonanywhere.com/api/doctors/prescription/', {
        appointment: selectedAppointment.id,
        medications: medications.map(med => ({
          name: med.name.trim(),
          dosage: med.dosage.trim(),
        })),
        diagnosis: diagnosis,
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      toast.success('Prescription submitted', {
        position: 'top-center',
        theme: 'colored',
      });

      setAppointments(prev =>
        prev.map(appt =>
          appt.id === selectedAppointment.id ? { ...appt, prescription_given: true } : appt
        )
      );

      setShowModal(false);
    } catch (error) {
      console.error(error.response);
      toast.error('Failed to submit prescription', {
        position: 'top-center',
        theme: 'colored',
      });
    }
  };

  return (
    <div className="d-flex">
      <Navbar />
      <div className="flex-grow-1 p-5">
        <h3 className="mb-4">Doctor Appointments</h3>
        {appointments.length === 0 ? (
          <p>No appointments found.</p>
        ) : (
          <table className="table table-bordered mt-3">
            <thead>
              <tr>
                <th>#</th>
                <th>Patient</th>
                <th>Date</th>
                <th>Time</th>
                <th>Prescription</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((appt, index) => (
                <tr key={appt.id}>
                  <td>{index + 1}</td>
                  <td>{appt.patient_name}</td>
                  <td>{new Date(appt.scheduled_at).toLocaleDateString()}</td>
                  <td>{new Date(appt.scheduled_at).toLocaleTimeString()}</td>
                  <td>{appt.prescription_given ? 'Given' : 'Pending'}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-primary"
                      onClick={() => handlePrescribeClick(appt)}
                      disabled={appt.prescription_given}
                    >
                      Prescribe
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* Prescription Modal */}
        <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>Prescribe Medication</Modal.Title>
          </Modal.Header>
          <Modal.Body>

            <Form.Group controlId="diagnosis" className="mb-3">
              <Form.Label>Diagnosis</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter diagnosis"
                value={diagnosis}
                onChange={(e) => setDiagnosis(e.target.value)}
              />
            </Form.Group>

            <Form.Label>Medications</Form.Label>
            {medications.map((med, index) => (
              <div key={index} className="mb-3 border p-2 rounded">
                <Form.Group controlId={`name-${index}`}>
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    type="text"
                    value={med.name}
                    onChange={(e) => handleMedicationChange(index, 'name', e.target.value)}
                  />
                </Form.Group>

                <Form.Group controlId={`dosage-${index}`}>
                  <Form.Label>Dosage</Form.Label>
                  <Form.Control
                    type="text"
                    value={med.dosage}
                    onChange={(e) => handleMedicationChange(index, 'dosage', e.target.value)}
                  />
                </Form.Group>

                {medications.length > 1 && (
                  <Button variant="danger" size="sm" onClick={() => removeMedicationRow(index)}>
                    Remove
                  </Button>
                )}
              </div>
            ))}
            <Button variant="success" size="sm" onClick={addMedicationRow}>
              + Add Medication
            </Button>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSubmitPrescription}>
              Submit Prescription
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
}

export default DoctorAppointments;
