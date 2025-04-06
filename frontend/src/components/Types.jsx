import React from 'react';
import { useNavigate } from 'react-router-dom';
import { specialityData } from '../assets/assets';
import gynecology from '../assets/gynecology.webp';
import pediatrician from '../assets/pediatrician.webp';
import neurology from '../assets/neurology.webp';
import orthopedic from '../assets/orthopedic.webp';

const Types = () => {
  const navigate = useNavigate();

  const handleImageClick = (speciality) => {
    navigate(`/doctors/${speciality}`);
  };

  const handleDoctorClick = () => {
    navigate('/apply-doctors');
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-8 p-8 mt-5 max-w-[85rem] mx-auto">
      {/* Healthcare Professional Section - Color improved */}
      <div className="w-full bg-blue-50 rounded-xl shadow-md overflow-hidden border border-blue-100 p-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <h2 className="text-2xl font-bold text-gray-800 mb-3">Are you a healthcare professional?</h2>
            <p className="text-gray-600 max-w-xl mb-4">
              Join our exclusive network of specialists, manage appointments, and connect with patients seeking your expertise.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-2 gap-x-4 mt-4">
              <div className="flex items-center text-gray-600">
                <svg className="w-5 h-5 mr-2 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                </svg>
                <span>Manage your professional profile</span>
              </div>
              <div className="flex items-center text-gray-600">
                <svg className="w-5 h-5 mr-2 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                </svg>
                <span>Access patient records securely</span>
              </div>
              <div className="flex items-center text-gray-600">
                <svg className="w-5 h-5 mr-2 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                </svg>
                <span>Schedule appointments efficiently</span>
              </div>
              <div className="flex items-center text-gray-600">
                <svg className="w-5 h-5 mr-2 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                </svg>
                <span>Connect with patients</span>
              </div>
            </div>
          </div>
          
          <div className="flex-shrink-0">
            <button
              onClick={handleDoctorClick}
              className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-8 rounded-lg transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg flex items-center"
            >
              <span>Doctor Portal</span>
              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Title and description */}
      <div className="text-center mt-8 mb-2">
        <h1 className="text-3xl font-bold text-gray-800">Find Specialists</h1>
        <p className="text-gray-600 max-w-2xl mt-3">
          Simply browse through our extensive list of trusted doctors and schedule your appointment hassle-free.
        </p>
      </div>

      {/* Specialities */}
      <div className="flex flex-wrap justify-center gap-8 mt-6">
        {specialityData.map((item, index) => (
          <div
            key={item.speciality}
            className="flex flex-col items-center cursor-pointer group"
            onClick={() => handleImageClick(item.speciality)}
          >
            <div className="overflow-hidden rounded-xl shadow-md hover:shadow-xl transition-all duration-300">
              <img
                src={[gynecology, pediatrician, neurology, orthopedic][index % 4]}
                alt={item.speciality}
                className="w-52 h-52 object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
              />
            </div>
            <p className="mt-4 text-lg font-semibold text-gray-800">{item.speciality}</p>
            <div className="flex items-center mt-1">
              <svg className="w-4 h-4 text-blue-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"></path>
              </svg>
              <p className="text-sm text-gray-600">{item.doctorCount} Doctors</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Types;