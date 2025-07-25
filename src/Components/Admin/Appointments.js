import React, { useEffect, useState } from 'react';
import axiosInstance from '../axiosInstance';
import { toast } from 'react-toastify';
import AdminNavbar from './Navbar';

function AdminAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [newDateTime, setNewDateTime] = useState('');

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get('https://sufail07.pythonanywhere.com/api/admin/appointment/', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access')}`
        }
      });
      setAppointments(response.data);
    } catch (error) {
      toast.error('Failed to fetch appointments');
    } finally {
      setLoading(false);
    }
  };

  const formatDateTimeLocal = (dateStr) => {
    const date = new Date(dateStr);
    const offset = date.getTimezoneOffset();
    const localDate = new Date(date.getTime() - offset * 60000);
    return localDate.toISOString().slice(0, 16);
  };
  

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this appointment?')) return;

    try {
      await axiosInstance.delete(`https://sufail07.pythonanywhere.com/api/admin/appointment/${id}/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access')}`
        }
      });
      toast.success('Appointment deleted successfully');
      fetchAppointments();
    } catch (error) {
      toast.error('Failed to delete appointment');
    }
  };

  const handleEditClick = (appointment) => {
    setSelectedAppointment(appointment);
    setNewDateTime(appointment.scheduled_at);
    setShowModal(true);
  };

  const handleEditSubmit = async () => {
    if (!newDateTime || !selectedAppointment) return;

    try {
      await axiosInstance.put(
        `https://sufail07.pythonanywhere.com/api/admin/appointment/${selectedAppointment.id}/`,
        { scheduled_at: newDateTime },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access')}`
          }
        }
      );
      toast.success('Appointment updated successfully');
      setShowModal(false);
      fetchAppointments();
    } catch (error) {
      toast.error('Failed to update appointment');
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  return (
    <div className="d-flex">
      <div style={{ width: '200px', minWidth: '180px' }} className='bg-light border-end'>
        <AdminNavbar />
      </div>
      <div className="container mt-5">
        <h3>Manage Appointments</h3>
        {loading ? (
          <p>Loading...</p>
        ) : appointments.length === 0 ? (
          <p>No appointments found.</p>
        ) : (
          <table className="table table-bordered mt-3">
            <thead className="thead-dark">
              <tr>
                <th>#</th>
                <th>Patient</th>
                <th>Doctor</th>
                <th>Scheduled At</th>
                <th>Prescription Given</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((appt, index) => (
                <tr key={appt.id}>
                  <td>{index + 1}</td>
                  <td>{appt.patient_name}</td>
                  <td>{appt.doctor_name || 'N/A'}</td>
                  <td>{new Date(appt.scheduled_at).toLocaleString()}</td>
                  <td>{appt.prescription_given ? 'Yes' : 'No'}</td>
                  <td>{appt.status ? 'Completed' : 'Active'}</td>
                  <td>
                    <button className="btn btn-sm btn-primary me-2" onClick={() => handleEditClick(appt)}>
                      Edit
                    </button>
                    <button className="btn btn-sm btn-danger" onClick={() => handleDelete(appt.id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Edit Modal */}
      {showModal && (
        <div className="modal show fade d-block" tabIndex="-1" role="dialog">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit Appointment</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <div className="modal-body">
                <label>New Date & Time:</label>
                <input
                  type="datetime-local"
                  className="form-control"
                  value={formatDateTimeLocal(newDateTime)}
                  onChange={(e) => setNewDateTime(e.target.value)}
                />
              </div>
              <div className="modal-footer">
                <button onClick={handleEditSubmit} className="btn btn-success">Save</button>
                <button onClick={() => setShowModal(false)} className="btn btn-secondary">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminAppointments;
