import React from 'react';
import { FaQuoteLeft } from 'react-icons/fa';
import { Carousel } from 'react-responsive-carousel'; 
import "react-responsive-carousel/lib/styles/carousel.min.css"; 

const testimonials = [
    { quote: "I frequently use MyMedicare, and one benefit is how quickly I receive my test results...", name: "Client Name" },
    { quote: "The doctor constantly follows up and gives me the same treatment as before...", name: "Client Name" },
    { quote: "MyMedicare has provided excellent customer service throughout my journey...", name: "Client Name" },
    { quote: "Highly recommend their services, very reliable!", name: "Client Name" },
];

const Testimonials = () => {
    return (
        <div className="bg-gray-100 py-10">
            <div className="container mx-auto px-4">
                <h2 className="text-center text-3xl font-bold text-black mb-10">Client Testimonials</h2>
                <Carousel
                    showThumbs={false}
                    showStatus={false}
                    infiniteLoop={true}
                    autoPlay={true}
                    interval={5000}
                    showArrows={true}
                    className="relative"
                >
                    {testimonials.reduce((resultArray, item, index) => {
                        const chunkIndex = Math.floor(index / 2);
                        if (!resultArray[chunkIndex]) {
                            resultArray[chunkIndex] = [];
                        }
                        resultArray[chunkIndex].push(item);
                        return resultArray;
                    }, []).map((chunk, index) => (
                        <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {chunk.map((test, idx) => (
                                <div key={idx} className="bg-white shadow-lg p-8 rounded-lg max-w-lg mx-auto">
                                    <div className="flex items-start mb-4">
                                        <FaQuoteLeft className="text-blue-500 text-3xl mr-4" />
                                        <p className="text-gray-700 text-lg italic">"{test.quote}"</p>
                                    </div>
                                    <h5 className="text-right text-xl font-semibold text-gray-900">- {test.name}</h5>
                                </div>
                            ))}
                        </div>
                    ))}
                </Carousel>
            </div>
        </div>
    );
}

export default Testimonials;