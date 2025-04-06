import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import doc1 from '../assets/doctor1.jpg';
import doc2 from '../assets/doctor2.jpg';    
import doc3 from '../assets/doctor3.jpg';
import doc4 from '../assets/doctor4.webp';
import { axiosinstance } from '../components/utilities/axiosinstance';

const Doctors = () => {

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

  const navigate = useNavigate();
  const { speciality } = useParams(); // Get speciality from params
  const specialities = ['Gynecologist', 'Pediatrician', 'Neurologist', 'Orthopedic'];
  const crewMembers = [
    { id: 1, name: 'Gynecologist', image: doc1 },
    { id: 2, name: 'Pediatrician', image: doc2 },
    { id: 3, name: 'Neurologist', image: doc3 },
    { id: 4, name: 'Orthopedic', image: doc4 },
  ];

  const [selectedSpeciality, setSelectedSpeciality] = useState(null);
  const [city, setCity] = useState('');
  const [isCitySelected, setIsCitySelected] = useState(false);
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    if (speciality) {
      console.log('Speciality from params:', speciality);
      setSelectedSpeciality(speciality);
    } else {
      console.log('No speciality from params');
      setSelectedSpeciality(null); // Show all doctors by default
    }
  }, [speciality]);

  const handleImageClick = (speciality) => {
    console.log('Clicked speciality:', speciality); // Debugging log
    navigate(`/appointment/${speciality}`);
  };

  const handleCitySelect = () => {
    if (city.toLowerCase() === 'kolkata') {
      setIsCitySelected(true);
    } else {
      alert('Currently, we only support Kolkata');
    }
  };

  const handleCityChange = (e) => {
    const value = e.target.value;
    setCity(value);
    if (value.toLowerCase().startsWith('k')) {
      setSuggestions(['Kolkata']);
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setCity(suggestion);
    setSuggestions([]);
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 mt-5 max-w-[85rem] mx-auto rounded-lg space-y-10">
      {/* City Selection */}
      {/* {!isCitySelected && (
        <div className="flex flex-col items-center space-y-4">
          <h2 className="text-xl font-bold">Select City</h2>
          <div className="relative w-full">
            <input
              type="text"
              value={city}
              onChange={handleCityChange}
              placeholder="Enter city (only Kolkata supported)"
              className="p-2 border rounded-lg w-full"
              style={{ marginBottom: 0 }} // Ensure no margin at the bottom
            />
            {suggestions.length > 0 && (
              <ul 
                className="absolute bg-blue-50 rounded-md w-11/12 z-10"
                style={{ marginTop: '4px' }} // Add margin-top for spacing
              >
                {suggestions.map((suggestion, index) => (
                  <li
                    key={index}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="p-2 cursor-pointer rounded-md hover:bg-blue-100"
                  >
                    {suggestion}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <button onClick={handleCitySelect} className="p-2 bg-blue-500 text-white rounded-lg">Select</button>
        </div>
      )} */}

      {/* Main Content */}
      { (
        <div className="flex flex-row items-start justify-center space-x-10 w-full">
          {/* Left Side - Specialities */}
          <div className="w-1/4 flex flex-col space-y-4">
            <h2 className="text-xl font-bold">Browse Specialties</h2>
            {specialities.map((speciality, index) => (
              <button
                key={index}
                onClick={() => setSelectedSpeciality(speciality)}
                className={`p-3 rounded-lg text-left ${selectedSpeciality === speciality ? 'bg-blue-500 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
              >
                {speciality}
              </button>
            ))}
          </div>

          {/* Right Side - Doctors (Filtered Images) */}
          <div className="w-3/4 grid grid-cols-4 gap-6 z-10">
            {crewMembers
              .filter(member => !selectedSpeciality || member.name === selectedSpeciality)
              .map((member) => (
                <img
                  key={member.id}
                  src={member.image}
                  alt={member.name}
                  onClick={() => handleImageClick(member.name)} // Add speciality name
                  className="w-56 h-56 object-cover rounded-lg shadow-lg transition-transform duration-300 ease-in-out transform hover:scale-110 cursor-pointer"
                />
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Doctors;
