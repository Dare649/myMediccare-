import React from 'react';
import { FaHouseDamage, FaHeart, FaStethoscope } from 'react-icons/fa'; // Imported a new icon for variety
import heroImage from '../assets/images/hero_background.png';

const Hero = () => {
    return (
        <>
            {/* Hero Section */}
            <div className="bg-white text-gray-800">
                <div className="container mx-auto px-4 flex flex-col md:flex-row items-center">
                    <div className="md:w-6/12 mb-8 md:mb-0 md:ml-16">
                        <h1 className="text-4xl font-bold mb-4">Providing Reliable & Affordable Healthcare</h1>
                        <p className="text-lg mb-6">At MyMedicare, we go beyond the usual tech-driven startup. We aim to transform the healthcare services market landscape...</p>
                        <div>
                            <button className="bg-blue-500 text-white py-3 px-6 rounded-lg font-semibold mr-4 hover:bg-blue-600 transition mb-4 md:mb-0">
                                Make an Appointment
                            </button>
                            <button className="bg-gray-700 text-white py-3 px-6 rounded-lg font-semibold hover:bg-gray-800 transition">
                                See How We Work
                            </button>
                        </div>
                    </div>
                    <div className="md:w-5/12 text-center">
                        <img src={heroImage} alt="Hero" className="w-full h-auto" />
                    </div>
                </div>

                {/* Feature Section */}
                <div className="bg-blue-600 text-white py-6 rounded-3xl" style={{ bottom: '48px', position: 'relative' }}>
                    <div className="container mx-auto px-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                            <div className="flex flex-col items-center">
                                <FaHouseDamage size={30} className="mb-2" />
                                <p className="text-lg font-semibold mb-0">Remote Monitoring</p>
                            </div>
                            <div className="flex flex-col items-center">
                                <FaHeart size={30} className="mb-2" />
                                <p className="text-lg font-semibold mb-0">Online Consultations</p>
                            </div>
                            <div className="flex flex-col items-center">
                                <FaStethoscope size={30} className="mb-2" />
                                <p className="text-lg font-semibold mb-0">Affordable Healthcare</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Hero;
