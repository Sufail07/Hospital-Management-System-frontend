import RegisterPatient from "./Components/Credentials/RegisterPatient";
import {ToastContainer} from 'react-toastify';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import RegisterDoctor from "./Components/Credentials/RegisterDoctor";
import Login from "./Components/Credentials/Login";
import PatientAppointments from "./Components/Patient/Appointments";
import PatientDashboard from "./Components/Patient/Dashboard";
import Prescriptions from "./Components/Patient/Prescriptions";
import ProtectedRoute from "./Components/ProtectedRoute";
import PatientMedicalHistory from "./Components/Patient/MedicalHistory";
import DoctorDashboard from "./Components/Doctor/Dashboard";
import DoctorAppointments from "./Components/Doctor/Appointments";
import 'bootstrap/dist/css/bootstrap.min.css';
import PaymentSuccess from "./Components/Patient/PaymentSuccess";
import PaymentCancel from "./Components/Patient/PaymentCancel";
import ViewPatients from "./Components/Doctor/Patient";
import PaymentHistory from "./Components/Patient/PaymentHistory";
import AdminDashboard from "./Components/Admin/Dashboard";
import Users from "./Components/Admin/Users";
import AdminAppointments from "./Components/Admin/Appointments";


function App() {
  return (
    <div className="App">
      <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Login/>}/>
          <Route path='/PatientRegistration' element={<RegisterPatient/>}/>
          <Route path='/DoctorRegistration' element={<RegisterDoctor/>}/>

          <Route path='/patient/dashboard' element={
            <ProtectedRoute>
              <PatientDashboard/>
            </ProtectedRoute>
          }/>
          <Route path='/patient/appointments' element={
          <ProtectedRoute>
            <PatientAppointments/>
          </ProtectedRoute>
          }/>
          <Route path='/patient/history' element={
            <ProtectedRoute>
              <PatientMedicalHistory/>
            </ProtectedRoute>
          }/>
          <Route path='/patient/prescriptions' element={
            <ProtectedRoute>
              <Prescriptions/>
            </ProtectedRoute>
          }/>
          <Route path='/patient/payment-success' element={
            <ProtectedRoute>
              <PaymentSuccess/>
            </ProtectedRoute>
          }/>
          <Route path='/patient/payment-cancel' element={
            <ProtectedRoute>
              <PaymentCancel/>
            </ProtectedRoute>
          }/>
          <Route path='/patient/payments' element={
            <ProtectedRoute>
              <PaymentHistory/>
            </ProtectedRoute>
          }/>
          <Route path='/doctor/dashboard' element={
            <ProtectedRoute>
              <DoctorDashboard/>
            </ProtectedRoute>
          }/>
          <Route path='/doctor/appointments' element={
            <ProtectedRoute>
              <DoctorAppointments/>
            </ProtectedRoute>
          }/>
          <Route path='/doctor/patients' element={
            <ProtectedRoute>
              <ViewPatients/>
            </ProtectedRoute>
          }/>
          <Route path='/admin/dashboard' element={
            <ProtectedRoute>
              <AdminDashboard/>
            </ProtectedRoute>
          }/>
          <Route path='/admin/users' element={
            <ProtectedRoute>
              <Users/>
            </ProtectedRoute>
          }/>
          <Route path='/admin/appointments' element={
            <ProtectedRoute>
              <AdminAppointments/>
            </ProtectedRoute>
          }/>
        </Routes>
      </BrowserRouter>
      <ToastContainer/>
      </>
    </div>
  );
}

export default App;
