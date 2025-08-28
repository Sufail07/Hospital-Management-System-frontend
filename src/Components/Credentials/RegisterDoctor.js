import React, { useState } from 'react'
import { toast } from 'react-toastify'
import { Link } from 'react-router'
import axiosInstance from '../axiosInstance'

function RegisterDoctor() {
  const [formData, setFormData] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  
  const handleChange = (e) => {
    const {name, value} = e.target; 
    setFormData({
      ...formData,
      [name]: value
    });
  }

  const handleSubmit = async(e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await axiosInstance.post('https://sufail07.pythonanywhere.com/api/doctors/register/', formData)
      if (response.status === 201 || response.status === 200) {
        toast.success("Successfully registered doctor", { position: 'top-center', theme: 'colored' })
        setFormData({})
      } else {
        toast.error("Failed to register doctor", { position: 'top-center', theme: 'colored' })
      }
    } catch(error) {
      toast.error("Registration failed.", { position: 'top-center', theme: 'colored' })
      console.log(error.response ? error.response.data : error.message)
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="card shadow-lg border-0 rounded-3">
            <div className="card-body p-4">
              {/* Header */}
              <div className="text-center mb-4">
                <div className="bg-dark rounded-3 d-flex align-items-center justify-content-center mx-auto mb-3" style={{ width: '50px', height: '50px' }}>
                  <svg className="text-white" width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h2 className="h4 fw-semibold text-dark mb-1">Doctor Registration</h2>
                <p className="text-muted">Create your professional account</p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit}>

                {/* Personal Info */}
                <h5 className="fw-bold border-bottom pb-2 mb-3">Personal Information</h5>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label">Username</label>
                    <input name="username" value={formData.username || ''} onChange={handleChange} className="form-control" placeholder="Choose a username" required />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Email</label>
                    <input type="email" name="email" value={formData.email || ''} onChange={handleChange} className="form-control" placeholder="your@email.com" required />
                  </div>
                  <div className="col-12">
                    <label className="form-label">Password</label>
                    <input type="password" name="password" value={formData.password || ''} onChange={handleChange} className="form-control" placeholder="Create a secure password" required />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">First Name</label>
                    <input name="first_name" value={formData.first_name || ''} onChange={handleChange} className="form-control" placeholder="First name" required />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Last Name</label>
                    <input name="last_name" value={formData.last_name || ''} onChange={handleChange} className="form-control" placeholder="Last name" required />
                  </div>
                  <div className="col-12">
                    <label className="form-label">Phone</label>
                    <input name="phone" value={formData.phone || ''} onChange={handleChange} className="form-control" placeholder="Phone number" required />
                  </div>
                </div>

                {/* Professional Info */}
                <h5 className="fw-bold border-bottom pb-2 mt-4 mb-3">Professional Information</h5>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label">Specialization</label>
                    <input name="specialization" value={formData.specialization || ''} onChange={handleChange} className="form-control" placeholder="e.g., Cardiology" required />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">License Number</label>
                    <input name="license_number" value={formData.license_number || ''} onChange={handleChange} className="form-control" placeholder="Medical license number" required />
                  </div>
                  <div className="col-12">
                    <label className="form-label">Qualification</label>
                    <input name="qualification" value={formData.qualification || ''} onChange={handleChange} className="form-control" placeholder="e.g., MBBS, MD" />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Experience (Years)</label>
                    <input type="number" name="experience_years" value={formData.experience_years || ''} onChange={handleChange} className="form-control" placeholder="Years of experience" min="0" />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Consultation Fee (₹)</label>
                    <input type="number" step="0.01" name="consultation_fee" value={formData.consultation_fee || ''} onChange={handleChange} className="form-control" placeholder="Fee amount" min="0" />
                  </div>
                </div>

                {/* Availability */}
                <h5 className="fw-bold border-bottom pb-2 mt-4 mb-3">Availability</h5>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label">Available From</label>
                    <input type="time" name="available_from" value={formData.available_from || ''} onChange={handleChange} className="form-control" />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Available To</label>
                    <input type="time" name="available_to" value={formData.available_to || ''} onChange={handleChange} className="form-control" />
                  </div>
                </div>

                {/* Submit */}
                <button type="submit" className="btn btn-dark w-100 mt-4" disabled={isLoading}>
                  {isLoading ? (
                    <span><div className="spinner-border spinner-border-sm me-2"></div> Registering...</span>
                  ) : (
                    'Register Doctor'
                  )}
                </button>
              </form>

              {/* Login link */}
              <div className="text-center mt-3">
                <p className="text-muted small">Already registered? <Link to="/" className="fw-bold text-dark">Login here</Link></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RegisterDoctor
