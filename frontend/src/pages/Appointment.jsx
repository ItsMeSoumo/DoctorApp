import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { doctorData } from '../assets/assets'; // Import doctorData

const Appointment = () => {
  const { speciality } = useParams(); // Get speciality from URL params
  const doctor = doctorData[speciality];

  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');

  if (!doctor) {
    return <div className="text-center text-xl font-semibold text-red-500">Doctor not found</div>;
  }

  const handleBooking = () => {
    if (!selectedDate || !selectedTime) {
      alert("Please select a date and time!");
      return;
    }
    alert(`Appointment booked successfully on ${selectedDate} at ${selectedTime}`);
  };

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white shadow-lg rounded-lg mt-10">
      <div className="flex flex-col md:flex-row gap-10">
        {/* Left - Doctor Image */}
        <div className="md:w-1/2 flex justify-center">
          <img src={doctor.image} alt={doctor.name} className="w-64 h-64 object-cover rounded-lg shadow-lg" />
        </div>
        
        {/* Right - Doctor Info */}
        <div className="md:w-1/2 space-y-4">
          <h2 className="text-2xl font-bold text-gray-900">{doctor.name}</h2>
          <p className="text-lg"><strong>Age:</strong> {doctor.age}</p>
          <p className="text-lg"><strong>Education:</strong> {doctor.education}</p>
          <p className="text-lg"><strong>Experience:</strong> {doctor.experience} years</p>
          <p className="text-lg"><strong>Fees:</strong> {doctor.fees}</p>
        </div>
      </div>

      {/* Date Selection */}
      <div className="mt-6">
        <label className="block text-lg font-semibold mb-2">📅 Select a Date:</label>
        <input 
          type="date" 
          className="border rounded-md p-2 w-full focus:outline-none focus:border-blue-500"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        />
      </div>

      {/* Time Slot Selection */}
      <div className="mt-6">
        <label className="block text-lg font-semibold mb-2">⏰ Select a Time Slot:</label>
        <div className="flex gap-3 flex-wrap">
          {doctor.availableSlots.map((slot, index) => (
            <button
              key={index}
              className={`px-4 py-2 border rounded-lg ${
                selectedTime === slot ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-800"
              } hover:bg-blue-400 transition`}
              onClick={() => setSelectedTime(slot)}
            >
              {slot}
            </button>
          ))}
        </div>
      </div>

      {/* Book Appointment Button */}
      <button
        onClick={handleBooking}
        className="mt-6 px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition duration-300 w-full"
      >
        Book Appointment
      </button>
    </div>
  );
};

export default Appointment;
