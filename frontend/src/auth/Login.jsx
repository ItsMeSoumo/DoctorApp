import React from "react";
import '@ant-design/v5-patch-for-react-19';
import { Form, Input, Button, message } from "antd";
import { useDispatch } from "react-redux";
import { showLoading, hideLoading } from "../redux/features/alert.slice";
import { useNavigate } from "react-router-dom";
import { axiosinstance } from '../components/utilities/axiosinstance.js';


const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onFinish = async (values) => {
    try {
      dispatch(showLoading());
      const res = await axiosinstance.post('/user/login', values); 
      dispatch(hideLoading());

      if (res.data.success) {
        localStorage.setItem("token", res.data.token);
        message.success(res.data.message);
        navigate("/");
      } else {
        message.error(res.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      console.log(error);
      message.error(error.response?.data?.message || "Something went wrong");
    }
  };


  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>

        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item
            name="email"
            label="Email"
            rules={[{ required: true, message: "Please enter your email!" }]}
          >
            <Input placeholder="Enter your email" />
          </Form.Item>

          <Form.Item
            name="password"
            label="Password"
            rules={[{ required: true, message: "Please enter your password!" }]}
          >
            <Input.Password placeholder="Enter your password" />
          </Form.Item>

          <Button type="primary" htmlType="submit" className="w-full">
            Login
          </Button>
        </Form>

        <p className="text-sm mt-4 text-center">
          Don't have an account?{" "}
          <span
            className="text-blue-500 cursor-pointer"
            onClick={() => navigate("/signup")}
          >
            Sign Up
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;
