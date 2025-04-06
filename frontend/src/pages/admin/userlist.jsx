import React, { useEffect, useState } from 'react';
import { Table, message } from 'antd';
import { axiosinstance } from '../../components/utilities/axiosinstance.js'; // ✅ Custom axios instance

const UserList = () => {
  const [users, setUsers] = useState([]);

  const getUsers = async () => {
    try {
      const res = await axiosinstance.get('/admin/getAllUsers', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (res.data.success) {
        setUsers(res.data.data);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleDelete = async (userId) => {
    try {
      const res = await axiosinstance.delete(`/admin/deleteUser/${userId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (res.data.success) {
        message.success(res.data.message);
        // Remove user from UI without reload
        setUsers((prevUsers) => prevUsers.filter((user) => user._id !== userId));
      } else {
        message.error(res.data.message);
      }
    } catch (error) {
      console.error('Delete Error:', error);
      message.error('Error deleting user');
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
    },
    {
      title: 'Email',
      dataIndex: 'email',
    },
    {
      title: 'Doctor',
      dataIndex: 'isDoctor',
      render: (text, record) => <span>{record.isDoctor ? 'Yes' : 'No'}</span>,
    },
    // {
    //   title: 'Admin',
    //   dataIndex: 'isAdmin',
    //   render: (text, record) => <span>{record.isAdmin ? 'Yes' : 'No'}</span>,
    // },
    {
      title: 'Action',
      dataIndex: 'action',
      render: (text, record) => (
        <button className="btn btn-danger" onClick={() => handleDelete(record._id)}>
          Delete
        </button>
      ),
    },
  ];

  return (
    <div>
      <h1 className="text-center my-3">All Users</h1>
      <Table columns={columns} dataSource={users} rowKey="_id" />
    </div>
  );
};

export default UserList;
