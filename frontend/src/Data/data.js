// import { useSelector } from "react-redux";
// const { user } = useSelector((state) => state.user);
export const userMenu = [
  {
    name: "Home",
    path: "/",
    icon: "fa-solid fa-house",
  },
  {
    name: "Doctors",
    path: "/doctors",
    icon: "fa-solid fa-list",
  },
  {
    name: "Apply Doctor",
    path: "/apply-doctors",
    icon: "fa-solid fa-user-doctor",
  },
  {
    name: "Profile",
    path: "/my-profile",
    icon: "fa-solid fa-user",
  },
];

// Admin menu
export const adminMenu = [
  {
    name: "Home",
    path: "/",
    icon: "fa-solid fa-house",
  },
  {
    name: "Doctors",
    path: "/doctorlist",
    icon: "fa-solid fa-user-doctor",
  },
  {
    name: "Users",
    path: "/userlist",
    icon: "fa-solid fa-user",
  },
  {
    name: "Profile",
    path: "/my-profile",
    icon: "fa-solid fa-user",
  },
];

  // Doctor menu (New)
  export const doctorMenu  = (user) => {
    if (!user || !user._id) return [] 
    return [
    {
      name: "Home",
      path: "/",
      icon: "fa-solid fa-house",
    },
    {
      name: "Appointments",
      path: "/doctor-appointments",
      icon: "fa-solid fa-list",
    },
    {
      name: "Profile",
      path: `/doctor/profile/${user?._id}`,
      icon: "fa-solid fa-user",
    },
    {
      name: "My Patients",
      path: "/my-patients",
      icon: "fa-solid fa-users",
    },
  ]}
