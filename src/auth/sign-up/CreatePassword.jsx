import React, { useState } from 'react';
import { PiEyeClosedLight, PiEyeLight } from 'react-icons/pi';

const CreatePassword = ({ formData, prevStep, setFormData, handleSubmit }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.password) {
      newErrors.password = 'Required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters long';
    }

    setErrors(newErrors);
    return newErrors;
  };

  const handleContinue = e => {
    e.preventDefault();
    const newErrors = validate();

    if (Object.keys(newErrors).length === 0) {
      handleSubmit(e);
    }
  };

  return (
    <section className="h-full flex flex-col justify-center items-center">
      <div className="text-center">
        <h2 className="text-3xl font-semibold text-gray-800">Create Password</h2>
        <p className="text-lg text-gray-600">Secure your account with a strong password</p>
      </div>
      <form className="w-full max-w-sm mt-6" onSubmit={handleContinue}>
        <div className="flex flex-col mb-4">
          <label htmlFor="password" className="block text-gray-700 font-semibold mb-2">Password</label>
          <div className="relative">
            <input
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter your password"
              className="appearance-none border border-gray-300 rounded-lg py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-primary-400 focus:ring-primary-400"
            />
            <button
              type="button"
              onClick={handleClickShowPassword}
              className="absolute inset-y-0 right-0 pr-3 flex items-center focus:outline-none"
            >
              {showPassword ? (
                <PiEyeClosedLight className="h-6 w-6 text-gray-700" />
              ) : (
                <PiEyeLight className="h-6 w-6 text-gray-700" />
              )}
            </button>
          </div>
          {errors.password && <p className="text-red-500 text-sm font-semibold">{errors.password}</p>}
        </div>
        <div className="flex justify-between items-center">
          <button
            type="button"
            onClick={prevStep}
            className="text-md text-gray-700 hover:text-primary-600 focus:outline-none"
          >
            Back
          </button>
          <button
            type="submit"
            className="bg-primary-600 text-white text-lg font-bold py-2 px-4 rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-400"
          >
            Create Account
          </button>
        </div>
      </form>
    </section>
  );
};

export default CreatePassword;
