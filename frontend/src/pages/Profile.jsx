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
      <div className="flex items-center justify-center min-h-screen">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4">
        <Card className="shadow-lg">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Profile</h1>
            <div className="space-x-4">
              {!isEdit ? (
                <Button type="primary" onClick={() => setIsEdit(true)}>
                  Edit Profile
                </Button>
              ) : (
                <Button type="primary" onClick={handleFinish} loading={loading}>
                  Save Changes
                </Button>
              )}
              <Button onClick={handleLogOut} danger>
                Logout
              </Button>
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <UserOutlined className="text-gray-400 text-xl" />
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  value={userData.name}
                  onChange={(e) => handleInputChange(e, "name")}
                  disabled={!isEdit || loading}
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                />
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <MailOutlined className="text-gray-400 text-xl" />
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={userData.email}
                  onChange={(e) => handleInputChange(e, "email")}
                  disabled={!isEdit || loading}
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                />
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <PhoneOutlined className="text-gray-400 text-xl" />
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone
                </label>
                <input
                  type="tel"
                  value={userData.phone}
                  onChange={(e) => handleInputChange(e, "phone")}
                  disabled={!isEdit || loading}
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                />
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <TeamOutlined className="text-gray-400 text-xl" />
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Gender
                </label>
                <Select
                  value={userData.gender}
                  onChange={handleGenderChange}
                  disabled={!isEdit || loading}
                  className="w-full"
                  placeholder="Select gender"
                >
                  <Option value="male">Male</Option>
                  <Option value="female">Female</Option>
                  <Option value="other">Other</Option>
                </Select>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
