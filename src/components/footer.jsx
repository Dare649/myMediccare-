import React from 'react';
import { FaEnvelope, FaFacebookF, FaTwitter, FaInstagram } from 'react-icons/fa';
const Footer = () => {
  return (
    <footer className="bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Contact Us Section */}
          <div className="mb-4">
            <h5 className="text-lg font-semibold mb-4">Contact Us</h5>
            <form>
              <div className="mb-2">
                <input
                  type="email"
                  placeholder="Enter email"
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                />
              </div>
              <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
                Submit
              </button>
            </form>
          </div>

          {/* Links Section */}
          <div className="mb-4">
            <h5 className="text-lg font-semibold mb-4">Links</h5>
            <ul className="list-none space-y-2">
              <li><a href="#home" className="text-gray-700 hover:text-blue-500">Home</a></li>
              <li><a href="#about" className="text-gray-700 hover:text-blue-500">About</a></li>
              <li><a href="#services" className="text-gray-700 hover:text-blue-500">Services</a></li>
              <li><a href="#contact" className="text-gray-700 hover:text-blue-500">Contact</a></li>
            </ul>
          </div>

          {/* Social Media Section */}
          <div className="mb-4">
            <h5 className="text-lg font-semibold mb-4">Social Media</h5>
            <ul className="flex space-x-4">
              <li><a href="#facebook" className="text-gray-700 hover:text-blue-500"><FaFacebookF size={20} /></a></li>
              <li><a href="#twitter" className="text-gray-700 hover:text-blue-500"><FaTwitter size={20} /></a></li>
              <li><a href="#instagram" className="text-gray-700 hover:text-blue-500"><FaInstagram size={20} /></a></li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
