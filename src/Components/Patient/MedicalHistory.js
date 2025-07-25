import React, { useEffect, useState } from 'react';
import axiosInstance from '../axiosInstance';
import PatientNavbar from './Navbar';
import { Card, ListGroup } from 'react-bootstrap';
import { toast } from 'react-toastify';

function Prescriptions() {
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
    <div className="d-flex">
      <PatientNavbar />
      <div className="container p-4">
        <h3 className="mb-4">Your Medical History</h3>

        {medicalHistory.length === 0 ? (
          <p>No medical history available.</p>
        ) : (
          medicalHistory.map((entry, index) => {
            let medications = [];
            try {
              medications = JSON.parse(entry.medications);
            } catch (err) {
              console.warn('Failed to parse medications:', entry.medications);
            }

            return (
              <Card key={entry.id} className="mb-3">
                <Card.Body>
                  <Card.Title>Condition: <strong>{entry.diagnosis}</strong></Card.Title>
                  <Card.Subtitle className="mb-2 text-muted">
                    Recorded on: {new Date(entry.recorded_at).toLocaleDateString()}
                  </Card.Subtitle>
                  <Card.Text><strong>Allergies:</strong> {entry.allergies}</Card.Text>

                  <Card.Text><strong>Medications:</strong></Card.Text>
                  <ListGroup>
                    {medications.map((med, i) => (
                      <ListGroup.Item key={i}>
                        <strong>{med.name}</strong>: {med.dosage}
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                </Card.Body>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}

export default Prescriptions;
