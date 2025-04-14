import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import '@ant-design/v5-patch-for-react-19';
import { message, Select, Button, Card, Spin } from "antd";
import { axiosinstance } from "../components/utilities/axiosinstance.js";
import { useSelector } from "react-redux";
import { UserOutlined, MailOutlined, PhoneOutlined, TeamOutlined } from '@ant-design/icons';

const { Option } = Select;

const Profile = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.user.user);
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    phone: "",
    gender: "",
  });
  const [isEdit, setIsEdit] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogOut = () => {
    localStorage.clear();
    message.success("Logged out Successfully");
    navigate("/login");
  };

  const getUserInfo = async () => {
    try {
      setLoading(true);
      const res = await axiosinstance.get("/user/getUserData");
      if (res.data.success) {
        setUserData({
          name: res.data.data.name || "",
          email: res.data.data.email || "",
          phone: res.data.data.phone || "",
          gender: res.data.data.gender || ""
        });
      } else {
        message.error(res.data.message || "Failed to fetch user info");
      }
    } catch (error) {
      console.error("Error fetching user info:", error);
      message.error("Something went wrong while fetching user info");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && user._id) {
      getUserInfo();
    }
  }, [user]);

  const handleInputChange = (e, field) => {
    setUserData((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
  };

  const handleGenderChange = (value) => {
    setUserData((prev) => ({
      ...prev,
      gender: value,
    }));
  };

  const handleFinish = async () => {
    try {
      setLoading(true);
      if (!userData.name || !userData.email) {
        message.error("Name and email are required");
        return;
      }

      const updateData = {
        userId: user._id,
        name: userData.name,
        email: userData.email
      };

      if (userData.phone) updateData.phone = userData.phone;
      if (userData.gender) updateData.gender = userData.gender;

      const res = await axiosinstance.post("/user/updateUserInfo", updateData, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      
      if (res.data.success) {
        message.success("Profile updated successfully");
        setIsEdit(false);
        await getUserInfo();
      } else {
        message.error(res.data.message || "Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      if (error.response?.data?.message) {
        message.error(error.response.data.message);
      } else {
        message.error("Something went wrong while updating profile");
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-gray-100 py-12">
      <div className="max-w-3xl mx-auto px-4">
        <Card 
          className="shadow-xl rounded-xl border-0 overflow-hidden"
          bodyStyle={{ padding: '2rem' }}
        >
          <div className="flex justify-between items-center mb-8 border-b pb-6">
            <h1 className="text-3xl font-bold text-gray-800 flex items-center">
              <span className="bg-blue-100 p-2 rounded-full mr-3 text-blue-600">
                <UserOutlined className="text-xl" />
              </span>
              Profile
            </h1>
            <div className="space-x-3">
              {!isEdit ? (
                <Button 
                  type="primary" 
                  onClick={() => setIsEdit(true)}
                  size="large"
                  className="bg-blue-500 hover:bg-blue-600 border-0 font-medium shadow-md"
                >
                  Edit Profile
                </Button>
              ) : (
                <Button 
                  type="primary" 
                  onClick={handleFinish} 
                  loading={loading}
                  size="large"
                  className="bg-green-500 hover:bg-green-600 border-0 font-medium shadow-md"
                >
                  Save Changes
                </Button>
              )}
              <Button 
                onClick={handleLogOut} 
                danger 
                size="large"
                className="hover:bg-red-600 hover:text-white font-medium shadow-md"
              >
                Logout
              </Button>
            </div>
          </div>

          <div className="space-y-8">
            <div className="flex items-start space-x-6 bg-white p-5 rounded-lg shadow-sm hover:shadow-md transition-all duration-300">
              <div className="bg-blue-50 p-3 rounded-full text-blue-500">
                <UserOutlined className="text-2xl" />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={userData.name}
                  onChange={(e) => handleInputChange(e, "name")}
                  disabled={!isEdit || loading}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 transition-all duration-200"
                  placeholder="Enter your full name"
                />
              </div>
            </div>

            <div className="flex items-start space-x-6 bg-white p-5 rounded-lg shadow-sm hover:shadow-md transition-all duration-300">
              <div className="bg-green-50 p-3 rounded-full text-green-500">
                <MailOutlined className="text-2xl" />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={userData.email}
                  onChange={(e) => handleInputChange(e, "email")}
                  disabled={!isEdit || loading}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 transition-all duration-200"
                  placeholder="Enter your email address"
                />
              </div>
            </div>

            <div className="flex items-start space-x-6 bg-white p-5 rounded-lg shadow-sm hover:shadow-md transition-all duration-300">
              <div className="bg-purple-50 p-3 rounded-full text-purple-500">
                <PhoneOutlined className="text-2xl" />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={userData.phone}
                  onChange={(e) => handleInputChange(e, "phone")}
                  disabled={!isEdit || loading}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 transition-all duration-200"
                  placeholder="Enter your phone number"
                />
              </div>
            </div>

            <div className="flex items-start space-x-6 bg-white p-5 rounded-lg shadow-sm hover:shadow-md transition-all duration-300">
              <div className="bg-yellow-50 p-3 rounded-full text-yellow-500">
                <TeamOutlined className="text-2xl" />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Gender
                </label>
                <Select
                  value={userData.gender}
                  onChange={handleGenderChange}
                  disabled={!isEdit || loading}
                  className="w-full"
                  size="large"
                  placeholder="Select your gender"
                  dropdownStyle={{ borderRadius: '0.5rem' }}
                >
                  <Option value="male">Male</Option>
                  <Option value="female">Female</Option>
                  <Option value="other">Other</Option>
                </Select>
              </div>
            </div>
          </div>
          
          {isEdit && (
            <div className="mt-8 pt-6 border-t text-center">
              <p className="text-gray-500 text-sm mb-4">
                Make sure your profile information is up-to-date
              </p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default Profile;