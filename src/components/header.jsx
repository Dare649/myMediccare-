import React from 'react';
import logo from '../assets/images/logo.png'; 

const Header = () => {
    return (
        <nav className="bg-white shadow-lg">
            <div className="container mx-auto flex items-center justify-between py-3">
                <a href="#home" className="flex items-center">
                    <img src={logo} alt="QMedi" className="h-10" />
                </a>
                <button
                    className="text-gray-500 hover:text-gray-700 focus:outline-none md:hidden"
                    aria-controls="navbar"
                    aria-expanded="false"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
                    </svg>
                </button>
                <div className="hidden md:flex md:items-center md:space-x-6" id="navbar">
                    <a href="#home" className="text-gray-800 hover:text-gray-600">HOME</a>
                    <a href="#about" className="text-gray-800 hover:text-gray-600">ABOUT</a>
                    <a href="#services" className="text-gray-800 hover:text-gray-600">SERVICES</a>
                    <a href="#contact" className="text-gray-800 hover:text-gray-600">CONTACT</a>
                </div>
                <div className="hidden md:flex items-center space-x-3">
                    <a href="/sign-in" className="text-gray-800 hover:text-gray-600 px-4 py-2">LOGIN</a>
                    <a href="/sign-up" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">SIGN UP</a>
                </div>
            </div>
        </nav>
    );
}

export default Header;
