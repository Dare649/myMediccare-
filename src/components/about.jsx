import React from 'react';
import aboutImage from '../assets/images/doctor-1.png';
import aboutImage2 from '../assets/images/telemedicine-1.webp';
import aboutImage3 from '../assets/images/healthcare-1.png'
const Section = ({ title, text, imageSrc, imageFirst = false }) => {
    return (
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center mb-12">
            {imageFirst && (
                <div className="md:w-6/12 mb-8 md:mb-0">
                    <img src={imageSrc} alt={title} className="w-full h-auto rounded-lg shadow-lg" />
                </div>
            )}
            <div className="md:w-6/12 md:pl-12">
                <h2 className="text-3xl font-bold mb-4">{title}</h2>
                <p className="text-lg text-gray-700 mb-4">{text}</p>
            </div>
            {!imageFirst && (
                <div className="md:w-6/12 mb-8 md:mb-0">
                    <img src={imageSrc} alt={title} className="w-full h-auto rounded-lg shadow-lg" />
                </div>
            )}
        </div>
    );
};

const AboutUs = () => {
    return (
        <div className="bg-gray-100 py-12">
            {/* About Us Section */}
            <Section
                title="About Us"
                text="At MyMedicare, we believe in making healthcare accessible, reliable, and affordable for everyone.
                Our platform connects patients with top-tier medical professionals, enabling seamless consultations
                and effective treatment options. Our mission is to provide world-class care with cutting-edge technology.
                We’re proud of our diverse team of healthcare experts and technologists who work together to bring
                innovative solutions to modern healthcare challenges. Join us on our journey to make healthcare simpler and more effective."
                imageSrc={aboutImage} 
                imageFirst={false}
            />
            <Section
                title="Our Mission"
                text="To provide fast, affordable healthcare to our users using appropriate technology and prompt homecare."
                imageSrc={aboutImage2}
                imageFirst={true}
            />
            <Section
                title="Our Vision"
                text="We envision a future where technology and healthcare merge seamlessly to provide the best care possible."
                imageSrc={aboutImage3}
                imageFirst={false}
            />
        </div>
    );
}

export default AboutUs;
