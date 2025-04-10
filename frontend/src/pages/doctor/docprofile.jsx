import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '@ant-design/v5-patch-for-react-19';
import { Form, Input, Select, Button, message, InputNumber, Row, Col, TimePicker, Card, Typography, Divider } from 'antd';
import { useSelector } from 'react-redux';
import moment from 'moment';
import { axiosinstance } from '../../components/utilities/axiosinstance.js';
import { UserOutlined, MailOutlined, PhoneOutlined, ClockCircleOutlined, EditOutlined, SaveOutlined, CloseOutlined } from '@ant-design/icons';

const { RangePicker } = TimePicker;
const { Title, Text } = Typography;

const DocProfile = () => {
  const user = useSelector((state) => state.user.user);
  const [doctor, setDoctor] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const specializations = [
    "Cardiologist",
    "Dermatologist",
    "Pediatrician",
    "Neurologist",
    "Orthopedic",
    "Psychiatrist"
  ];

  const handleFinish = async (values) => {
    try {
      const timings = values.timings
        ? [values.timings[0].format("HH:mm"), values.timings[1].format("HH:mm")]
        : [];

      const res = await axiosinstance.post('/doctor/updateDoctorInfo', 
        {
          ...values,
          userId: user?._id,
          timings: timings,
        }
      );

      if (res.data.success) {
        message.success("Profile updated successfully!");
        setIsEditing(false);
        getDoctorInfo(); // Refresh the data
      } else {
        message.error(res.data.message);
      }
    } catch (error) {
      console.error(error);
      message.error("Something went wrong");
    }
  };

  const getDoctorInfo = async () => {
    try {
      const res = await axiosinstance.post('/doctor/getDoctorInfo',
        {
          userId: user?._id,
        }
      );

      if (res.data.success) {
        setDoctor(res.data.data.doctor);
      } else {
        message.error(res.data.message || "Failed to fetch doctor info");
      }
    } catch (error) {
      console.error("Error fetching doctor info:", error);
      if (error.response?.status === 404) {
        message.error("Doctor profile not found. Please complete your profile.");
      } else {
        message.error("Something went wrong while fetching doctor info");
      }
    }
  };

  useEffect(() => {
    if (user && user._id) {
      getDoctorInfo();
    }
  }, [user]);

  useEffect(() => {
    if (doctor) {
      form.setFieldsValue({
        ...doctor,
        timings: doctor.timings
          ? [
              moment(doctor.timings[0], 'HH:mm'),
              moment(doctor.timings[1], 'HH:mm')
            ]
          : []
      });
    }
  }, [doctor, form]);

  if (!user?._id) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Title level={2}>Loading...</Title>
          <Text>Please wait while we fetch your profile information.</Text>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <Card 
          className="shadow-2xl border-0 rounded-xl bg-white/80 backdrop-blur-sm"
          bodyStyle={{ padding: '2.5rem' }}
        >
          <div className="flex justify-between items-center mb-12">
            <div className="text-center">
              <Title level={2} className="text-3xl font-bold text-gray-800 mb-2">Doctor Profile</Title>
              <Text className="text-gray-500 text-lg">Manage your professional information</Text>
            </div>
            {!isEditing ? (
              <Button 
                type="primary" 
                icon={<EditOutlined />}
                onClick={() => setIsEditing(true)}
                size="large"
                className="bg-blue-600 hover:bg-blue-700 border-0 shadow-md"
              >
                Edit Profile
              </Button>
            ) : (
              <Button 
                type="primary" 
                icon={<SaveOutlined />}
                onClick={() => form.submit()}
                size="large"
                className="bg-green-600 hover:bg-green-700 border-0 shadow-md"
              >
                Save Changes
              </Button>
            )}
          </div>

          <Form
            form={form}
            layout="vertical"
            onFinish={handleFinish}
            className="space-y-8"
            disabled={!isEditing}
          >
            <Row gutter={[24, 24]}>
              <Col xs={24} sm={12}>
                <Form.Item
                  label={<span className="text-gray-700 font-medium">First Name</span>}
                  name="firstName"
                  rules={[{ required: true, message: 'Please enter your first name' }]}
                >
                  <Input 
                    prefix={<UserOutlined className="text-gray-400" />} 
                    placeholder="Enter your first name"
                    className="rounded-lg hover:border-blue-400 focus:border-blue-500"
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item
                  label={<span className="text-gray-700 font-medium">Last Name</span>}
                  name="lastName"
                  rules={[{ required: true, message: 'Please enter your last name' }]}
                >
                  <Input 
                    prefix={<UserOutlined className="text-gray-400" />} 
                    placeholder="Enter your last name"
                    className="rounded-lg hover:border-blue-400 focus:border-blue-500"
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={[24, 24]}>
              <Col xs={24} sm={12}>
                <Form.Item
                  label={<span className="text-gray-700 font-medium">Email</span>}
                  name="email"
                  rules={[
                    { required: true, message: 'Please enter your email' },
                    { type: 'email', message: 'Please enter a valid email' }
                  ]}
                >
                  <Input 
                    prefix={<MailOutlined className="text-gray-400" />} 
                    placeholder="Enter your email"
                    className="rounded-lg hover:border-blue-400 focus:border-blue-500"
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item
                  label={<span className="text-gray-700 font-medium">Phone Number</span>}
                  name="phone"
                >
                  <Input 
                    prefix={<PhoneOutlined className="text-gray-400" />} 
                    placeholder="Enter your phone number (optional)"
                    className="rounded-lg hover:border-blue-400 focus:border-blue-500"
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={[24, 24]}>
              <Col xs={24} sm={12}>
                <Form.Item
                  label={<span className="text-gray-700 font-medium">Specialization</span>}
                  name="specialization"
                  rules={[{ required: true, message: 'Please select your specialization' }]}
                >
                  <Select 
                    placeholder="Select your specialization"
                    className="rounded-lg hover:border-blue-400 focus:border-blue-500"
                  >
                    {specializations.map((spec) => (
                      <Select.Option key={spec} value={spec}>{spec}</Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item
                  label={<span className="text-gray-700 font-medium">Experience (years)</span>}
                  name="experience"
                  rules={[{ required: true, message: 'Please enter your experience' }]}
                >
                  <InputNumber 
                    className="w-full rounded-lg hover:border-blue-400 focus:border-blue-500" 
                    min={0} 
                    max={50} 
                    placeholder="Years of experience"
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={[24, 24]}>
              <Col xs={24} sm={12}>
                <Form.Item
                  label={<span className="text-gray-700 font-medium">Consultation Fee</span>}
                  name="fees"
                  rules={[{ required: true, message: 'Please enter your consultation fee' }]}
                >
                  <InputNumber
                    className="w-full rounded-lg hover:border-blue-400 focus:border-blue-500"
                    min={0}
                    placeholder="Enter consultation fee"
                    formatter={value => `₹ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    parser={value => value.replace(/₹\s?|(,*)/g, '')}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item
                  label={<span className="text-gray-700 font-medium">Location</span>}
                  name="location"
                  tooltip="Enter your clinic/hospital location"
                >
                  <Input 
                    placeholder="Enter your location (optional)"
                    className="rounded-lg hover:border-blue-400 focus:border-blue-500"
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={[24, 24]}>
              <Col xs={24} sm={12}>
                <Form.Item
                  label={<span className="text-gray-700 font-medium">Available Timings</span>}
                  name="timings"
                  rules={[{ required: true, message: 'Please select your available timings' }]}
                >
                  <RangePicker 
                    format="HH:mm" 
                    className="w-full rounded-lg hover:border-blue-400 focus:border-blue-500"
                    placeholder={['Start Time', 'End Time']}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              label={<span className="text-gray-700 font-medium">Address</span>}
              name="address"
            >
              <Input.TextArea 
                rows={4} 
                placeholder="Enter your clinic address (optional)"
                className="rounded-lg hover:border-blue-400 focus:border-blue-500"
              />
            </Form.Item>

            <Form.Item
              label={<span className="text-gray-700 font-medium">About</span>}
              name="about"
            >
              <Input.TextArea 
                rows={4} 
                placeholder="Tell us about your professional experience and expertise (optional)"
                className="rounded-lg hover:border-blue-400 focus:border-blue-500"
              />
            </Form.Item>
          </Form>
        </Card>
      </div>
    </div>
  );
};

export default DocProfile;
