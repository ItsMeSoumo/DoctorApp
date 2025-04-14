import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { axiosinstance } from '../components/utilities/axiosinstance';
import { Form, Input, Button, Select, message, DatePicker, TimePicker, Spin, Empty, List, Card, Tag, Switch } from 'antd';
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
  const [isOnlineVisit, setIsOnlineVisit] = useState(false);

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

  const handleAvailability = async () => {
    try {
      if(!date || !time) {
        return message.error("Please select both date and time");
      }

      console.log("Sending availability check:", {
        date: date,
        time: time
      });

      // Reset availability before checking
      setIsAvailable(false);

      const res = await axiosinstance.post(
        'user/bookAvailability',
        {
          doctorId: params.doctorId,
          date: date,
          time: time
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
        setIsAvailable(false);
        message.error(res.data.message);
      }
    } catch (error) {
      console.log("Availability check error:", error);
      setIsAvailable(false);
      message.error(error.response?.data?.message || "Error checking availability");
    }
  }

  const handleBookNow = async () => {
    try {
      if(!date || !time){
        return message.error("Please select both date and time");
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
          isOnlineVisit: isOnlineVisit,
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
        getAppointments(); // Refresh the appointments list
      } else {
        message.error(res.data.message);
      }
    } catch (error) {
      console.log(error);
      message.error(error.response?.data?.message || "Error booking appointment");
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
    <div className="max-w-5xl mx-auto p-8 bg-gradient-to-b from-white to-blue-50 shadow-2xl rounded-xl mt-8 border border-blue-100">
      <h1 className="text-3xl font-bold mb-8 text-center text-blue-800 border-b border-blue-200 pb-4">
        <span className="inline-block bg-blue-100 rounded-full p-2 mr-2">🩺</span>
        Book an Appointment
      </h1>

      <div className="flex flex-col md:flex-row gap-8 mt-6">
        {doctor && (
          <>
            <div className="md:w-1/2 bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl shadow-lg border border-blue-100 transition-all duration-300 hover:shadow-xl">
              <div className="text-center mb-6">
                <div className="w-28 h-28 bg-gradient-to-r from-blue-200 to-indigo-200 rounded-full mx-auto flex items-center justify-center mb-4 shadow-md">
                  <span className="text-4xl">👨‍⚕️</span>
                </div>
                <h5 className="text-2xl font-bold text-indigo-900">Dr. {doctor.firstName} {doctor.lastName}</h5>
              </div>
              <div className="space-y-3">
                <div className="flex items-center p-3 bg-white rounded-lg shadow-sm transition-all duration-300 hover:shadow-md hover:bg-blue-50">
                  <span className="text-blue-600 text-xl mr-3">💰</span>
                  <h5 className="font-medium text-gray-700">Fees: <span className="font-bold text-blue-700">₹{doctor.fees}</span></h5>
                </div>
                <div className="flex items-center p-3 bg-white rounded-lg shadow-sm transition-all duration-300 hover:shadow-md hover:bg-blue-50">
                  <span className="text-blue-600 text-xl mr-3">🔬</span>
                  <h5 className="font-medium text-gray-700">Specialization: <span className="font-bold text-blue-700">{doctor.specialization}</span></h5>
                </div>
                {doctor?.timings && doctor.timings.length >= 2 && (
                  <div className="flex items-center p-3 bg-white rounded-lg shadow-sm transition-all duration-300 hover:shadow-md hover:bg-blue-50">
                    <span className="text-blue-600 text-xl mr-3">🕒</span>
                    <p className="font-medium text-gray-700">Available Hours: <span className="font-bold text-blue-700">{doctor.timings[0]} - {doctor.timings[1]}</span></p>
                  </div>
                )}
              </div>
            </div>
            
            <div className="md:w-1/2 bg-white p-6 rounded-xl shadow-lg border border-gray-100 transition-all duration-300 hover:shadow-xl">
              <h3 className="text-xl font-bold mb-5 text-indigo-900 border-b border-gray-200 pb-3 flex items-center">
                <span className="inline-block bg-indigo-100 rounded-full p-1 mr-2 text-indigo-600">🗓️</span>
                Schedule Appointment
              </h3>
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Select Date</label>
                  <DatePicker 
                    format="DD-MM-YYYY"
                    disabledDate={(current) => {
                      // Can't select days before today
                      return current && current < moment().startOf('day');
                    }}
                    onChange={(value) => {
                      setIsAvailable(false);
                      setDate(value ? moment(value).format("DD-MM-YYYY") : "");
                    }}
                    className="w-full border-2 border-gray-200 rounded-lg hover:border-blue-400 focus:border-blue-500 p-2"
                    style={{ height: '45px' }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Select Time</label>
                  <TimePicker 
                    format="HH:mm"
                    minuteStep={30}
                    onChange={(value) => {
                      setIsAvailable(false);
                      // Ensure we're using 24-hour format
                      setTime(value ? value.format("HH:mm") : "");
                    }}
                    disabledHours={() => {
                      const hours = [];
                      for (let i = 0; i < 24; i++) {
                        if (i < 9 || i > 17) hours.push(i);
                      }
                      return hours;
                    }}
                    className="w-full border-2 border-gray-200 rounded-lg hover:border-blue-400 focus:border-blue-500 p-2"
                    style={{ height: '45px' }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Visit Type</label>
                  <Select
                    className="w-full"
                    value={isOnlineVisit ? 'online' : 'offline'}
                    onChange={(value) => setIsOnlineVisit(value === 'online')}
                    size="large"
                    style={{ height: '45px' }}
                  >
                    <Select.Option value="offline">
                      <div className="flex items-center">
                        <span className="mr-2">🏥</span> In-Person Visit
                      </div>
                    </Select.Option>
                    <Select.Option value="online">
                      <div className="flex items-center">
                        <span className="mr-2">💻</span> Online Consultation
                      </div>
                    </Select.Option>
                  </Select>
                </div>
                <button 
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition duration-300 shadow-md mt-4 flex items-center justify-center"
                  onClick={handleAvailability}
                >
                  <span className="mr-2">🔍</span> Check Availability
                </button>
                {isAvailable && (
                  <button 
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg transition duration-300 shadow-md mt-4 flex items-center justify-center"
                    onClick={handleBookNow}
                    disabled={!date || !time}
                  >
                    <span className="mr-2">✅</span> Book Now
                  </button>
                )}
              </div>
            </div>
          </>
        )}
      </div>

      <div className="mt-12 bg-white p-6 rounded-xl shadow-lg border border-gray-100">
        <h2 className="text-2xl font-bold mb-6 text-indigo-900 border-b border-gray-200 pb-3 flex items-center">
          <span className="inline-block bg-indigo-100 rounded-full p-1 mr-2 text-indigo-600">📋</span>
          My Appointments
        </h2>
        {loading ? (
          <div className="flex justify-center py-8">
            <Spin size="large" />
          </div>
        ) : appointments.length === 0 ? (
          <Empty 
            description={
              <span className="text-gray-500 text-lg">No appointments found</span>
            }
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            className="py-12"
          />
        ) : (
          <List
            dataSource={appointments}
            className="appointment-list"
            renderItem={(appointment) => (
              <List.Item className="py-2">
                <Card 
                  className="w-full transition-all duration-300 hover:shadow-lg border border-gray-200 rounded-xl overflow-hidden"
                  bodyStyle={{ padding: 0 }}
                >
                  <div className="appointment-card grid grid-cols-1 md:grid-cols-2">
                    <div className="doctor-info bg-gradient-to-r from-blue-50 to-indigo-50 p-6 border-b md:border-b-0 md:border-r border-gray-200">
                      <div className="flex items-center mb-3">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                          <span className="text-xl">👨‍⚕️</span>
                        </div>
                        <h3 className="text-xl font-bold text-indigo-900">Dr. {appointment.doctorId?.firstName} {appointment.doctorId?.lastName}</h3>
                      </div>
                      <div className="space-y-2 ml-1">
                        <p className="flex items-center text-gray-700">
                          <span className="w-6 text-blue-600 mr-2">🔬</span>
                          <span className="font-medium">Specialization:</span> 
                          <span className="ml-2 font-semibold text-blue-700">{appointment.doctorId?.specialization}</span>
                        </p>
                        <p className="flex items-center text-gray-700">
                          <span className="w-6 text-blue-600 mr-2">🧪</span>
                          <span className="font-medium">Experience:</span> 
                          <span className="ml-2 font-semibold text-blue-700">{appointment.doctorId?.experience} years</span>
                        </p>
                        <p className="flex items-center text-gray-700">
                          <span className="w-6 text-blue-600 mr-2">💰</span>
                          <span className="font-medium">Fees:</span> 
                          <span className="ml-2 font-semibold text-blue-700">₹{appointment.doctorId?.fees}</span>
                        </p>
                      </div>
                    </div>
                    <div className="appointment-details p-6 bg-white">
                      <h4 className="text-lg font-bold mb-3 text-gray-800">Appointment Details</h4>
                      <div className="space-y-3">
                        <p className="flex items-center text-gray-700">
                          <span className="w-6 text-blue-600 mr-2">📅</span>
                          <span className="font-medium">Date:</span> 
                          <span className="ml-2 font-semibold">{moment(appointment.date).format("DD-MM-YYYY")}</span>
                        </p>
                        <p className="flex items-center text-gray-700">
                          <span className="w-6 text-blue-600 mr-2">🕒</span>
                          <span className="font-medium">Time:</span> 
                          <span className="ml-2 font-semibold">{appointment.time}</span>
                        </p>
                        <p className="flex items-center text-gray-700">
                          <span className="w-6 text-blue-600 mr-2">🚦</span>
                          <span className="font-medium">Status:</span> 
                          <Tag 
                            className="ml-2"
                            color={
                              appointment.status === 'pending' ? 'orange' : 
                              appointment.status === 'approved' ? 'green' : 'red'
                            }
                          >
                            {appointment.status}
                          </Tag>
                        </p>
                        <p className="flex items-center text-gray-700">
                          <span className="w-6 text-blue-600 mr-2">🏥</span>
                          <span className="font-medium">Visit Type:</span> 
                          <Tag 
                            className="ml-2"
                            color={appointment.isOnlineVisit ? 'blue' : 'purple'}
                          >
                            {appointment.isOnlineVisit ? 'Online' : 'In-Person'}
                          </Tag>
                        </p>
                      </div>
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