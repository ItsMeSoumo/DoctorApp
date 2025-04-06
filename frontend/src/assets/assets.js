// src/assets/assets.js

import doc1 from '../assets/doctor1.jpg';
import doc2 from '../assets/doctor2.jpg';    
import doc3 from '../assets/doctor3.jpg';
import doc4 from '../assets/doctor4.webp';

// Speciality Data
export const specialityData = [
  {
    speciality: 'Gynecologist',
    doctorCount: 8
  },
  {
    speciality: 'Pediatrician',
    doctorCount: 12
  },
  {
    speciality: 'Neurologist',
    doctorCount: 6
  },
  {
    speciality: 'Orthopedic',
    doctorCount: 10
  }
];

// Doctor Data
export const doctorData = {
  Gynecologist: {
    name: 'Dr. Shubham',
    image: doc1,
    age: 45,
    education: 'MBBS, MD (Gynecology)',
    experience: 20,
    fees: '₹500',
    availableSlots: ["10:00 AM", "11:30 AM", "3:00 PM", "5:00 PM"]
  },
  Pediatrician: {
    name: 'Dr. Rohit',
    image: doc2,
    age: 40,
    education: 'MBBS, MD (Pediatrics)',
    experience: 15,
    fees: '₹600',
    availableSlots: ["9:00 AM", "12:00 PM", "4:00 PM", "6:30 PM"]
  },
  Neurologist: {
    name: 'Dr. Sohini',
    image: doc3,
    age: 50,
    education: 'MBBS, MD (Neurology)',
    experience: 25,
    fees: '₹700',
    availableSlots: ["8:30 AM", "1:00 PM", "2:30 PM", "7:00 PM"]
  },
  Orthopedic: {
    name: 'Dr. Megha',
    image: doc4,
    age: 35,
    education: 'MBBS, MS (Orthopedics)',
    experience: 10,
    fees: '₹550',
    availableSlots: ["10:00 AM", "2:00 PM", "4:00 PM", "6:00 PM"]
  }
};
