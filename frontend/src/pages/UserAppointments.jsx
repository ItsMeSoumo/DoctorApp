import React, { useState, useEffect } from 'react';
import { Table, message, Modal } from 'antd';
import { axiosinstance } from '../components/utilities/axiosinstance';
import { useSelector } from 'react-redux';
import moment from 'moment';

const UserAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewData, setPreviewData] = useState('');
  const [fileType, setFileType] = useState('');
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
    formData.append('appointmentId', appointmentId);

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

  const handlePreview = (base64Data) => {
    // Check if it's an image or PDF based on the first few characters
    const isPDF = base64Data.substring(0, 4) === 'JVBE'; // PDF magic number in base64
    setFileType(isPDF ? 'pdf' : 'image');
    setPreviewData(base64Data);
    setPreviewVisible(true);
  };

  const handleRemoveFile = async (appointmentId) => {
    try {
      const res = await axiosinstance.delete(`/user/remove-report/${appointmentId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (res.data.success) {
        message.success('File removed successfully');
        getAppointments(); // Refresh the list
      } else {
        message.error(res.data.message || 'Remove failed');
      }
    } catch (error) {
      console.log(error);
      message.error('Something went wrong while removing file');
    }
  };

  // Table Columns
  const columns = [
    {
      title: 'Name',
      dataIndex: ['doctorId', 'firstName'],
      render: (text, record) => (
        <span className="font-medium text-gray-800">
          Dr. {record.doctorId?.firstName} {record.doctorId?.lastName}
        </span>
      ),
      responsive: ['xs', 'sm', 'md', 'lg', 'xl']
    },
    {
      title: 'Email',
      dataIndex: ['doctorId', 'email'],
      render: (text, record) => (
        <span className="text-gray-600">
          {record.doctorId?.email}
        </span>
      ),
      responsive: ['md', 'lg', 'xl'] // Hide on mobile
    },
    {
      title: 'Date & Time',
      dataIndex: 'date',
      render: (text, record) => {
        // Convert the stored date (YYYY-MM-DD) to display format (DD-MM-YYYY)
        const displayDate = record.date ? moment(record.date).format('DD-MM-YYYY') : 'N/A';
        const displayTime = record.time || 'N/A';

        return (
          <div className="flex flex-col sm:flex-row sm:items-center">
            <span className="font-medium text-gray-700 mr-2">{displayDate}</span>
            <span className="text-gray-600">{displayTime}</span>
          </div>
        );
      },
      responsive: ['xs', 'sm', 'md', 'lg', 'xl']
    },
    {
      title: 'Status',
      dataIndex: 'status',
      render: (status) => (
        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full
          ${status === 'approved' ? 'bg-green-100 text-green-800' : 
          status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
          'bg-red-100 text-red-800'}`}>
          {status}
        </span>
      ),
      responsive: ['xs', 'sm', 'md', 'lg', 'xl']
    },
    {
      title: 'Report',
      key: 'upload',
      render: (text, record) => (
        <div className="space-y-2">
          <label className="cursor-pointer px-3 py-1.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm rounded-lg shadow-sm hover:shadow-md hover:from-blue-600 hover:to-blue-700 transition duration-200 inline-block">
            <span className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              Upload
            </span>
            <input
              type="file"
              accept="image/*,application/pdf"
              onChange={(e) => handleFileUpload(e.target.files[0], record._id)}
              className="hidden"
            />
          </label>
          {record.attachment && (
            <div className="flex items-center gap-2 mt-2">
              <button
                onClick={() => handlePreview(record.attachment)}
                className="text-blue-600 hover:text-blue-800 font-medium text-xs sm:text-sm flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                View
              </button>
              <span className="text-gray-300">|</span>
              <button
                onClick={() => handleRemoveFile(record._id)}
                className="text-red-600 hover:text-red-800 font-medium text-xs sm:text-sm flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Remove
              </button>
            </div>
          )}
        </div>
      ),
      responsive: ['xs', 'sm', 'md', 'lg', 'xl']
    },
  ];

  return (
    <div className="p-4 sm:p-8 bg-gradient-to-b from-gray-50 to-blue-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-8 text-center text-blue-600 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          My Appointments
        </h1>
        
        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 overflow-x-auto">
          <Table
            columns={columns}
            dataSource={appointments}
            rowKey="_id"
            pagination={{ 
              pageSize: 10,
              responsive: true,
              position: ['bottomCenter'],
              className: "mt-6"
            }}
            className="appointments-table"
            scroll={{ x: 'max-content' }}
            rowClassName="hover:bg-blue-50 transition-colors duration-200"
          />
        </div>
      </div>

      <Modal
        visible={previewVisible}
        footer={null}
        onCancel={() => setPreviewVisible(false)}
        width="80%"
        bodyStyle={{ padding: '24px', height: 'auto', maxHeight: '80vh' }}
        className="file-preview-modal"
        centered
      >
        {fileType === 'pdf' ? (
          <embed
            src={`data:application/pdf;base64,${previewData}`}
            type="application/pdf"
            width="100%"
            height="70vh"
            className="rounded-md"
          />
        ) : (
          <div className="flex justify-center">
            <img
              alt="Preview"
              src={`data:image/jpeg;base64,${previewData}`}
              style={{ maxWidth: '100%', maxHeight: '70vh', objectFit: 'contain' }}
              className="rounded-md"
            />
          </div>
        )}
      </Modal>
    </div>
  );
};

export default UserAppointments;