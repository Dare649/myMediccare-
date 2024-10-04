import React from 'react';
import { FaHouseDamage, FaHeartbeat, FaUserMd } from 'react-icons/fa'; // Updated icons for better correspondence

const services = [
  { 
    title: "Virtual Consultations", 
    description: "We offer virtual consultations with experienced doctors, providing you expert care from the comfort of your home.", 
    icon: <FaHouseDamage size={40} />  // Set icon size to medium (40px)
  },
  { 
    title: "Home Consultations", 
    description: "Our doctors can visit your home for personalized care, ensuring your health and convenience are prioritized.", 
    icon: <FaHeartbeat size={40} />  // Set icon size to medium (40px)
  },
  { 
    title: "Speak to a Therapist", 
    description: "Our licensed therapists are available to support your mental well-being and provide expert therapy services.", 
    icon: <FaUserMd size={40} />  // Set icon size to medium (40px)
  },
];

const Services = () => {
  return (
    <div className="bg-gray-50 py-14">
      <div className="container mx-auto px-4">
        <h2 className="text-center text-4xl font-bold mb-6 text-gray-800">Our Services</h2>
        <p className="text-center text-lg text-gray-600 mb-12">We offer a variety of health services tailored to meet your specific needs.</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {services.map((service, index) => (
            <div key={index} className="bg-white rounded-xl shadow-lg p-8 flex flex-col items-center text-center transition duration-500 hover:shadow-2xl hover:scale-105">
              <div className="flex items-center justify-center w-20 h-20 mb-6 rounded-full bg-blue-100 text-blue-600">
                {service.icon} {/* Icon size is set to 40px */}
              </div>
              <h3 className="text-2xl font-bold mb-3 text-gray-800">{service.title}</h3>
              <p className="text-gray-600 text-lg">{service.description}</p>
            </div>
          ))}
        </div>
        <div className="text-center mt-12">
          <button className="bg-blue-500 text-white py-3 px-8 rounded-lg text-lg font-semibold hover:bg-blue-600 transition duration-300">
            Book Appointment
          </button>
        </div>
      </div>
    </div>
  );
}

export default Services;
