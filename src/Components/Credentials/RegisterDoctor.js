import React, { useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { Link } from 'react-router'
import axiosInstance from '../axiosInstance'


function RegisterDoctor() {
  const [formData, setFormData] = useState({})
  
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
      const response = await axiosInstance.post('https://sufail07.pythonanywhere.com/api/doctors/register/', formData)
      if (response.status == 201 || response.status == 200) {
        toast.success("Succesfully registered doctor", {
          position: 'top-center',
          theme: 'colored'
        })
        console.log('Successfully registered doctor')
        setFormData({})
      }
      else {
        toast.error("Failed to register doctor", {
          position: 'top-center',
          theme: 'colored'
        })
        console.log('Failed to register doctor API error');
      }
    } catch(error) {
      toast.error("Registration failed.", {
        position: 'top-center',
        theme: 'colored'
      })
      if (error.response) {
        console.log('Error response: ', error.response.data);
        console.log(formData);
      } else {
        console.log("Error: ", error.message)
      }
      
    }
  }

  return (
    <>
      <div className="container mt-5">
      <div className="card shadow-sm">
        <div className="card-body">
          <h2 className="card-title mb-4">Doctor Registration</h2>


          <form onSubmit={handleSubmit}>
            
            <div className="mb-3">
              <label className="form-label">Username</label>
              <input name="username" className="form-control" required onChange={handleChange} />
            </div>

            <div className="mb-3">
              <label className="form-label">Email</label>
              <input name="email" type="email" className="form-control" required onChange={handleChange} />
            </div>

            <div className="mb-3">
              <label className="form-label">Password</label>
              <input name="password" type="password" className="form-control" required onChange={handleChange} />
            </div>

            <div className="mb-3">
              <label className="form-label">First Name</label>
              <input name="first_name" className="form-control" required onChange={handleChange} />
            </div>

            <div className="mb-3">
              <label className="form-label">Last Name</label>
              <input name="last_name" className="form-control" required onChange={handleChange} />
            </div>

            <div className="mb-3">
              <label className="form-label">Specialization</label>
              <input name="specialization" className="form-control" required onChange={handleChange} />
            </div>

            <div className="mb-3">
              <label className="form-label">Phone</label>
              <input name="phone" className="form-control" required onChange={handleChange} />
            </div>

            <div className="mb-3">
              <label className="form-label">Qualification</label>
              <input name="qualification" className="form-control" onChange={handleChange} />
            </div>

            <div className="mb-3">
              <label className="form-label">Experience (Years)</label>
              <input name="experience_years" type="number" className="form-control" onChange={handleChange} />
            </div>

            <div className="mb-3">
              <label className="form-label">License Number</label>
              <input name="license_number" className="form-control" required onChange={handleChange} />
            </div>

            <div className="mb-3">
              <label className="form-label">Consultation Fee (₹)</label>
              <input name="consultation_fee" type="number" step="0.01" className="form-control" onChange={handleChange} />
            </div>

            <div className="mb-3">
              <label className="form-label">Available From</label>
              <input name="available_from" type="time" className="form-control" onChange={handleChange} />
            </div>

            <div className="mb-3">
              <label className="form-label">Available To</label>
              <input name="available_to" type="time" className="form-control" onChange={handleChange} />
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

export default RegisterDoctor
