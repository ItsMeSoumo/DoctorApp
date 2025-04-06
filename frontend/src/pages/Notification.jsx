import React from 'react'
import { useSelector } from 'react-redux'

const Notification = () => {
    const { user } = useSelector((state) => state.user)
    const handleMarkAsRead = () => { 
        
    }
  return (
    <div>
      
    </div>
  )
}

export default Notification
