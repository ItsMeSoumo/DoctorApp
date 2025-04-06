import React from "react";
import '@ant-design/v5-patch-for-react-19';
import { Form, Input, Select, Button, message, InputNumber, TimePicker, Row, Col } from "antd";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { showLoading, hideLoading } from "../redux/features/alert.slice";
import { axiosinstance } from "../components/utilities/axiosinstance";
import moment from 'moment';

const { Option } = Select;
const { RangePicker } = TimePicker;

const ApplyDoctors = () => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const specializations = [
    'Cardiology', 'Dermatology', 'Neurology', 'Pediatrics', 'Psychiatry', 'Orthopedics'
  ];

  const { user } = useSelector((state) => state.user);

  const handleApplyDoc = async (values) => {
    try {
      const formattedValues = {
        ...values,
        userId: user._id,
        timings: values.timings ? [
          values.timings[0].format('HH:mm'),
          values.timings[1].format('HH:mm')
        ] : []
      };

      dispatch(showLoading());
      const res = await axiosinstance.post(
        '/user/apply-doctors',
        formattedValues,
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      dispatch(hideLoading());

      if (res.data.success) {
        message.success("Application submitted successfully!");
        navigate('/');
      } else {
        message.error(res.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      console.error(error);
      message.error("Something went wrong");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-8 py-12">
      <div className="bg-white p-10 rounded-lg shadow-lg w-full max-w-4xl">
        <h2 className="text-3xl font-semibold text-center mb-6">Doctor Registration</h2>

        <Form form={form} layout="vertical" onFinish={handleApplyDoc}>
          <Row gutter={16}>
            {/* First Name */}
            <Col span={12}>
              <Form.Item name="firstName" label="First Name" rules={[{ required: true }]}>
                <Input placeholder="Enter First Name" />
              </Form.Item>
            </Col>

            {/* Last Name */}
            <Col span={12}>
              <Form.Item name="lastName" label="Last Name" rules={[{ required: true }]}>
                <Input placeholder="Enter Last Name" />
              </Form.Item>
            </Col>

            {/* Email */}
            <Col span={12}>
              <Form.Item name="email" label="Email" rules={[{ required: true, type: "email" }]}>
                <Input placeholder="Enter Email Address" />
              </Form.Item>
            </Col>

            {/* Specialization */}
            <Col span={12}>
              <Form.Item name="specialization" label="Specialization" rules={[{ required: true }]}>
                <Select placeholder="Select a Specialization">
                  {specializations.map((spec) => (
                    <Option key={spec} value={spec}>{spec}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            {/* Experience */}
            <Col span={12}>
              <Form.Item name="experience" label="Experience (Years)" rules={[{ required: true }]}>
                <InputNumber min={0} max={50} style={{ width: "100%" }} placeholder="Experience in Years" />
              </Form.Item>
            </Col>

            {/* Fees */}
            <Col span={12}>
              <Form.Item name="fees" label="Consultation Fees" rules={[{ required: true }]}>
                <InputNumber min={0} style={{ width: "100%" }} placeholder="Enter Fees" />
              </Form.Item>
            </Col>

            {/* Timings */}
            <Col span={12}>
              <Form.Item name="timings" label="Available Timings" rules={[{ required: true }]}>
                <RangePicker format="HH:mm" style={{ width: "100%" }} placeholder={["Start Time", "End Time"]} />
              </Form.Item>
            </Col>

            {/* Password */}
            <Col span={12}>
              <Form.Item name="password" label="Password" rules={[{ required: true }]}>
                <Input.Password placeholder="Enter Password" />
              </Form.Item>
            </Col>
          </Row>

          {/* Submit Button */}
          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Register as Doctor
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default ApplyDoctors;
