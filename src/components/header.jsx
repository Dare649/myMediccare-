import React, { useState, useEffect } from 'react';
import logo from '../assets/images/logo.png'; 

const Header = () => {
    const [scrolled, setScrolled] = useState(false);
    const [activeSection, setActiveSection] = useState('home');

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 50) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <nav 
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out ${scrolled ? 'bg-white shadow-lg w-full' : 'bg-white shadow-lg rounded-b-lg'} mx-auto`}
            style={{ maxWidth: scrolled ? '100%' : '90%', transition: 'max-width 0.3s ease' }} 
        >
            <div className="container mx-auto flex items-center justify-between py-3">
                <a href="#home" className="flex items-center" onClick={() => setActiveSection('home')}>
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
                    <a 
                        href="#home" 
                        className={`transition-colors duration-300 ${activeSection === 'home' ? 'text-blue-500' : 'text-gray-800 hover:text-gray-600'}`}
                        onClick={() => setActiveSection('home')}
                    >
                        HOME
                    </a>
                    <a 
                        href="#about" 
                        className={`transition-colors duration-300 ${activeSection === 'about' ? 'text-blue-500' : 'text-gray-800 hover:text-gray-600'}`}
                        onClick={() => setActiveSection('about')}
                    >
                        ABOUT
                    </a>
                    <a 
                        href="#services" 
                        className={`transition-colors duration-300 ${activeSection === 'services' ? 'text-blue-500' : 'text-gray-800 hover:text-gray-600'}`}
                        onClick={() => setActiveSection('services')}
                    >
                        SERVICES
                    </a>
                    <a 
                        href="#pricing" 
                        className={`transition-colors duration-300 ${activeSection === 'pricing' ? 'text-blue-500' : 'text-gray-800 hover:text-gray-600'}`}
                        onClick={() => setActiveSection('pricing')}
                    >
                        PRICING
                    </a>
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
 