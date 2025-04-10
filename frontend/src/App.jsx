import React from "react";
import { useSelector } from "react-redux";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Doctors from "./pages/Doctors"; 
import Contact from "./pages/Contact";
import Appointment from "./pages/Appointment";
import About from "./pages/About";
import My from "./pages/My";
import ApplyDoctors from "./pages/ApplyDoctors";
import Profile from "./pages/Profile";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";
import Footer from "./components/Footer";
import Login from "./auth/Login";
import Signup from "./auth/Signup";
import Notification from "./pages/Notification";
import Userlist from "./pages/admin/userlist";
import Doctorlist from "./pages/admin/doctorlist";
import Doctorprofile from "./pages/doctor/docprofile";
import UserAppointments from "./pages/UserAppointments";
import DoctorAppointments from "./pages/doctor/DoctorAppointments";
import DocHome from "./pages/doctor/DocHome";

const App = () => {
  // const { loading } = useSelector(state => state.alert); 

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex-grow">
        <Routes>
          <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
          <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />
          <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path="/doctors" element={<ProtectedRoute><Doctors /></ProtectedRoute>} />
          <Route path="/doctors/:speciality" element={<ProtectedRoute><Doctors /></ProtectedRoute>} />
          {/* <Route path="/appointment" element={<ProtectedRoute><BookAppointment /></ProtectedRoute>} /> */}
          <Route path="/appointment/:speciality" element={<ProtectedRoute><Appointment /></ProtectedRoute>} />
          <Route path="/my" element={<ProtectedRoute><My/></ProtectedRoute>} />
          <Route path="/my-profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/apply-doctors" element={<ProtectedRoute><ApplyDoctors /></ProtectedRoute>} />
          <Route path="/contact" element={<ProtectedRoute><Contact /></ProtectedRoute>} />
          <Route path="/about" element={<ProtectedRoute><About /></ProtectedRoute>} />
          <Route path="/notification" element={<ProtectedRoute><Notification /></ProtectedRoute>} />
          <Route path="/userlist" element={<ProtectedRoute><Userlist /></ProtectedRoute>} />
          <Route path="/doctorlist" element={<ProtectedRoute><Doctorlist /></ProtectedRoute>} />
          <Route path="/doctor/profile/:id" element={<ProtectedRoute><Doctorprofile /></ProtectedRoute>} />
          <Route path="/doctor/appointment/:doctorId" element={<ProtectedRoute><Appointment /></ProtectedRoute>} />
          <Route path="/userappointments" element={<ProtectedRoute><UserAppointments /></ProtectedRoute>} />
          <Route path="/doctor-appointments" element={<ProtectedRoute><DoctorAppointments /></ProtectedRoute>} />
          <Route path="/doctor-home" element={<ProtectedRoute><DocHome /></ProtectedRoute>} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
};

export default App;
