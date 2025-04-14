import React, { useEffect, useState } from 'react';
import { message, Table } from 'antd';
import { axiosinstance } from '../../components/utilities/axiosinstance.js'; // ✅ custom instance

const DoctorList = () => {
  const [doctors, setDoctors] = useState([]);

  const getDoctors = async () => {
    try {
      const res = await axiosinstance.get('/admin/getAllDoctors', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (res.data.success) {
        setDoctors(res.data.data);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleStatus = async (record, status) => {
    try {
      const res = await axiosinstance.post(
        '/admin/changeStatus',
        {
          doctorId: record._id,
          userId : record.userId, 
          status: status,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      if (res.data.success) {
        message.success(res.data.message);
        getDoctors(); // Reload the doctors list
      } else {
        message.error(res.data.message);
      }
    } catch (error) {
      console.error('Error:', error);
      message.error('Error in status update');
    }
  };

  useEffect(() => {
    getDoctors();
  }, []);

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      render: (text, record) => (
        <span>
          {record.firstName} {record.lastName}
        </span>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      render: (text, record) => (
        <span>
          {record.email}
        </span>
      ),
    },
    {
      title: 'Location',
      dataIndex: 'location',
      render: (text, record) => (
        <span>
          {record.location}
        </span>
      ),
    },

    {
      title: 'Actions',
      dataIndex: 'actions',
      render: (text, record) => (
        <div className="d-flex gap-2">
          {record.status === 'pending' ? (
            <button className="btn btn-success" onClick={() => handleStatus(record, 'approved')}>
              Approve
            </button>
          ) : (
            <button className="btn btn-danger" onClick={() => handleStatus(record, 'rejected')}>
              Reject
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <>
      <h1 className="text-center m-3">All Doctors</h1>
      <Table columns={columns} dataSource={doctors} rowKey="_id" />
    </>
  );
};

export default DoctorList;
