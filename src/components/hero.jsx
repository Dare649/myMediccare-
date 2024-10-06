import React from 'react';
import { FaHouseDamage, FaHeart, FaStethoscope } from 'react-icons/fa';
import heroImage from '../assets/images/hero_background.png';

const Hero = () => {
    return (
        <>
            {/* Hero Section */}
            <div className="bg-white text-gray-800 mt-32 md:mt-20">
                <div className="container mx-auto px-4 flex flex-col md:flex-row items-center">
                    <div className="md:w-6/12 mb-8 md:mb-0 md:ml-16">
                        <h1 className="text-4xl font-bold mb-4">Providing Reliable & Affordable Healthcare</h1>
                        <p className="text-lg mb-6">At MyMedicare, we go beyond the usual tech-driven startup. We aim to transform the healthcare services market landscape...</p>
                        <div>
                            <a href='/sign-in'>
                                <button className="bg-blue-500 text-white py-3 px-6 rounded-lg font-semibold mr-4 hover:bg-blue-600 transition mb-4 md:mb-0">
                                    Make an Appointment
                                </button>
                            </a>
                            <a href='/sign-up'>
                                <button className="bg-gray-700 text-white py-3 px-6 rounded-lg font-semibold hover:bg-gray-800 transition">
                                    See How We Work
                                </button>
                            </a> 
                        </div>
                    </div>
                    <div className="md:w-5/12 text-center hidden md:block"> {/* Hide on small screens */}
                        <img src={heroImage} alt="Hero" className="w-full h-auto" />
                    </div>
                </div>

                {/* Feature Section */}
                <div className="bg-blue-600 text-white py-6 rounded-3xl mx-4 md:mx-12 flex justify-center">
                    <div className="container mx-auto max-w-5xl px-4">
                        <div className="flex flex-row justify-between items-center text-center space-y-0 w-full flex-nowrap">
                            <div className="flex flex-col items-center justify-center w-1/3">
                                <FaHouseDamage size={24} className="mb-2" />
                                <p className="text-base font-semibold">Remote Monitoring</p>
                            </div>
                            <div className="flex flex-col items-center justify-center w-1/3">
                                <FaHeart size={24} className="mb-2" />
                                <p className="text-base font-semibold">Online Consultations</p>
                            </div>
                            <div className="flex flex-col items-center justify-center w-1/3">
                                <FaStethoscope size={24} className="mb-2" />
                                <p className="text-base font-semibold">Affordable Healthcare</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Hero;
