import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import Navbar from './Navbar'
import axiosInstance from '../axiosInstance';


function PatientAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedDoctorID, setSelectedDoctorID] = useState('');
  const [appointmentTime, setAppointmentTime] = useState('');
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [rescheduleId, setRescheduleId] = useState(null);
  const [newRescheduleTime, setNewRescheduleTime] = useState('');


  useEffect(()=> {
    const fetchAppointments = async() => {
      try {
        const token = localStorage.getItem('access')
        const response = await axiosInstance.get('https://sufail07.pythonanywhere.com/api/patients/appointments/', {
          headers: {
            Authorization: `Bearer ${token}`
          },
        });
        console.log('Appointments: ', response.data)
        setAppointments(response.data);
      } catch(error) {
        toast.error("Unable to load appointments", {
          position: 'top-center',
          theme: 'colored'
        });
      }
    }

    const fetchDoctors = async() => {
      try {
        const token = localStorage.getItem('access')
        const response = await axiosInstance.get('https://sufail07.pythonanywhere.com/api/patients/doctors/', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setDoctors(response.data);
      } catch(error) {
        toast.error('Error fetching doctors', {
          position: 'top-center',
          theme: 'colored'
        });
      }
    }
    fetchAppointments();
    fetchDoctors();
    }, [])
    
    const handleSubmit = async (e) => {
      e.preventDefault();

      if(!selectedDoctor || !appointmentTime) {
        toast.warning("Please fill in the fields", {
          position: 'top-center',
          theme: 'colored'
        });
        return;
      }
      try {
        const token = localStorage.getItem('access');
        const payload = {
          doctor_id: parseInt(selectedDoctor),
          appointment_time: appointmentTime,
        };

        // console.log("Sending to server")
        // console.log('Payload: ', JSON.stringify(payload, null, 2))
        // console.log('Token exists: ', !!token)
        

        const response = await axiosInstance.post('https://sufail07.pythonanywhere.com/api/patients/appointments/', {
          doctor_id: parseInt(selectedDoctor),
          appointment_time: appointmentTime,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        if(response.status == 200 || response.status == 201) {
          toast.success('Appointment created successfully', {
            position: 'top-center',
            theme: 'colored'
          });
          setSelectedDoctor('');
          setAppointmentTime('');
        }
      } catch(error) {
        console.error('Full error: ', error)
        const status = error.response?.status;
        if (status === 409) {
          toast.error('Doctor unavailable at that time', {
            position: 'top-center',
            theme: 'colored'
          });
        } else {
          toast.error('Failed to create appointment', {
            position: 'top-center',
            theme: 'colored'
          })
        }
        console.error('Error response: ', error.response?.data)
        console.error('Error status: ', error.response?.status)
      }
    }

    const cancelAppointment = async (id) => {
      if (!window.confirm("Are you sure you want to cancel this appointment?")) return;
    
      try {
        const token = localStorage.getItem('access');
        await axiosInstance.delete(`https://sufail07.pythonanywhere.com/api/patients/appointments/${id}/`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
    
        toast.success("Appointment cancelled successfully", {
          position: 'top-center',
          theme: 'colored'
        });
    
        setAppointments(prev => prev.filter(appt => appt.id !== id));
    
      } catch (error) {
        console.error(error);
        toast.error("Failed to cancel appointment", {
          position: 'top-center',
          theme: 'colored'
        });
      }
    };
    
    const reschedule = async (id) => {
      const newTime = prompt("Enter new appointment datetime (YYYY-MM-DDTHH:MM):");
    
      if (!newTime) return;
    
      try {
        const token = localStorage.getItem('access');
    
        const response = await axiosInstance.patch(
          `https://sufail07.pythonanywhere.com/api/patients/appointments/${id}/`,
          { scheduled_at: newTime },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            }
          }
        );
    
        toast.success("Appointment rescheduled", {
          position: 'top-center',
          theme: 'colored'
        });

        setAppointments(prev =>
          prev.map(appt => appt.id === id ? { ...appt, scheduled_at: newTime } : appt)
        );
    
      } catch (error) {
        console.error(error);
        const status = error.response?.status;
        if (status === 409) {
          toast.error("Doctor is not available at that time", {
            position: 'top-center',
            theme: 'colored'
          });
        } else {
          toast.error("Failed to reschedule", {
            position: 'top-center',
            theme: 'colored'
          });
        }
      }
    };
    
    const openRescheduleModal = (id, currentTime) => {
      setRescheduleId(id);
      setNewRescheduleTime(currentTime?.slice(0, 16));
      setShowRescheduleModal(true);
    };
    
    const submitReschedule = async () => {
      if (!newRescheduleTime || !rescheduleId) return;
    
      try {
        const token = localStorage.getItem('access');
        const response = await axiosInstance.patch(
          `https://sufail07.pythonanywhere.com/api/patients/appointments/${rescheduleId}/`,
          { scheduled_at: newRescheduleTime },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
    
        toast.success("Appointment rescheduled successfully", {
          position: 'top-center',
          theme: 'colored'
        });
    
        setAppointments(prev =>
          prev.map(appt =>
            appt.id === rescheduleId ? { ...appt, scheduled_at: newRescheduleTime } : appt
          )
        );
    
        setShowRescheduleModal(false);
        setRescheduleId(null);
        setNewRescheduleTime('');
      } catch (error) {
        console.error(error);
        const status = error.response?.status;
        if (status === 409) {
          toast.error("Doctor is unavailable at that time", {
            position: 'top-center',
            theme: 'colored'
          });
        } else {
          toast.error("Failed to reschedule", {
            position: 'top-center',
            theme: 'colored'
          });
        }
      }
    };
    

  return (
    <div className="d-flex" style={{ minHeight: '100vh' }}>
      {/* Sidebar */}
      <div style={{ width: '260px', flexShrink: 0 }}>
        <Navbar />
      </div>

      {/* Main Content */}
      <div className="flex-grow-1" style={{ padding: 'var(--space-8)', background: 'var(--color-gray-50)' }}>
        {/* Header */}
        <div style={{ marginBottom: 'var(--space-8)' }}>
          <h1 style={{ 
            fontSize: 'var(--text-3xl)', 
            fontWeight: 'var(--font-semibold)',
            marginBottom: 'var(--space-2)'
          }}>
            Appointments
          </h1>
          <p style={{ color: 'var(--color-gray-600)', margin: 0 }}>
            Manage your appointments and schedule visits with doctors
          </p>
        </div>

        {/* Two Column Layout */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 'var(--space-6)' }}>
          {/* Book Appointment Form */}
          <div className="card">
            <div className="card-header">
              <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-semibold)', margin: 0 }}>
                Book New Appointment
              </h3>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label className="form-label">Select Doctor</label>
                  <select
                    className="form-select"
                    value={selectedDoctor}
                    onChange={(e) => setSelectedDoctor(e.target.value)}
                    required
                  >
                    <option value="">Choose a doctor...</option>
                    {doctors.map((doc) => (
                      <option key={doc.id} value={String(doc.id)}>
                        Dr. {doc.user?.first_name} {doc.user?.last_name} - {doc.specialization}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Date & Time</label>
                  <input
                    type="datetime-local"
                    className="form-control"
                    value={appointmentTime}
                    onChange={(e) => setAppointmentTime(e.target.value)}
                    required
                  />
                </div>

                <button type="submit" className="btn btn-primary btn-block">
                  Schedule Appointment
                </button>
              </form>
            </div>
          </div>

          {/* Appointments List */}
          <div className="card">
            <div className="card-header">
              <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-semibold)', margin: 0 }}>
                Your Appointments
              </h3>
            </div>
            <div className="card-body" style={{ padding: 0 }}>
              {appointments.length === 0 ? (
                <div style={{ 
                  padding: 'var(--space-8)', 
                  textAlign: 'center',
                  color: 'var(--color-gray-500)'
                }}>
                  <svg width="64" height="64" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" style={{ margin: '0 auto var(--space-4)', opacity: 0.3 }}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-medium)', marginBottom: 'var(--space-2)' }}>
                    No appointments yet
                  </p>
                  <p style={{ fontSize: 'var(--text-sm)', margin: 0 }}>
                    Book your first appointment using the form
                  </p>
                </div>
              ) : (
                <div className="table-container" style={{ border: 'none', boxShadow: 'none', borderRadius: 0 }}>
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Doctor</th>
                        <th>Date</th>
                        <th>Time</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {appointments.map((appt) => (
                        <tr key={appt.id}>
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
                                {appt.doctor?.charAt(0) || 'D'}
                              </div>
                              <span style={{ fontWeight: 'var(--font-medium)' }}>
                                {appt.doctor}
                              </span>
                            </div>
                          </td>
                          <td style={{ color: 'var(--color-gray-700)' }}>
                            {new Date(appt.scheduled_at).toLocaleDateString()}
                          </td>
                          <td style={{ color: 'var(--color-gray-700)' }}>
                            {new Date(appt.scheduled_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </td>
                          <td>
                            <span className={`badge ${
                              appt.status === 'scheduled' ? 'badge-primary' : 
                              appt.status === 'completed' ? 'badge-success' : 
                              'badge-gray'
                            }`}>
                              {appt.status}
                            </span>
                          </td>
                          <td>
                            <div className="table-actions">
                              <button 
                                className="btn btn-sm btn-primary"
                                onClick={() => openRescheduleModal(appt.id, appt.scheduled_at)}
                              >
                                Reschedule
                              </button>
                              <button 
                                className="btn btn-sm btn-danger"
                                onClick={() => cancelAppointment(appt.id)}
                              >
                                Cancel
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Reschedule Modal */}
      {showRescheduleModal && (
        <div className="modal">
          <div className="modal-dialog">
            <div className="modal-header">
              <h3 className="modal-title">Reschedule Appointment</h3>
              <button type="button" className="btn-close" onClick={() => setShowRescheduleModal(false)}></button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label className="form-label">New Date & Time</label>
                <input
                  type="datetime-local"
                  className="form-control"
                  value={newRescheduleTime}
                  onChange={(e) => setNewRescheduleTime(e.target.value)}
                />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowRescheduleModal(false)}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={submitReschedule}>
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PatientAppointments;
