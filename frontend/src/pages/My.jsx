import React, { useState } from "react";

const My = () => {
  // Sample Appointments Data
  const [appointments] = useState([
    { id: 1, doctor: "Dr. Arjun Mehta", date: "2025-02-25", time: "10:30 AM", status: "upcoming" },
    { id: 2, doctor: "Dr. Riya Sharma", date: "2025-02-10", time: "2:00 PM", status: "past" },
    { id: 3, doctor: "Dr. Neha Kapoor", date: "2025-03-05", time: "11:00 AM", status: "upcoming" },
    { id: 4, doctor: "Dr. Amit Khanna", date: "2025-01-15", time: "4:30 PM", status: "past" }
  ]);

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-10">
      <h2 className="text-3xl font-bold text-blue-600 mb-6 text-center">
        My Appointments 🏥
      </h2>

      {/* Upcoming Appointments */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-gray-800 mb-3">📅 Upcoming Appointments</h3>
        <ul className="space-y-3">
          {appointments.filter(app => app.status === "upcoming").length > 0 ? (
            appointments
              .filter(app => app.status === "upcoming")
              .map(app => (
                <li key={app.id} className="p-4 border rounded-lg shadow-md bg-blue-50">
                  <p className="font-medium text-blue-800">👨‍⚕️ {app.doctor}</p>
                  <p className="text-gray-700">📆 {app.date} | ⏰ {app.time}</p>
                </li>
              ))
          ) : (
            <p className="text-gray-500">No upcoming appointments.</p>
          )}
        </ul>
      </div>

      {/* Past Appointments */}
      <div>
        <h3 className="text-xl font-semibold text-gray-800 mb-3">🕒 Past Appointments</h3>
        <ul className="space-y-3">
          {appointments.filter(app => app.status === "past").length > 0 ? (
            appointments
              .filter(app => app.status === "past")
              .map(app => (
                <li key={app.id} className="p-4 border rounded-lg shadow-md bg-gray-100">
                  <p className="font-medium text-gray-900">👨‍⚕️ {app.doctor}</p>
                  <p className="text-gray-600">📆 {app.date} | ⏰ {app.time}</p>
                </li>
              ))
          ) : (
            <p className="text-gray-500">No past appointments.</p>
          )}
        </ul>
      </div>
    </div>
  );
};

export default My;
