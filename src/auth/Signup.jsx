import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import countryList from 'react-select-country-list';
import logo from '../assets/images/logo.png';
import google from '../assets/icons/google.jpg';
import doctor from '../assets/images/doctor-1.png';
import Slider from '../components/slider';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import { PiEyeClosedLight, PiEyeLight } from 'react-icons/pi';
import { axiosClient } from '../axios';

const Signup = () => {
    const [errors, setErrors] = useState({});
    const MySwal = withReactContent(Swal);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        country: null,
        role: "patient",
        country_code: "",
        phone: "",
        password: ""
    });
    const countries = countryList().getData();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value
        }));
    };

    const handleCountryChange = (country) => {
        setFormData((prevFormData) => ({
            ...prevFormData,
            country: country,
            country_code: country.value
        }));
    };

    const handlePhoneChange = (value) => {
        setFormData((prevFormData) => ({
            ...prevFormData,
            phone: value
        }));
    };

    const handleClickShowPassword = () => {
        setShowPassword((prev) => !prev);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});
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

        if (!formData.phone) {
            newErrors.phone = 'Required';
        }

        if (!formData.password) {
            newErrors.password = 'Required';
        } else if (formData.password.length < 8) {
            newErrors.password = 'Password must be at least 8 characters long';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        try {
            setLoading(true);
            const response = await axiosClient.post("/api/register", formData);
            setLoading(false);
            const { email } = response?.data?.data?.user;
            navigate('/otp-verification', { state: { email } });
            MySwal.fire({
                title: "Success",
                text: response?.data?.message,
                icon: "success"
            });
        } catch (error) {
            setLoading(false);
            MySwal.fire({
                title: 'Error',
                icon: 'error',
                text: error?.response?.data?.message || 'Sign up failed!'
            });
            console.error('Sign up failed!', error?.response?.data?.message);
        }
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
                            <div className="flex flex-row items-center justify-center space-x-1 py-4">
                                <img src={google} alt="MyMedicare" />
                                <p className="first-letter:capitalize last-letter:capitalize text-neutral-50">continue with google</p>
                            </div>
                        </div>
                        <p className="flex flex-col items-center justify-center py-2 text-neutral-50 my-1">or</p>
                        <div className="signupForm w-full">
                            <form onSubmit={handleSubmit} className="w-full">
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
                                <div className="phone flex flex-col w-full ">
                                    <label className="capitalize text-neutral-100 text-xl font-semibold mb-2">phone number</label>
                                    <PhoneInput
                                        international
                                        defaultCountry="US"
                                        value={formData.phone}
                                        onChange={handlePhoneChange}
                                        className="outline-none border-2 border-neutral-50 p-2 w-full text-lg font-medium rounded-lg focus:border-primary-100"
                                    />
                                    {errors.phone && <p className="text-red-500 text-sm font-bold">{errors.phone}</p>}
                                </div>
                                <div className="country flex flex-col mb-2">
                                    <label className="capitalize text-neutral-100 text-xl font-semibold mb-2">country</label>
                                    <select
                                        value={formData.country?.value || ''}
                                        onChange={(e) => handleCountryChange(countries.find(c => c.value === e.target.value))}
                                        className="outline-none border-2 border-neutral-50 p-2 w-full text-lg font-medium rounded-lg focus:border-primary-100"
                                    >
                                        <option value="" disabled>Select country</option>
                                        {countries.map((country) => (
                                            <option key={country.value} value={country.value}>
                                                {country.label}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.country && <p className="text-red-500 text-sm font-bold">{errors.country}</p>}
                                </div>
                                <div className="flex flex-col mb-4 w-full">
                                    <label htmlFor="password" className="block text-gray-700 font-semibold mb-2">Password</label>
                                    <div className="w-full flex items-center border-2 border-neutral-50 rounded-lg py-2 px-3 text-neutral-50 focus-within:border-primary-100 focus-within:ring-primary-100">
                                        <input
                                            id="password"
                                            name="password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            type={showPassword ? 'text' : 'password'}
                                            placeholder="Enter your password"
                                            className="outline-none border-none w-full bg-transparent py-2"
                                        />
                                        <button
                                            type="button"
                                            onClick={handleClickShowPassword}
                                            className="cursor-pointer"
                                        >
                                            {!showPassword ? (
                                                <PiEyeClosedLight className="h-6 w-6 text-neutral-50" />
                                            ) : (
                                                <PiEyeLight className="h-6 w-6 text-neutral-50" />
                                            )}
                                        </button>
                                    </div>
                                    {errors.password && <p className="text-red-500 text-sm font-bold">{errors.password}</p>}
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
                                        disabled={loading}
                                    >
                                        {loading ? "Loading..." : "sign-up"}
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
                <div className="signupImage bg-primary-100 rounded-3xl lg:w-[55%] sm:w-0 h-screen lg:flex hidden">
                    <div className="px-5 flex flex-col items-center justify-center">
                        <div className="flex flex-row items-center space-x-3 mt-8">
                            <img src={logo} alt="MyMedicare" className="w-[30%]" />
                            <h2 className="text-white text-3xl font-medium">MyMedicare</h2>
                        </div>
                        <img src={doctor} alt="MyMedicare" />
                        <div className="xl:mx-20 sm:mx-0">
                            <Slider autoSlide={true} autoSlideInterval={1000} />
                        </div>
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

export default Signup;
