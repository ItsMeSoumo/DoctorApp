import React from "react";
import { Link, useNavigate } from 'react-router-dom';

const About = () => {
  const navigate = useNavigate();
  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-10">
      <h2 className="text-3xl font-bold text-blue-600 mb-4 text-center">
        About Our App 🏥
      </h2>
      <p className="text-gray-700 text-lg text-center">
        Welcome to <span className="font-semibold">AURAHEALTH</span>, your one-stop solution for easy and hassle-free doctor appointments!
      </p>

      {/* Features Section */}
      <div className="mt-6 space-y-4">
        <h3 className="text-xl font-semibold text-gray-800">Why Choose Us? 🤔</h3>
        <ul className="list-disc pl-6 space-y-2 text-gray-700">
          <li>✅ <span className="font-medium">Easy Appointments</span> – Book doctors in just a few clicks.</li>
          <li>✅ <span className="font-medium">Instant Notifications</span> – Get timely reminders for upcoming visits.</li>
          <li>✅ <span className="font-medium">Secure & Private</span> – Your medical details are safe with us.</li>
          <li>✅ <span className="font-medium">Multiple Specialties</span> – Find top specialists across various fields.</li>
        </ul>
      </div>

      {/* How It Works Section */}
      <div className="mt-6 space-y-4">
        <h3 className="text-xl font-semibold text-gray-800">How It Works? 🚀</h3>
        <div className="space-y-3">
          <p>1️⃣ <span className="font-medium">Search for Doctors</span> – Find the best doctors by specialty or location.</p>
          <p>2️⃣ <span className="font-medium">Book an Appointment</span> – Select a convenient time slot.</p>
          <p>3️⃣ <span className="font-medium">Get Reminders</span> – Stay updated with timely alerts.</p>
          <p>4️⃣ <span className="font-medium">Manage Your Visits</span> – Reschedule or cancel hassle-free.</p>
        </div>
      </div>

      {/* CTA Button */}
      <div className="text-center mt-6">
        <button onClick={() => navigate('/doctors')} className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-700 transition">
          Book Your Appointment Now
        </button>
      </div>
    </div>
  );
};

export default About;
