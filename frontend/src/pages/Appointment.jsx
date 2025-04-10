import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { axiosinstance } from '../components/utilities/axiosinstance';
import { Form, Input, Button, Select, message, DatePicker, TimePicker, Spin, Empty, List, Card, Tag } from 'antd';
// import { useAuth } from '../context/AuthContext';
import { useParams } from 'react-router-dom';
import moment from 'moment';
import { useSelector } from 'react-redux';
import ColumnGroup from 'antd/es/table/ColumnGroup';

const Appointment = () => {

  const {user} = useSelector((state) => state.user);
  const params = useParams();
  const [doctor, setDoctor] = useState([]);
  const [date, setDate] = useState("");
  const [time, setTime] = useState();
  const [isAvailable, setIsAvailable] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);

  const getAllDoc = async () => {
    try {
      const res = await axiosinstance.post(
        "/doctor/getDoctorbyId",{doctorId: params.doctorId},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        }
      );
      if (res.data.success) {
        setDoctor(res.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleAvailbility = async () => {
    try {
      if(!date || !time) {
        return message.error("Please select both date and time");
      }

      // Reset availability before checking
      setIsAvailable(false);

      const res = await axiosinstance.post(
        'user/bookAvailablity', 
        {
          doctorId: params.doctorId,
          date,
          time
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (res.data.success) {
        setIsAvailable(true);
        message.success(res.data.message);
      } else {
        message.error(res.data.message);
      }
    } catch (error) {
      console.log(error);
      message.error("Error checking availability");
    }
  }

  const handleBookNow = async () => {
    try {
      if(!date || !time){
        return alert("Please select both date and time");
      }

      const res = await axiosinstance.post(
        'user/bookAppointment', 
        {
          doctorId: params.doctorId,
          userId: user._id,
          doctorInfo: doctor,
          userInfo: user,
          date: date,
          time: time,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (res.data.success) {
        message.success(res.data.message);
        setIsAvailable(false);
        setDate("");
        setTime("");
      }
    } catch (error) {
      console.log(error);
      message.error("Error booking appointment");
    }
  }

  const getAppointments = async () => {
    try {
      setLoading(true);
      const res = await axiosinstance.get('/user/userAppointments');
      if (res.data.success) {
        setAppointments(res.data.data);
      }
    } catch (error) {
      console.error('Error fetching appointments:', error);
      message.error('Failed to fetch appointments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllDoc();
    getAppointments();
  }, []); 

  // const navigate = useNavigate();
  // const { user } = useAuth();
  // const [form] = Form.useForm();

  // const onFinish = async (values) => {
  //   try {
  //     const response = await axiosinstance.post('/appointments/create', {
  //       ...values,
  //       userId: user._id
  //     });
  //     if (response.data.success) {
  //       message.success('Appointment booked successfully!');
  //       navigate('/appointments');
  //     }
  //   } catch (error) {
  //     message.error('Failed to book appointment. Please try again.');
  //   }
  // };

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white shadow-xl rounded-lg mt-8 border border-gray-200">
      <h1 className="text-3xl font-bold mb-8 text-center text-blue-700 border-b pb-4">Book an Appointment</h1>
      {/* <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        className="max-w-md mx-auto p-6"
      >
        <Form.Item
          name="doctorId"
          label="Select Doctor"
          rules={[{ required: true, message: 'Please select a doctor' }]}
        >
          <Select placeholder="Select a doctor">
            <Select.Option value="1">Dr. John Doe</Select.Option>
            <Select.Option value="2">Dr. Jane Smith</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="date"
          label="Appointment Date"
          rules={[{ required: true, message: 'Please select a date' }]}
        >
          <Input type="date" />
        </Form.Item>

        <Form.Item
          name="time"
          label="Appointment Time"
          rules={[{ required: true, message: 'Please select a time' }]}
        >
          <Select placeholder="Select a time">
            <Select.Option value="09:00">9:00 AM</Select.Option>
            <Select.Option value="10:00">10:00 AM</Select.Option>
            <Select.Option value="11:00">11:00 AM</Select.Option>
            <Select.Option value="14:00">2:00 PM</Select.Option>
            <Select.Option value="15:00">3:00 PM</Select.Option>
            <Select.Option value="16:00">4:00 PM</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="reason"
          label="Reason for Visit"
          rules={[{ required: true, message: 'Please enter the reason for visit' }]}
        >
          <Input.TextArea rows={4} />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" className="w-full">
            Book Appointment
          </Button>
        </Form.Item>
      </Form> */}

      <div className="flex flex-col md:flex-row gap-8 mt-4">
        {doctor && (
          <>
            <div className="md:w-1/2 bg-blue-50 p-6 rounded-lg shadow-md">
              <div className="text-center mb-4">
                <div className="w-24 h-24 bg-blue-100 rounded-full mx-auto flex items-center justify-center mb-4">
                  <span className="text-4xl">👨‍⚕️</span>
                </div>
                <h5 className="text-2xl font-bold text-gray-800">Dr. {doctor.firstName} {doctor.lastName}</h5>
              </div>
              <div className="space-y-2">
                <div className="flex items-center p-2 bg-white rounded-md shadow-sm">
                  <span className="text-blue-600 mr-2">💰</span>
                  <h5 className="font-medium">Fees: <span className="font-bold text-blue-700">${doctor.fees}</span></h5>
                </div>
                <div className="flex items-center p-2 bg-white rounded-md shadow-sm">
                  <span className="text-blue-600 mr-2">🔬</span>
                  <h5 className="font-medium">Specialization: <span className="font-bold text-blue-700">{doctor.specialization}</span></h5>
                </div>
                {doctor?.timings && doctor.timings.length >= 2 && (
                  <div className="flex items-center p-2 bg-white rounded-md shadow-sm">
                    <span className="text-blue-600 mr-2">🕒</span>
                    <p className="font-medium">Available Hours: <span className="font-bold text-blue-700">{doctor.timings[0]} - {doctor.timings[1]}</span></p>
                  </div>
                )}
              </div>
            </div>
            
            <div className="md:w-1/2 bg-gray-50 p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-bold mb-4 text-gray-800 border-b pb-2">Schedule Appointment</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Select Date</label>
                  <DatePicker 
                    format="DD-MM-YYYY" 
                    onChange={(value)=>{setIsAvailable(false); setDate(moment(value).format("DD-MM-YYYY"))}}
                    className="w-full border-2 border-gray-300 rounded-md hover:border-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Select Time</label>
                  <TimePicker 
                    format="HH:mm" 
                    onChange={(value)=>{setIsAvailable(false); setTime(moment(value).format("HH:mm"))}}
                    className="w-full border-2 border-gray-300 rounded-md hover:border-blue-500 focus:border-blue-500"
                  />
                </div>
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition duration-300 shadow-md mt-4" onClick={handleAvailbility}>
                  Check Availability
                </button>
                {isAvailable && (
                  <button 
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md transition duration-300 shadow-md mt-4" 
                    onClick={handleBookNow}
                    disabled={!date || !time}
                  >
                    Book Now
                  </button>
                )}
              </div>
            </div>
          </>
        )}
      </div>

      <div className="mt-8">
        <h2>My Appointments</h2>
        {loading ? (
          <Spin />
        ) : appointments.length === 0 ? (
          <Empty description="No appointments found" />
        ) : (
          <List
            dataSource={appointments}
            renderItem={(appointment) => (
              <List.Item>
                <Card style={{ width: '100%' }}>
                  <div className="appointment-card">
                    <div className="doctor-info">
                      <h3>Dr. {appointment.doctorId?.name}</h3>
                      <p>Specialization: {appointment.doctorId?.specialization}</p>
                      <p>Experience: {appointment.doctorId?.experience} years</p>
                      <p>Fees: ₹{appointment.doctorId?.fees}</p>
                    </div>
                    <div className="appointment-details">
                      <p>Date: {new Date(appointment.date).toLocaleDateString()}</p>
                      <p>Time: {appointment.time}</p>
                      <p>Status: <Tag color={appointment.status === 'pending' ? 'orange' : appointment.status === 'approved' ? 'green' : 'red'}>{appointment.status}</Tag></p>
                    </div>
                  </div>
                </Card>
              </List.Item>
            )}
          />
        )}
      </div>
    </div>
  );
};

export default Appointment;
