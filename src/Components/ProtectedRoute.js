import React from 'react'
import { Navigate } from 'react-router-dom'


function ProtectedRoute({ children }) {
    const token = localStorage.getItem('access')
    if (!token) {
        return <Navigate to='/' replace/>
    }
  return children;
}

export default ProtectedRoute
