import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Tabs, message } from 'antd'
import { useNavigate } from 'react-router-dom'
import { axiosinstance } from '../components/utilities/axiosinstance.js'
import { setUser } from '../redux/features/user.slice.js'

const Notification = () => {
    const { user } = useSelector((state) => state.user)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [notifications, setNotifications] = useState([])
    const [seenNotifications, setSeenNotifications] = useState([])
    const [loading, setLoading] = useState(false)

    const fetchNotifications = async () => {
        setLoading(true);
        try {
            const res = await axiosinstance.post('/user/getNotification', {
                userId: user._id
            });
            
            if (res.data.success) {
                setNotifications(res.data.data.notifications || []);
                setSeenNotifications(res.data.data.seenNotifications || []);
                dispatch(setUser({
                    ...user,
                    notification: res.data.data.notifications || [],
                    seenNotification: res.data.data.seenNotifications || []
                }));
            } else {
                message.error(res.data.message || 'Failed to fetch notifications');
            }
        } catch (error) {
            console.error('Error fetching notifications:', error);
            message.error('Error fetching notifications');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!user?._id) return;
        
       

        fetchNotifications();
    }, [user?._id, dispatch]);

    const handleMarkAsRead = async () => {
        if (!user?._id) return;
        
        setLoading(true);
        try {
            const res = await axiosinstance.post('/user/getNotification', {
                userId: user._id
            });
            
            if (res.data.success) {
                setNotifications([]);
                setSeenNotifications(prev => [...prev, ...notifications]);
                dispatch(setUser({
                    ...user,
                    notification: [],
                    seenNotification: [...user.seenNotification, ...user.notification]
                }));
                message.success('All notifications marked as read');
            } else {
                message.error(res.data.message || 'Failed to mark notifications as read');
            }
        } catch (error) {
            console.error('Error marking notifications as read:', error);
            message.error('Error marking notifications as read');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!user?._id) return;
        
        setLoading(true);
        try {
            const updateRes = await axiosinstance.post('/user/updateUserInfo', {
                seenNotification: []
            });

            if (updateRes.data.success) {
                setSeenNotifications([]);
                dispatch(setUser({
                    ...user,
                    seenNotification: []
                }));
                message.success('All notifications deleted');
            } else {
                message.error('Failed to delete notifications');
            }
        } catch (error) {
            console.error('Error deleting notifications:', error);
            message.error('Error deleting notifications');
        } finally {
            setLoading(false);
        }
    };

    const handleNotificationClick = (path) => {
        if (path) navigate(path);
    };

    return (
        <div className="p-8">
            <h2 className='text-2xl font-bold mb-4'>Notifications</h2>
            <Tabs defaultActiveKey="0">
                <Tabs.TabPane tab="Unread" key={0}>
                    <div className='flex justify-end mb-4'>
                        <h3 
                            className='text-blue-600 cursor-pointer hover:text-blue-800' 
                            onClick={handleMarkAsRead}
                        >
                            Mark All As Read
                        </h3>
                    </div>
                    {notifications.length === 0 ? (
                        <p className="text-gray-500">No unread notifications</p>
                    ) : (
                        notifications.map((notification, index) => (
                            <div 
                                key={index}
                                className="p-4 mb-2 bg-white rounded-lg shadow hover:shadow-md cursor-pointer"
                                onClick={() => handleNotificationClick(notification.onClickPath)}
                            >
                                <h3 className="font-medium">{notification.message}</h3>
                                <p className="text-sm text-gray-500">
                                    {notification.createdAt ? new Date(notification.createdAt).toLocaleString() : 'No timestamp'}
                                </p>
                            </div>
                        ))
                    )}
                </Tabs.TabPane>
                <Tabs.TabPane tab="Read" key={1}>
                    <div className='flex justify-end mb-4'>
                        <h3 
                            className='text-blue-600 cursor-pointer hover:text-blue-800' 
                            onClick={handleDelete}
                        >
                            Delete All
                        </h3>
                    </div>
                    {seenNotifications.length === 0 ? (
                        <p className="text-gray-500">No read notifications</p>
                    ) : (
                        seenNotifications.map((notification, index) => (
                            <div 
                                key={index}
                                className="p-4 mb-2 bg-gray-50 rounded-lg"
                            >
                                <h3 className="font-medium">{notification.message}</h3>
                                <p className="text-sm text-gray-500">
                                    {notification.createdAt ? new Date(notification.createdAt).toLocaleString() : 'No timestamp'}
                                </p>
                            </div>
                        ))
                    )}
                </Tabs.TabPane>
            </Tabs>
        </div>
    )
}

export default Notification
