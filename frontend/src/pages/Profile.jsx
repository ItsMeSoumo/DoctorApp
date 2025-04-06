import React, { useState, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import '@ant-design/v5-patch-for-react-19';
import me from "../assets/me.jpg";
import { message } from "antd";

const Profile = () => {
  const navigate = useNavigate();

  const handleLogOut = () => {
    localStorage.clear()
    message.success("Logged out Succesfully")
    navigate("/login")
  }

  const [userData, setUserData] = useState(() => {
    const savedData = localStorage.getItem("userData");
    return savedData
      ? JSON.parse(savedData)
      : {
          name: "User",
          age: "",
          email: "",
          phone: "",
          gender: "",
          image: me,
        };
  });

  const [isEdit, setIsEdit] = useState(false);

  // ✅ Input change function
  const handleInputChange = (e, field) => {
    setUserData((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
  };

  // ✅ Image Upload Function
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUserData((prev) => ({
          ...prev,
          image: reader.result, 
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Remove Image
  const handleRemoveImage = () => {
    setUserData((prev) => ({
      ...prev,
      image: "", 
    }));
  };

  // Save updated data in localStorage
  const handleSave = () => {
    localStorage.setItem("userData", JSON.stringify(userData));
    setIsEdit(false);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg mt-12">
      <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
        {/* Profile Image */}
        <div className="relative w-48 h-48 flex-shrink-0">
          {userData.image ? (
            <img
              src={userData.image}
              alt={`${userData.name}'s profile`}
              className="w-full h-full rounded-full object-cover border-4 border-gray-200"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-300 rounded-full border-4 border-gray-200">
              <span className="text-gray-600">No Image</span>
            </div>
          )}

          {isEdit && (
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 flex gap-2">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="bg-white text-xs p-1 rounded cursor-pointer"
              />
              {userData.image && (
                <button
                  onClick={handleRemoveImage}
                  className="bg-red-500 text-white px-2 py-1 text-xs rounded"
                >
                  Remove
                </button>
              )}
            </div>
          )}
        </div>

        {/* User Information */}
        <div className="flex-1 text-center md:text-left">
          {/* Name Field */}
          <div className="flex items-center gap-2 mb-4">
            {isEdit ? (
              <input
                type="text"
                value={userData.name}
                onChange={(e) => handleInputChange(e, "name")}
                className="text-2xl font-bold text-gray-900 border-b-2 border-blue-500 focus:outline-none"
              />
            ) : (
              <h2 className="text-2xl font-bold text-gray-900">{userData.name}</h2>
            )}
            <button
              onClick={() => setIsEdit(!isEdit)}
              className="p-2 text-blue-500 hover:text-blue-600"
            >
              {isEdit ? "✓" : "✎"}
            </button>
          </div>

          {/* Editable Fields */}
          <div className="space-y-2">
            {["email", "phone", "age", "gender"].map((field) => (
              <div key={field} className="flex items-center gap-2">
                <span className="font-medium capitalize">{field}:</span>
                {isEdit ? (
                  <input
                    type={field === "age" ? "number" : "text"}
                    value={userData[field]}
                    onChange={(e) => handleInputChange(e, field)}
                    className="border-b-2 border-gray-300 focus:border-blue-500 outline-none flex-1"
                  />
                ) : (
                  <span>{userData[field]}</span>
                )}
              </div>
            ))}
          </div>

          {isEdit && (
            <button
              onClick={handleSave}
              className="mt-4 bg-green-500 text-white py-2 px-4 rounded-lg"
            >
              Save Changes
            </button>
          )}
        </div>
      </div>

      {/* Navigation Button */}
      <button
        onClick={() => navigate("/my")}
        className="w-full mt-6 bg-blue-500 text-white py-3 px-4 rounded-lg"
      >
        My Appointments
      </button>

      {/*Log Out*/}
      <button
        onClick={handleLogOut}
        className="w-full mt-6 bg-blue-500 text-white py-3 px-4 rounded-lg"
      >
        Log Out
      </button>
    </div>
  );
};

export default Profile;
