import React, { useEffect, useState } from 'react'
import axios from 'axios';
import {toast} from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';
import PatientNavbar from './Navbar';
import axiosInstance from '../axiosInstance';

function PatientDashboard() {
  const [patientName, setPatientName] = useState('')

  useEffect(() => {
    const fetchPatient = async() => {
        const token = localStorage.getItem('access')
        console.log(token)
        try {
          const response = await axiosInstance.get('https://sufail07.pythonanywhere.com/api/patients/patient/me/', {
          headers: {
            Authorization: `Bearer ${token}`
          },
        });
        const user = response.data;
        console.log(response.data)
        console.log(user.full_name)
        setPatientName(user.full_name);
        } catch(error) {
          console.log('Failed to fetch patient', error)
          toast.error('Failed to fetch patient', {
            position: 'top-center',
            theme: 'colored'
          })
        }
      }
    
    fetchPatient();
  }, [])

  return (
    <div className="d-flex">
      <PatientNavbar />
      <div className="flex-grow-1 p-5">
        <h3>Hello, {patientName}!</h3>
        <p>Welcome to your dashboard. Select an option from the menu.</p>
      </div>
    </div>
  )
}

export default PatientDashboard;
