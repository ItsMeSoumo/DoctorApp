import React, { useState, useEffect } from 'react';
import { Table, message } from 'antd';
import { axiosinstance } from '../components/utilities/axiosinstance';
import { useSelector } from 'react-redux';
import moment from 'moment';

const UserAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const { user } = useSelector(state => state.user);

  // Fetch Appointments
  const getAppointments = async () => {
    try {
      const res = await axiosinstance.get('/user/userAppointments', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (res.data.success) {
        setAppointments(res.data.data);
      }
    } catch (error) {
      message.error('Error fetching appointments');
    }
  };

  useEffect(() => {
    getAppointments();
  }, []);

  // Upload Handler (Updated)
  const handleFileUpload = async (file, appointmentId) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('appointmentId', appointmentId); // agar controller me le raha ho

    try {
      const res = await axiosinstance.post('/user/upload-report', formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      if (res.data.success) {
        message.success('File uploaded successfully');
        getAppointments(); // Refresh after upload
      } else {
        message.error(res.data.message || 'Upload failed');
      }
    } catch (error) {
      console.log(error);
      message.error('Something went wrong while uploading file');
    }
  };

  // Table Columns
  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      render: (text, record) => (
        <span>
          Dr. {record.doctorId.firstName}{" "}{record.doctorId.lastName}
        </span>
      ),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      render: (text, record) => <span>{record.doctorId.email}</span>,
    },
    {
      title: 'Date & Time',
      dataIndex: 'date',
      render: (text, record) => (
        <span>
          {moment(record.date).format('DD-MM-YYYY')} {moment(record.time).format('HH:mm')}
        </span>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
    },
    {
      title: 'Upload File',
      render: (text, record) => (
        <div>
          <label className="cursor-pointer px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition duration-200">
            Upload File
            <input
              type="file"
              accept="image/*,application/pdf"
              onChange={(e) => handleFileUpload(e.target.files[0], record._id)}
              className="hidden"
            />
          </label>
          {record.attachment && (
            <a
              href={`http://localhost:5000/${record.attachment}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline block mt-2"
            >
              View File
            </a>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8 text-center text-blue-600">My Appointments</h1>
      <div className="bg-white rounded-lg shadow-md p-6">
        <Table
          columns={columns}
          dataSource={appointments}
          rowKey="_id"
          pagination={{ pageSize: 10 }}
        />
      </div>
    </div>
  );
};

export default UserAppointments;
