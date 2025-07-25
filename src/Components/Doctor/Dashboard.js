import React, { useEffect, useState } from 'react';
import axiosInstance from '../axiosInstance';
import DoctorNavbar from './Navbar';
import { Link } from 'react-router-dom';

function DoctorDashboard() {
  const [todayAppointments, setTodayAppointments] = useState([]);

  useEffect(() => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    const formattedToday = `${yyyy}-${mm}-${dd}`;
    const fetchTodayAppointments = async () => {
      const token = localStorage.getItem('access');
      try {
        const response = await axiosInstance.get(`https://sufail07.pythonanywhere.com/api/doctors/appointments/?${formattedToday}/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log('API response, ', response.data)
        setTodayAppointments(response.data);
      } catch (error) {
        console.log('Failed to fetch today appointments', error);
      }
    };

    fetchTodayAppointments();
  }, []);

  return (
    <div className="d-flex">
      <DoctorNavbar />
      <div className="flex-grow-1 p-5">
        <div className="row">
          <div className="col-12">
            <div className="card">
              <div className="card-header d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Today's Appointments</h5>
              </div>
              <div className="card-body">
                {todayAppointments.length === 0 ? (
                  <p className="text-muted">No appointments scheduled for today.</p>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-hover">
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>Patient</th>
                          <th>Time</th>
                        </tr>
                      </thead>
                      <tbody>
                        {todayAppointments.slice(0, 5).map((appointment, index) => (
                          <tr key={appointment.id}>
                            <td>{index + 1}</td>
                            <td>
                              {appointment.patient_name}
                            </td>
                            <td>
                              {new Date(appointment.scheduled_at).toLocaleTimeString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {todayAppointments.length > 5 && (
                      <p className="text-muted text-center mt-3">
                        Showing 5 of {todayAppointments.length} appointments.
                        <Link to="/doctor/appointments" className="ms-2">View all</Link>
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DoctorDashboard;
