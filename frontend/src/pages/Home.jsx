import React, { useEffect } from "react";
import Header from "../components/Header";
import Types from "../components/Types";
import { axiosinstance } from "../components/utilities/axiosinstance";

const HomePage = () => {
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
