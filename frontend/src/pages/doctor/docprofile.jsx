import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '@ant-design/v5-patch-for-react-19';
import { Form, Input, Select, Button, message, InputNumber, Row, Col, TimePicker } from 'antd';
import { useSelector } from 'react-redux';
import moment from 'moment';
import { axiosinstance } from '../../components/utilities/axiosinstance.js';

const { RangePicker } = TimePicker;

const DocProfile = () => {
  const user = useSelector((state) => state.user.user);
  const [doctor, setDoctor] = useState(null);
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
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      if (res.data.success) {
        message.success("Profile updated successfully!");
        navigate('/');
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
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      if (res.data.success) {
        setDoctor(res.data.data.doctor);
      }
    } catch (error) {
      console.error("Error fetching doctor info:", error);
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

  if (!doctor || !user?._id) {
    return <div style={{ padding: '2rem' }}>Loading...</div>;
  }

  return (
    <div style={{ padding: '2rem' }}>
      <h2 className="text-xl font-semibold mb-4">Manage Doctor Profile</h2>

      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        initialValues={{
          ...doctor,
          timings: doctor.timings
            ? [
                moment(doctor.timings[0], 'HH:mm'),
                moment(doctor.timings[1], 'HH:mm')
              ]
            : []
        }}
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="firstName" label="First Name" rules={[{ required: true }]}>
              <Input placeholder="Enter first name" />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item name="lastName" label="Last Name" rules={[{ required: true }]}>
              <Input placeholder="Enter last name" />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item name="email" label="Email" rules={[{ required: true, type: "email" }]}>
              <Input placeholder="Enter email address" />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item name="specialization" label="Specialization" rules={[{ required: true }]}>
              <Select placeholder="Select specialization">
                {specializations.map((spec) => (
                  <Select.Option key={spec} value={spec}>{spec}</Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item name="experience" label="Experience (Years)" rules={[{ required: true }]}>
              <InputNumber min={0} max={50} style={{ width: "100%" }} placeholder="Years of experience" />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item name="fees" label="Consultation Fees" rules={[{ required: true }]}>
              <InputNumber min={0} style={{ width: "100%" }} placeholder="Enter consultation fee" />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item name="timings" label="Available Timings" rules={[{ required: true }]}>
              <RangePicker format="HH:mm" style={{ width: "100%" }} placeholder={["Start Time", "End Time"]} />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item name="password" label="Password">
              <Input.Password placeholder="Change password (optional)" />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            Save Profile
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default DocProfile;
