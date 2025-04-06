import React from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Import Link and useNavigate
import Doctors from '../assets/doctors.jpg';

const Header = () => {
  const navigate = useNavigate(); // Define navigate

  return (
    <div className="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-blue-200 mt-5 rounded-lg">
      {/* Flex container for the two columns */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-8">
        
        {/* Left column - Text content */}
        <div className="flex-1 space-y-6 text-center md:text-left w-full">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
            Your Health Is Our Top Priority
          </h1>
          
          <p className="text-base md:text-lg text-gray-600">
            Experience personalized care from our team of expert healthcare professionals. 
            We're committed to providing comprehensive medical services for you and your family.
          </p>
          
          <button 
            onClick={() => navigate('/doctors')} // Use navigate
            className="bg-blue-600 hover:bg-blue-700 text-white 
            font-medium px-6 py-3 rounded-lg transition-colors duration-200
            transform hover:scale-105"
          >
            Book An Appointment
          </button>
        </div>
        
        {/* Right column - Image */}
        <div className="flex-1 w-full md:w-auto pl-50">
          <img 
            src={Doctors}
            alt="Healthcare professionals"
            className="w-full md:w-[500px] h-auto rounded-lg shadow-lg"
          />
        </div>
      </div>
    </div>
  );
};

export default Header;
