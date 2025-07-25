import React, { useState } from 'react'
import axios from 'axios';
import { toast } from 'react-toastify'
import { Link } from 'react-router';
import axiosInstance from '../axiosInstance';

function RegisterPatient() {
  const [formData, setFormData] = useState({})
  const [message, setMessage] = useState(null)

  const handleChange = (e) => {
    const {name, value} = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  }

  const handleSubmit = async(e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post('https://sufail07.pythonanywhere.com/api/patients/register/', formData);
      if (response.status == 200 || response.status == 201) {
        toast.success("Succesfully registered patient", {
          position: 'top-center',
          theme: 'colored'
        })
        setFormData({})
        console.log("Successfully registered Patient")
      }
      else {
        toast.error("Failed to register patient", {
          position: 'top-center',
          theme: 'colored'
        })
        console.log("Failed to register patient: API error")        
      }
    } catch (error) {
      if (error.response) {
        console.log('Error response: ', error.response.data);
        console.log(formData);
      } else {
        console.log("Error: ", error.message)
      }
      toast.error("Failed to register patient. Check credentials", {
        position: 'top-center',
        theme: 'colored'
      })
    }
  }

  return (
    <>
      <div className="container mt-5">
      <div className="card shadow-sm">
        <div className="card-body">
          <h2 className="card-title mb-4">Patient Registration</h2>

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Username</label>
              <input type="text" className="form-control" name="username" required onChange={handleChange} />
            </div>

            <div className="mb-3">
              <label className="form-label">Email</label>
              <input type="email" className="form-control" name="email" required onChange={handleChange} />
            </div>

            <div className="mb-3">
              <label className="form-label">Password</label>
              <input type="password" className="form-control" name="password" required onChange={handleChange} />
            </div>

            <div className="mb-3">
              <label className="form-label">First Name</label>
              <input type="text" className="form-control" name="first_name" required onChange={handleChange} />
            </div>

            <div className="mb-3">
              <label className="form-label">Last Name</label>
              <input type="text" className="form-control" name="last_name" required onChange={handleChange} />
            </div>

            <div className="mb-3">
              <label className="form-label">Date of Birth</label>
              <input type="date" className="form-control" name="date_of_birth" required onChange={handleChange} />
            </div>

            <div className="mb-3">
              <label className="form-label">Gender</label>
              <select className="form-select" name="gender" required onChange={handleChange}>
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="mb-3">
              <label className="form-label">Address</label>
              <textarea className="form-control" name="address" required onChange={handleChange}></textarea>
            </div>

            <div className="mb-3">
              <label className="form-label">Phone</label>
              <input type="text" className="form-control" name="phone" required onChange={handleChange} />
            </div>

            <div className="mb-3">
              <label className="form-label">Emergency Contact</label>
              <input type="text" className="form-control" name="emergency_contact" onChange={handleChange} />
            </div>

            <div className="mb-3">
              <label className="form-label">Blood Group</label>
              <select className="form-select" name="blood_group" onChange={handleChange}>
                <option value="">Select Blood Group</option>
                {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => (
                  <option key={bg} value={bg}>{bg}</option>
                ))}
              </select>
            </div>

            <div className="mb-3">
              <label className="form-label">Insurance Provider</label>
              <input type="text" className="form-control" name="insurance_provider" onChange={handleChange} />
            </div>

            <div className="mb-3">
              <label className="form-label">Insurance Number</label>
              <input type="text" className="form-control" name="insurance_number" onChange={handleChange} />
            </div>

            <button type="submit" className="btn btn-primary w-100">Register</button>
          </form>
        </div>
        <div className="mt-3 text-center">
      <p>Already Registered? <Link to="/">Login here</Link><br></br>
        </p>
    </div>
      </div>
    </div>
    </>
  )
}

export default RegisterPatient;
