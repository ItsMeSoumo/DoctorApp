import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { axiosinstance } from '../components/utilities/axiosinstance';
import { Row, Col, Card, Button, message, Spin } from 'antd';
import { UserOutlined } from '@ant-design/icons';

const Doctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSpeciality, setSelectedSpeciality] = useState(null);

  const navigate = useNavigate();

  const getAllDoc = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        message.error("Please login to view doctors");
        navigate("/login");
        return;
      }
      const res = await axiosinstance.get("/user/getAllDoc");
      if (res.data.success) {
        setDoctors(res.data.data);
      } else {
        message.error(res.data.message || "Error fetching doctors");
      }
    } catch (error) {
      console.error("Error fetching doctors:", error);
      if (error.response?.status === 401) {
        message.error("Please login to view doctors");
        navigate("/login");
      } else {
        message.error(error.response?.data?.message || "Error fetching doctors");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      getAllDoc();
    } else {
      navigate("/login");
    }
  }, [navigate]);

  const specialties = ['All', 'Cardiology', 'Gynecology', 'Pediatrics', 'Neurology', 'Orthopedic', 'Dermatology'];

  return (
    <div className="flex flex-col items-center justify-center p-8 mt-5 max-w-[85rem] mx-auto rounded-lg space-y-10">
      {/* Main Content */}
      <div className="flex flex-row items-start justify-center space-x-10 w-full">
        {/* Left Side - Specialties */}
        <div className="w-1/4 flex flex-col space-y-4">
          <h2 className="text-xl font-bold">Browse Specialties</h2>
          {specialties.map((specialty, index) => (
            <button
              key={index}
              onClick={() => setSelectedSpeciality(specialty === 'All' ? null : specialty)}
              className={`p-3 rounded-lg text-left transition-colors ${
                (specialty === 'All' && !selectedSpeciality) || selectedSpeciality === specialty
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              {specialty}
            </button>
          ))}
        </div>

        {/* Right Side - Doctors List */}
        <div className="w-3/4">
          <h2 className="text-2xl font-bold mb-6 text-center">
            {selectedSpeciality ? `${selectedSpeciality} Doctors` : 'All Doctors'}
          </h2>
          {loading ? (
            <div className="text-center p-8">
              <Spin size="large" />
            </div>
          ) : (
            <Row gutter={[16, 16]} justify="center">
              {doctors && doctors.length > 0 ? (
                doctors
                  .filter(doctor => !selectedSpeciality || doctor.specialization === selectedSpeciality)
                  .map((doctor) => (
                    <Col key={doctor._id} xs={24} sm={12} md={8} lg={6}>
                      <Card
                        hoverable
                        className="h-full"
                        cover={
                          <div className="h-48 bg-gray-100 flex items-center justify-center">
                            <UserOutlined style={{ fontSize: '64px', color: '#1890ff' }} />
                          </div>
                        }
                      >
                        <Card.Meta
                          title={`Dr. ${doctor.firstName} ${doctor.lastName}`}
                          description={
                            <div>
                              <p>Specialization: {doctor.specialization}</p>
                              <p>Experience: {doctor.experience} years</p>
                              <p>Fees: ₹{doctor.fees}</p>
                              <p>Timings: {doctor.timings[0]} - {doctor.timings[1]}</p>
                              <p>Address: {doctor.location}</p>
                            </div>
                          }
                        />
                        <Button 
                          type="primary" 
                          className="mt-4 w-full"
                          onClick={() => navigate(`/doctor/appointment/${doctor._id}`)}
                        >
                          Book Appointment
                        </Button>
                      </Card>
                    </Col>
                  ))
              ) : (
                <Col span={24}>
                  <div className="text-center p-4">
                    <p>No doctors found. Please try a different specialty.</p>
                  </div>
                </Col>
              )}
              {doctors && doctors.length > 0 && doctors.filter(doctor => !selectedSpeciality || doctor.specialization === selectedSpeciality).length === 0 && (
                <Col span={24}>
                  <div className="text-center p-4">
                    <p className="text-lg font-medium text-gray-600">
                      {selectedSpeciality ? `There are no ${selectedSpeciality} doctors available at the moment.` : 'No doctors found.'}
                    </p>
                  </div>
                </Col>
              )}
            </Row>
          )}
        </div>
      </div>
    </div>
  );
};

export default Doctors;
