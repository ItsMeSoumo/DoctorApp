import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCalendarCheck, FaUserMd, FaClock } from 'react-icons/fa';

const DoctorHomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-200 px-6 py-10">
      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-10">
        {/* Left Content */}
        <div className="flex-1 space-y-6">
          <h1 className="text-4xl md:text-5xl font-bold text-blue-800">Welcome Back, Doctor 👨‍⚕️</h1>
          <p className="text-gray-700 text-lg">
            Manage your appointments, availability, and patient interactions easily from one place.
          </p>

          <div className="space-y-4">
            <button
              onClick={() => navigate('/doctor-appointments')}
              className="flex items-center gap-3 bg-blue-600 text-white px-5 py-3 rounded-lg shadow hover:bg-blue-700 transition"
            >
              <FaCalendarCheck /> My Appointments
            </button>

            <button
              onClick={() => navigate('/doctor-profile')}
              className="flex items-center gap-3 bg-white text-blue-700 px-5 py-3 border border-blue-300 rounded-lg hover:bg-blue-50 transition"
            >
              <FaUserMd /> View Profile
            </button>

            <button
              onClick={() => navigate('/doctor-availability')}
              className="flex items-center gap-3 bg-white text-blue-700 px-5 py-3 border border-blue-300 rounded-lg hover:bg-blue-50 transition"
            >
              <FaClock /> Manage Availability
            </button>
          </div>
        </div>

        {/* Right Image */}
        <div className="flex-1">
          <img
            src="https://images.unsplash.com/photo-1588776814546-ec7e36710452?auto=format&fit=crop&w=800&q=80"
            alt="Doctor"
            className="rounded-2xl shadow-xl w-full"
          />
        </div>
      </div>
    </div>
  );
};

export default DoctorHomePage;
