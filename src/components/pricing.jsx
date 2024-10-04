import React from 'react';
import { FaCheck } from 'react-icons/fa';

const pricingPlans = [
  {
    title: "Pay As You Go",
    price: "£10",
    features: ["One virtual session", "Free prescription", "Unlimited chat with doctors"],
    color: '#007bff',
    availableFeatures: [true, true, true]
  },
];

const Pricing = () => {
  return (
    <div className="bg-gray-50 py-12 font-sans">
      <h2 className="text-center font-bold text-4xl text-black mb-10">
        The Right Plan for Your Health
      </h2>
      <div className="container mx-auto px-4 flex justify-center">
        {pricingPlans.map((plan, index) => (
          <div
            key={index}
            className="bg-white w-full max-w-md rounded-xl shadow-lg p-8 flex flex-col text-center transform transition duration-500 hover:scale-105 hover:shadow-2xl"
          >
            <h3 className="text-2xl font-bold text-black mb-4">{plan.title}</h3>
            <p className="text-5xl font-extrabold text-black mb-4">{plan.price}</p>
            <ul className="list-none mb-6 space-y-4">
              {plan.features.map((feature, idx) => (
                <li key={idx} className="flex items-center justify-center">
                  <FaCheck
                    size={20}
                    className={`mr-2 ${plan.availableFeatures[idx] ? 'text-green-500' : 'text-gray-400'}`}
                  />
                  <span className={`text-lg ${plan.availableFeatures[idx] ? 'text-black' : 'line-through text-gray-400'}`}>
                    {feature}
                  </span>
                </li>
              ))}
            </ul>
            <button
              className={`mt-auto py-3 px-6 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition`}
            >
              Get Started
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Pricing;
