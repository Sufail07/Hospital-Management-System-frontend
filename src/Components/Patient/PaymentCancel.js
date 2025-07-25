import { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import axiosInstance from '../axiosInstance';

function PaymentCancel() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const prescriptionId = params.get('prescription_id');

  useEffect(() => {
    const cancelPayment = async () => {
        if (!prescriptionId) {
            toast.error("Missing prescription ID");
            navigate('/patient/dashboard');
            return;
          }
        try {
            const response = await axiosInstance.get(`https://sufail07.pythonanywhere.com/api/patients/payment-cancel/${prescriptionId}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('access')}`
            }
          });
              toast.info(response.data.message || "Payment cancelled.");
              navigate('/patient/dashboard');
        }catch(err) {
              toast.error("Error handling payment cancellation.");
              navigate('/patient/dashboard');
            }
    };

    cancelPayment();
  }, [prescriptionId]);

  return <p>Handling payment cancellation...</p>;
}

export default PaymentCancel;
