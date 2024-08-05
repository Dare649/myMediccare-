import React, { useState } from 'react';
import PatientData from './PatientData';
import CreatePassword from './CreatePassword';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import { axiosClient } from '../../axios';

const Signup = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    country: '',
    country_code: '',
    phone: '',
    role: 'patient',
    password: ''
  });
  const MySwal = withReactContent(Swal);
  const [loading, setLoading] = useState(false);

  const handleNext = () => setStep(prevStep => prevStep + 1);
  const handlePrev = () => setStep(prevStep => prevStep - 1);

  const handleSubmit = async e => {
    e.preventDefault();
    
    try {
      setLoading(true);
      // Simulated API call; replace with actual endpoint and data
      const response = await axiosClient.post('/api/register', formData);
      setLoading(false);
      MySwal.fire({
        title: 'Success',
        icon: 'success',
        text: 'Account created successfully!'
      });
      console.log('Response:', response.data); // Log response data
    } catch (error) {
      setLoading(false);
      console.error('Error:', error);
      MySwal.fire({
        title: 'Error',
        icon: 'error',
        text: 'Error creating account, please try again.'
      });
    }
  };

  return (
    <section className="w-full h-full">
      <div className="w-full h-full">
        {step === 1 && (
          <PatientData
            nextStep={handleNext}
            formData={formData}
            setFormData={setFormData}
          />
        )}
        {step === 2 && (
          <CreatePassword
            formData={formData}
            prevStep={handlePrev}
            setFormData={setFormData}
            handleSubmit={handleSubmit} // Pass handleSubmit to CreatePassword
          />
        )}
      </div>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </section>
  );
};

export default Signup;
