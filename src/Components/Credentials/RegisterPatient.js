import React, { useState } from 'react'
import { toast } from 'react-toastify'
import { Link } from 'react-router'
import axiosInstance from '../axiosInstance'

function RegisterPatient() {
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
      const response = await axiosInstance.post('https://sufail07.pythonanywhere.com/api/patients/register/', formData);
      if (response.status === 200 || response.status === 201) {
        toast.success("Successfully registered patient", { position: 'top-center', theme: 'colored' })
        setFormData({})
      } else {
        toast.error("Failed to register patient", { position: 'top-center', theme: 'colored' })
      }
    } catch (error) {
      toast.error("Failed to register patient. Check credentials", { position: 'top-center', theme: 'colored' })
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
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h2 className="h4 fw-semibold text-dark mb-1">Patient Registration</h2>
                <p className="text-muted">Create your account to access healthcare services</p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit}>
                
                {/* Account Info */}
                <h5 className="fw-bold border-bottom pb-2 mb-3">Account Information</h5>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label">Username</label>
                    <input type="text" name="username" value={formData.username || ''} onChange={handleChange} className="form-control" placeholder="Choose a username" required />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Email</label>
                    <input type="email" name="email" value={formData.email || ''} onChange={handleChange} className="form-control" placeholder="your@email.com" required />
                  </div>
                  <div className="col-12">
                    <label className="form-label">Password</label>
                    <input type="password" name="password" value={formData.password || ''} onChange={handleChange} className="form-control" placeholder="Create a secure password" required />
                  </div>
                </div>

                {/* Personal Info */}
                <h5 className="fw-bold border-bottom pb-2 mt-4 mb-3">Personal Information</h5>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label">First Name</label>
                    <input type="text" name="first_name" value={formData.first_name || ''} onChange={handleChange} className="form-control" placeholder="First name" required />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Last Name</label>
                    <input type="text" name="last_name" value={formData.last_name || ''} onChange={handleChange} className="form-control" placeholder="Last name" required />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Date of Birth</label>
                    <input type="date" name="date_of_birth" value={formData.date_of_birth || ''} onChange={handleChange} className="form-control" required />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Gender</label>
                    <select name="gender" value={formData.gender || ''} onChange={handleChange} className="form-select" required>
                      <option value="">Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div className="col-12">
                    <label className="form-label">Address</label>
                    <textarea name="address" rows="3" value={formData.address || ''} onChange={handleChange} className="form-control" placeholder="Enter your full address" required />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Phone</label>
                    <input type="text" name="phone" value={formData.phone || ''} onChange={handleChange} className="form-control" placeholder="Phone number" required />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Emergency Contact</label>
                    <input type="text" name="emergency_contact" value={formData.emergency_contact || ''} onChange={handleChange} className="form-control" placeholder="Emergency contact number" />
                  </div>
                </div>

                {/* Medical Info */}
                <h5 className="fw-bold border-bottom pb-2 mt-4 mb-3">Medical Information</h5>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label">Blood Group</label>
                    <select name="blood_group" value={formData.blood_group || ''} onChange={handleChange} className="form-select">
                      <option value="">Select Blood Group</option>
                      {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => (
                        <option key={bg} value={bg}>{bg}</option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Insurance Provider</label>
                    <input type="text" name="insurance_provider" value={formData.insurance_provider || ''} onChange={handleChange} className="form-control" placeholder="Insurance provider name" />
                  </div>
                  <div className="col-12">
                    <label className="form-label">Insurance Number</label>
                    <input type="text" name="insurance_number" value={formData.insurance_number || ''} onChange={handleChange} className="form-control" placeholder="Insurance policy number" />
                  </div>
                </div>

                {/* Submit */}
                <button type="submit" className="btn btn-dark w-100 mt-4" disabled={isLoading}>
                  {isLoading ? (
                    <span><div className="spinner-border spinner-border-sm me-2"></div> Registering...</span>
                  ) : (
                    'Register Patient'
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

export default RegisterPatient
