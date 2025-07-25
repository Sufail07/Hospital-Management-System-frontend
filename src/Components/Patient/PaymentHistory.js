import React, { useEffect, useState } from 'react';
import axiosInstance from '../axiosInstance';
import PatientNavbar from './Navbar';

function PaymentHistory() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const access = localStorage.getItem('access');
        const response = await axiosInstance.get('https://sufail07.pythonanywhere.com/api/patients/payments/', {
          headers: {
            Authorization: `Bearer ${access}`,
          },
        });
        setPayments(response.data);
        console.log(response.data);
      } catch (error) {
        console.error('Error fetching payment history:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, []);

  return (
    <div className="d-flex">
      {/* Sidebar */}
      <PatientNavbar />

      {/* Main content */}
      <div className="flex-grow-1 p-4">
        <h2 className="mb-4">Payment History</h2>
        {loading ? (
          <p>Loading...</p>
        ) : payments.length === 0 ? (
          <p>No payments found.</p>
        ) : (
          <div className="table-responsive">
            <table className="table table-bordered table-striped text-center">
              <thead className="table-light">
                <tr>
                  <th>#</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Prescription ID</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((payment, index) => (
                  <tr key={payment.id}>
                    <td>{index + 1}</td>
                    <td>₹{payment.amount}</td>
                    <td className={payment.status === 'paid' ? 'text-success' : 'text-danger'}>
                      {payment.status}
                    </td>
                    <td>{new Date(payment.created_at).toLocaleString()}</td>
                    <td>{payment.prescription?.id || 'N/A'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default PaymentHistory;
