import React, { useState, useEffect, useRef } from 'react';
import logo from '../assets/images/logo.png';

const Header = () => {
    const [scrolled, setScrolled] = useState(false);
    const [activeSection, setActiveSection] = useState('home');
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef(null); 

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };

        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsMenuOpen(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        document.addEventListener('mousedown', handleClickOutside); 

        return () => {
            window.removeEventListener('scroll', handleScroll);
            document.removeEventListener('mousedown', handleClickOutside); 
        };
    }, []);

    const toggleMenu = () => {
        setIsMenuOpen((prev) => !prev); 
    };

    const handleLinkClick = (section) => {
        setActiveSection(section);
        setIsMenuOpen(false); 
    };

    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out ${scrolled ? 'bg-white shadow-lg w-full' : 'bg-white shadow-lg rounded-b-lg'} mx-auto`}
            style={{
                maxWidth: scrolled ? '100%' : '90%',
                margin: scrolled ? '0 auto' : '1rem auto',
                transition: 'all 0.3s ease'
            }}
        >
            <div className="container mx-auto flex items-center justify-between py-3 px-4 lg:px-8">
                <a href="#home" className="flex items-center" onClick={() => handleLinkClick('home')}>
                    <img src={logo} alt="QMedi" className="h-10" />
                </a>

                {/* Mobile Menu Button */}
                <button
                    className="text-gray-500 hover:text-gray-700 focus:outline-none md:hidden"
                    aria-controls="navbar"
                    aria-expanded={isMenuOpen}
                    onClick={toggleMenu}
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
                    </svg>
                </button>

                <div
                    ref={menuRef} 
                    className={`${isMenuOpen ? 'block' : 'hidden'
                        } w-full md:w-auto md:flex md:items-center md:space-x-6 bg-white absolute md:relative top-14 left-0 md:top-0 md:left-0 shadow-lg md:shadow-none md:bg-transparent`}
                >
                    <a
                        href="#home"
                        className={`block md:inline-block transition-colors duration-300 px-4 py-2 ${activeSection === 'home' ? 'text-blue-500' : 'text-gray-800 hover:text-gray-600'}`}
                        onClick={() => handleLinkClick('home')}
                    >
                        HOME
                    </a>
                    <a
                        href="#about"
                        className={`block md:inline-block transition-colors duration-300 px-4 py-2 ${activeSection === 'about' ? 'text-blue-500' : 'text-gray-800 hover:text-gray-600'}`}
                        onClick={() => handleLinkClick('about')}
                    >
                        ABOUT
                    </a>
                    <a
                        href="#services"
                        className={`block md:inline-block transition-colors duration-300 px-4 py-2 ${activeSection === 'services' ? 'text-blue-500' : 'text-gray-800 hover:text-gray-600'}`}
                        onClick={() => handleLinkClick('services')}
                    >
                        SERVICES
                    </a>
                    <a
                        href="#pricing"
                        className={`block md:inline-block transition-colors duration-300 px-4 py-2 ${activeSection === 'pricing' ? 'text-blue-500' : 'text-gray-800 hover:text-gray-600'}`}
                        onClick={() => handleLinkClick('pricing')}
                    >
                        PRICING
                    </a>

                    <div className="md:hidden mt-4 space-y-2">
                        <a href="/sign-in" className="block border border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white px-4 py-2 rounded-lg transition duration-300" style={{marginRight:'49px',marginLeft:'15px',marginBottom:'15px'}}>
                            LOGIN
                        </a>
                        <a href="/sign-up" className="block bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600" style={{ marginBottom: '15px', marginLeft: '15px', marginRight: '49px' }}>SIGN UP</a>
                    </div>
                </div>

                <div className="hidden md:flex items-center space-x-4">
                    <a href="/sign-in" className="text-gray-800 hover:text-gray-600">LOGIN</a>
                    <a href="/sign-up" className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">SIGN UP</a>
                </div>
            </div>
        </nav>
    );
};

export default Header;
