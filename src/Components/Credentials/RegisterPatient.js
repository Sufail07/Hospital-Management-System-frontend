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
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, var(--color-primary-50) 0%, var(--color-secondary-50) 100%)',
      padding: 'var(--space-8) var(--space-4)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div style={{ width: '100%', maxWidth: '900px' }}>
        <div className="card fade-in" style={{ overflow: 'visible' }}>
          <div className="card-body" style={{ padding: 'var(--space-8)' }}>
            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: 'var(--space-8)' }}>
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: 'var(--radius-xl)',
                background: 'linear-gradient(135deg, var(--color-primary-500), var(--color-primary-600))',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto var(--space-4)',
                boxShadow: '0 4px 12px rgba(13, 148, 136, 0.3)'
              }}>
                <svg width="32" height="32" fill="none" stroke="white" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h2 style={{ 
                fontSize: 'var(--text-3xl)', 
                fontWeight: 'var(--font-bold)',
                color: 'var(--color-gray-900)',
                marginBottom: 'var(--space-2)'
              }}>
                Patient Registration
              </h2>
              <p style={{ 
                color: 'var(--color-gray-600)',
                fontSize: 'var(--text-base)',
                margin: 0
              }}>
                Create your account to access healthcare services
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit}>
              
              {/* Account Info */}
              <div style={{ marginBottom: 'var(--space-6)' }}>
                <h5 style={{ 
                  fontSize: 'var(--text-lg)',
                  fontWeight: 'var(--font-semibold)',
                  color: 'var(--color-gray-900)',
                  marginBottom: 'var(--space-4)',
                  paddingBottom: 'var(--space-2)',
                  borderBottom: '2px solid var(--color-gray-200)'
                }}>
                  Account Information
                </h5>
                <div className="grid grid-2" style={{ gap: 'var(--space-4)' }}>
                  <div className="form-group">
                    <label className="form-label">Username</label>
                    <input 
                      type="text" 
                      name="username" 
                      value={formData.username || ''} 
                      onChange={handleChange} 
                      className="form-control" 
                      placeholder="Choose a username" 
                      required 
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Email</label>
                    <input 
                      type="email" 
                      name="email" 
                      value={formData.email || ''} 
                      onChange={handleChange} 
                      className="form-control" 
                      placeholder="your@email.com" 
                      required 
                    />
                  </div>
                  <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                    <label className="form-label">Password</label>
                    <input 
                      type="password" 
                      name="password" 
                      value={formData.password || ''} 
                      onChange={handleChange} 
                      className="form-control" 
                      placeholder="Create a secure password" 
                      required 
                    />
                  </div>
                </div>
              </div>

              {/* Personal Info */}
              <div style={{ marginBottom: 'var(--space-6)' }}>
                <h5 style={{ 
                  fontSize: 'var(--text-lg)',
                  fontWeight: 'var(--font-semibold)',
                  color: 'var(--color-gray-900)',
                  marginBottom: 'var(--space-4)',
                  paddingBottom: 'var(--space-2)',
                  borderBottom: '2px solid var(--color-gray-200)'
                }}>
                  Personal Information
                </h5>
                <div className="grid grid-2" style={{ gap: 'var(--space-4)' }}>
                  <div className="form-group">
                    <label className="form-label">First Name</label>
                    <input 
                      type="text" 
                      name="first_name" 
                      value={formData.first_name || ''} 
                      onChange={handleChange} 
                      className="form-control" 
                      placeholder="First name" 
                      required 
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Last Name</label>
                    <input 
                      type="text" 
                      name="last_name" 
                      value={formData.last_name || ''} 
                      onChange={handleChange} 
                      className="form-control" 
                      placeholder="Last name" 
                      required 
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Date of Birth</label>
                    <input 
                      type="date" 
                      name="date_of_birth" 
                      value={formData.date_of_birth || ''} 
                      onChange={handleChange} 
                      className="form-control" 
                      required 
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Gender</label>
                    <select 
                      name="gender" 
                      value={formData.gender || ''} 
                      onChange={handleChange} 
                      className="form-select" 
                      required
                    >
                      <option value="">Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                    <label className="form-label">Address</label>
                    <textarea 
                      name="address" 
                      rows="3" 
                      value={formData.address || ''} 
                      onChange={handleChange} 
                      className="form-control" 
                      placeholder="Enter your full address" 
                      required 
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Phone</label>
                    <input 
                      type="text" 
                      name="phone" 
                      value={formData.phone || ''} 
                      onChange={handleChange} 
                      className="form-control" 
                      placeholder="Phone number" 
                      required 
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Emergency Contact</label>
                    <input 
                      type="text" 
                      name="emergency_contact" 
                      value={formData.emergency_contact || ''} 
                      onChange={handleChange} 
                      className="form-control" 
                      placeholder="Emergency contact number" 
                    />
                  </div>
                </div>
              </div>

              {/* Medical Info */}
              <div style={{ marginBottom: 'var(--space-6)' }}>
                <h5 style={{ 
                  fontSize: 'var(--text-lg)',
                  fontWeight: 'var(--font-semibold)',
                  color: 'var(--color-gray-900)',
                  marginBottom: 'var(--space-4)',
                  paddingBottom: 'var(--space-2)',
                  borderBottom: '2px solid var(--color-gray-200)'
                }}>
                  Medical Information
                </h5>
                <div className="grid grid-2" style={{ gap: 'var(--space-4)' }}>
                  <div className="form-group">
                    <label className="form-label">Blood Group</label>
                    <select 
                      name="blood_group" 
                      value={formData.blood_group || ''} 
                      onChange={handleChange} 
                      className="form-select"
                    >
                      <option value="">Select Blood Group</option>
                      {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => (
                        <option key={bg} value={bg}>{bg}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Insurance Provider</label>
                    <input 
                      type="text" 
                      name="insurance_provider" 
                      value={formData.insurance_provider || ''} 
                      onChange={handleChange} 
                      className="form-control" 
                      placeholder="Insurance provider name" 
                    />
                  </div>
                  <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                    <label className="form-label">Insurance Number</label>
                    <input 
                      type="text" 
                      name="insurance_number" 
                      value={formData.insurance_number || ''} 
                      onChange={handleChange} 
                      className="form-control" 
                      placeholder="Insurance policy number" 
                    />
                  </div>
                </div>
              </div>

              {/* Submit */}
              <button 
                type="submit" 
                className="btn btn-primary btn-block" 
                disabled={isLoading}
                style={{ marginTop: 'var(--space-4)' }}
              >
                {isLoading ? (
                  <>
                    <span className="spinner" style={{ marginRight: 'var(--space-2)' }}></span>
                    Registering...
                  </>
                ) : (
                  <>
                    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" style={{ marginRight: 'var(--space-2)' }}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                    </svg>
                    Register Patient
                  </>
                )}
              </button>
            </form>

            {/* Login link */}
            <div style={{ textAlign: 'center', marginTop: 'var(--space-6)' }}>
              <p style={{ color: 'var(--color-gray-600)', fontSize: 'var(--text-sm)', margin: 0 }}>
                Already registered?{' '}
                <Link 
                  to="/" 
                  style={{ 
                    color: 'var(--color-primary-600)',
                    fontWeight: 'var(--font-semibold)',
                    textDecoration: 'none'
                  }}
                >
                  Login here →
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RegisterPatient
