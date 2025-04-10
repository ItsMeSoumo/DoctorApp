import React, { useState, useEffect } from 'react';
import { Table, message } from 'antd';
import { axiosinstance } from '../../components/utilities/axiosinstance';
import { useSelector } from 'react-redux';
import moment from 'moment';

const UserAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const { user } = useSelector(state => state.user);

  const getAppointments = async () => {
    try {
      const res = await axiosinstance.get('/doctor/doctorAppointments', 
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
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

  const handleStatus = async (record, status) => {
    try {
      const res = await axiosinstance.post('/doctor/updateStatus', 
        { 
          appointmentId: record._id, 
          status 
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      
      if (res.data.success) {
        message.success(res.data.message);
        getAppointments();
      } else {
        message.error(res.data.message || 'Failed to update appointment status');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      const errorMessage = error.response?.data?.message || 'Error updating appointment status';
      message.error(errorMessage);
    }
  }

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      render: (text, record) => (
        <span>
          {record.userInfo.name}
        </span>
      ),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      render: (text, record) => (
        <span>
          {record.userInfo.email}
        </span>
      ),
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
        title: 'Action',
        dataIndex: 'action',
        render: (text, record) => (
            <div> 
                {record.status === 'pending' && (
                    <div>
                        <button className='btn btn-success' onClick={() => handleStatus(record, 'approved')}>Approve</button>
                        <button className='btn btn-danger ml-2' onClick={() => handleStatus(record, 'rejected')}>Reject</button>
                    </div>
                )}
                {record.status === 'approved' && (
                    <div>
                        <button className='btn btn-danger' onClick={() => handleStatus(record, 'rejected')}>Deny</button>
                    </div>
                )}
            </div>
        ),
    }
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
