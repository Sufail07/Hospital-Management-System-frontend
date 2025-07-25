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

      console.log('=== FORM SUBMISSION DEBUG ===');
      console.log('selectedDoctor (raw):', selectedDoctor, typeof selectedDoctor);
      console.log('appointmentTime (raw):', appointmentTime, typeof appointmentTime);
      console.log('selectedDoctor empty check:', !selectedDoctor);
      console.log('appointmentTime empty check:', !appointmentTime);

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

        console.log("Sending to server")
        console.log('Payload: ', JSON.stringify(payload, null, 2))
        console.log('Token exists: ', !!token)
        

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
    <>
     <div className="d-flex">
      <Navbar />
      <div className="flex-grow-1 p-5">
        <h3 className="mb-4">My Appointments</h3>

        <form onSubmit={handleSubmit} className="mb-5">
          <h5>Book a New Appointment</h5>
          <div className="mb-3">
            <label className="form-label">Select Doctor</label>
            <select
              className="form-select"
              value={selectedDoctor}
              onChange={(e) => {
                console.log('=== DOCTOR SELECTION ===');
                console.log('Selected value:', e.target.value);
                console.log('Selected value type:', typeof e.target.value);
                console.log('Available doctors:', doctors.map(d => ({ id: d.user_id, name: `${d.user?.first_name} ${d.user?.last_name}` })));
                setSelectedDoctor(e.target.value);
              }}
            >
              <option value="">-- Choose Doctor --</option>
              {doctors.map((doc) => (
                <option key={doc.id} value={String(doc.id)}>
                  Dr.{doc.user?.first_name} {doc.user?.last_name} - {doc.specialization}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-3">
            <label className="form-label">Appointment Time</label>
            <input
              type="datetime-local"
              className="form-control"
              value={appointmentTime}
              onChange={(e) => setAppointmentTime(e.target.value)}
            />
          </div>

          <button className="btn btn-primary">Create Appointment</button>
        </form>

        <hr />

        <h5>Upcoming Appointments</h5>
        {appointments.length === 0 ? (
          <p>No appointments found.</p>
        ) : (
          <table className="table table-bordered mt-3">
            <thead>
              <tr>
                <th>#</th>
                <th>Doctor</th>
                <th>Date</th>
                <th>Time</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((appt, index) => (
                <tr key={appt.id}>
                  <td>{index + 1}</td>
                  <td>
                    {appt.doctor}
                  </td>
                  <td>{new Date(appt.scheduled_at).toLocaleDateString()}</td>
                  <td>{new Date(appt.scheduled_at).toLocaleTimeString()}</td>
                  <td>{appt.status}</td>
                  <td>
                    <button className='btn btn-primary btn-sm' onClick={()=>{openRescheduleModal(appt.id, appt.scheduled_at)}}>Reschedule</button>
                    <button className='btn btn-danger btn-sm' onClick={()=>{cancelAppointment(appt.id)}}>Cancel</button>

                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      {showRescheduleModal && (
      <div className="modal show d-block" tabIndex="-1" role="dialog">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Reschedule Appointment</h5>
              <button type="button" className="btn-close" onClick={() => setShowRescheduleModal(false)}></button>
            </div>
            <div className="modal-body">
              <label className="form-label">New Date & Time</label>
              <input
                type="datetime-local"
                className="form-control"
                value={newRescheduleTime}
                onChange={(e) => setNewRescheduleTime(e.target.value)}
              />
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowRescheduleModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={submitReschedule}>Submit</button>
            </div>
          </div>
        </div>
      </div>
    )}

    </div>
    </>
  )
}

export default PatientAppointments;