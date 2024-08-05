import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../../assets/images/logo.png';
import google from '../../assets/icons/google.jpg';
import doctor from '../../assets/images/doctor-1.png';
import Slider from '../../components/slider';
import { aerialCode } from '../../components/dummy';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

const PatientData = () => {
  const [errors, setErrors] = useState({});
  const MySwal = withReactContent(Swal);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    country: "",
    role: "patient",
    country_code: "",
    phone: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleNext = () => {
    const newErrors = validate();

    if (Object.keys(newErrors).length === 0) {
      sessionStorage.setItem('formData', JSON.stringify(formData));
      navigate('/create-password');
    } else {
      MySwal.fire({
        title: 'Error',
        icon: 'error',
        text: 'Fill the fields to proceed.'
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleNext();
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.name) {
      newErrors.name = 'Required';
    } else if (formData.name.length > 50) {
      newErrors.name = 'Must be 50 characters or less.';
    }

    if (!formData.email) {
      newErrors.email = 'Required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email address';
    }

    if (!formData.country) {
      newErrors.country = 'Required';
    }

    if (!formData.country_code) {
      newErrors.country_code = 'Required';
    }

    setErrors(newErrors);
    return newErrors;
  };

  return (
    <section className="w-full h-screen bg-white">
      <div className="lg:mx-8 sm:px-3 sm:py-5 lg:py-0 flex flex-row justify-between h-full">
        <div className="registration overflow-y-auto h-full lg:w-[40%] sm:w-full custom-scrollbar-container sm:py-0 lg:py-5">
          <div className="flex-col align-middle justify-center h-full">
            <div className="logo">
              <img src={logo} alt="MyMedicare" className="w-[20%]" />
            </div>
            <div className="topText py-2">
              <h2 className="text-3xl text-neutral-100 font-semibold capitalize">create account</h2>
              <p className="text-neutral-50 first-letter:capitalize leading-relaxed tracking-wide">join us to explore our services</p>
            </div>
            <div className="googleSignup sm:w-full rounded-lg border-2 border-neutral-50 cursor-pointer">
              <div className="flex flex-row items-center justify-center space-x-1 py-4 ">
                <img src={google} alt="MyMedicare" />
                <p className="first-letter:capitalize last-letter:capitalize text-neutral-50">continue with google</p>
              </div>
            </div>
            <p className="flex flex-col items-center justify-center py-2 text-neutral-50 my-1">or</p>
            <div className="signupForm w-full">
              <form onSubmit={handleSubmit}>
                <div className="name flex flex-col mb-2 w-full">
                  <label className="capitalize text-neutral-100 text-xl font-semibold mb-2">name</label>
                  <input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    type="text"
                    placeholder="John Doe"
                    className="outline-none border-2 border-neutral-50 p-2 w-full text-lg font-medium rounded-lg focus:border-primary-100"
                  />
                  {errors.name && <p className="text-red-500 text-sm font-bold">{errors.name}</p>}
                </div>

                <div className="email flex flex-col mb-2">
                  <label className="capitalize text-neutral-100 text-xl font-semibold mb-2">email</label>
                  <input
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    type="text"
                    placeholder="Jessie@email.com"
                    className="outline-none border-2 border-neutral-50 p-2 w-full text-lg font-medium rounded-lg focus:border-primary-100"
                  />
                  {errors.email && <p className="text-red-500 text-sm font-bold">{errors.email}</p>}
                </div>

                <div className="contact flex flex-row items-center mb-2 w-full space-x-3">
                  <div className="country_code w-[30%]">
                    <label className="capitalize text-neutral-100 text-xl font-semibold">
                      country code
                    </label>
                    <select
                      id="country_code"
                      name="country_code"
                      value={formData.country_code}
                      onChange={handleChange}
                      className="outline-none border-2 border-neutral-50 p-[10px] cursor-pointer w-full text-lg font-medium rounded-lg focus:border-primary-100"
                    >
                      {aerialCode.map((item, id) => (
                        <option key={id} value={item.code}>
                          {item.code}
                        </option>
                      ))}
                    </select>
                    {errors.country_code && <p className="text-red-500 text-sm font-bold">{errors.country_code}</p>}
                  </div>
                  <div className="phone w-[70%]">
                    <label className="capitalize text-neutral-100 text-xl font-semibold">
                      phone number
                    </label>
                    <input
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      type="text"
                      placeholder="0000 000 0000"
                      className="outline-none border-2 border-neutral-50 p-2 w-full text-lg font-medium rounded-lg focus:border-primary-100 sm:mt-7 lg:mt-0 md:mt-0"
                    />
                  </div>
                </div>

                <div className="terms flex flex-row space-x-3 mb-2">
                  <input type="checkbox" className="w-5" />
                  <p className="first-letter:capitalize text-md text-neutral-50">
                    I agree to the{' '}
                    <span>
                      <Link className="text-primary-100" to={'/terms-&-conditions'}>
                        terms & conditions
                      </Link>
                    </span>
                  </p>
                </div>
                <div className="createAccount w-full text-center">
                  <button
                    type="submit"
                    className="font-bold capitalize text-lg outline-none hover:border-2 active:border-2 bg-primary-100 rounded-lg text-white w-full hover:bg-transparent hover:text-primary-100 hover:border-primary-100 active:bg-transparent active:text-primary-100 active:border-primary-100 h-16"
                  >
                    continue
                  </button>
                </div>
                <div className="signIn mt-2 text-center">
                  <p className="text-md first-letter:capitalize text-neutral-50">
                    already have an account?{' '}
                    <Link className="text-primary-100 first-letter:capitalize" to={'/sign-in'}>
                      sign in
                    </Link>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
        <div className="signupImage bg-primary-100 rounded-3xl lg:w-[55%] sm:w-0 h-full items-center justify-center custom-scrollbar-container">
          <div className="first-element w-full">
            <img src={doctor} alt="MyMedicare" className="w-[75%]" />
          </div>
          <div className="second-element">
            <Slider />
          </div>
        </div>
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

export default PatientData;
