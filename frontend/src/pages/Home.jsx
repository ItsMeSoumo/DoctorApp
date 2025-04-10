import React, { useState, useEffect } from 'react';
import Header from "../components/Header";
import Types from "../components/Types";
import Doctors from "./Doctors";
import { axiosinstance } from "../components/utilities/axiosinstance";
import { Row, Col, Card, Button } from 'antd';

const HomePage = () => {

    // Doctor data fetch function
    const [doctor, setDoctor] = useState([]);
    const getAllDoc = async () => {
      try {
        const res = await axiosinstance.get(
          "/user/getAllDoc",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`
            }
          }
        );
        if (res.data.success) {
          setDoctor(res.data.data);
        }
      } catch (error) {
        console.log(error);
      }
    };
  
    useEffect(() => {
      getAllDoc();
    }, []); 

  // User data fetch function
  // const getUserData = async () => {
  //   try {
  //     const res = await axiosinstance.post(
  //       "/api/v1/user/getUserData",
  //       {}, // Empty object (some APIs expect a body)
  //       {
  //         headers: {
  //           Authorization: "Bearer " + localStorage.getItem("token"),
  //         },
  //       }
  //     );

  //     console.log(res.data);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  // useEffect(() => {
  //   getUserData();
  // }, []);

  return (
    <div>
      <Header />
      <Types />
    </div>
  );
};

export default HomePage;
