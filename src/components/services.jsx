import React from 'react';
import { FaHouseDamage, FaHeart } from 'react-icons/fa'; // Importing icons from react-icons

const services = [
  { title: "Virtual Consultations", description: "We offer virtual consultations with experienced doctors...", icon: <FaHouseDamage /> },
  { title: "Home Consultations", description: "We provide home consultation services for your convenience...", icon: <FaHeart /> },
  { title: "Speak to a Therapist", description: "We provide specialist's services for your therapy...", icon: <FaHeart /> },
];

const Services = () => {
  return (
    <div className="bg-gray-50 py-10">
      <div className="container mx-auto px-4">
        <h2 className="text-center text-3xl font-semibold mb-4 text-gray-800">Our Services</h2>
        <p className="text-center text-gray-600 mb-8">Out of the plethora of services we offer, they can be classified into 5 categories</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center text-center">
              <div className="flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-blue-100 text-blue-500">
                {service.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-800">{service.title}</h3>
              <p className="text-gray-600">{service.description}</p>
            </div>
          ))}
        </div>
        <div className="text-center mt-8">
          <button className="bg-blue-500 text-white py-3 px-6 rounded-lg text-lg font-semibold hover:bg-blue-600 transition">
            Book Appointment
          </button>
        </div>
      </div>
    </div>
  );
}

export default Services;
