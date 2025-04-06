import React, { useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux';
import { axiosinstance } from './utilities/axiosinstance.js';
import { setUser } from '../redux/features/user.slice';

export default function ProtectedRoute({children}) {
    const dispatch = useDispatch()
    const {user} = useSelector(state => state.user)

    const getUser = async () => {
        try {
            const res = await axiosinstance.post('/user/getUserData',
                 {token : localStorage.getItem("token")},
                 {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                 }
            );
            if(res.data.success){
                dispatch(setUser(res.data.data))
            }else{
                localStorage.clear()
                return <Navigate to="/login"/>;
            }
        } catch(error){
            localStorage.clear()
            console.log(error)
        }
    };
    
    useEffect(() => {
        if(!user){
            getUser();
        }
    }, [user, getUser])
   
    if(localStorage.getItem("token")){
        return children;
    }else{
        return <Navigate to="/login"/>
    }

}
