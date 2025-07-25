import { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import axiosInstance from '../axiosInstance';

function PaymentSuccess() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const prescriptionId = params.get('prescription_id');

  useEffect(() =>{
    const confirmPayment = async() => {
        if (!prescriptionId) {
            toast.error("Missing prescription ID");
            navigate('/patient-dashboard');
            return;
          }
      
          try {
              const response = await axiosInstance.get(`https://sufail07.pythonanywhere.com/api/patients/payment-success/${prescriptionId}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('access')}`
                }
              });
              toast.success(response.data.message);
              navigate('/patient/dashboard');
          } catch(err) {
              toast.error('Error confirming payment');
              navigate('/patient/dashboard');
            }
        };
      
        confirmPayment();
    }, [prescriptionId]);
    
  return <p>Processing payment...</p>;
}

export default PaymentSuccess;
