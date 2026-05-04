import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const userDataContext = createContext();

function UserContext({ children }) {
  const serverUrl = "http://localhost:8000";
  const [userData, setUserData] = useState(null);
  const [fontendImage, setFrontendImage] = useState(null);
  const [backendImage, setbackendImage] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  const handleCurrentUser = async () => {
    try {
      const result = await axios.get(`${serverUrl}/api/user/current`, { withCredentials: true });
      setUserData(result.data);
      console.log(result.data);
    }
    catch (error) {
      console.log(error);
    }
  }

  const getGeminiResponse = async (command) => {
    try {
      const result = await axios.post(`${serverUrl}/api/user/ask`, { command }, { withCredentials: true })
      return result.data
    } catch (error) {
      console.log(error)
    }
  }


  useEffect(() => {
    handleCurrentUser();
  }, [])
  
  const value = { 
    serverUrl,  userData, setUserData, backendImage, setbackendImage, fontendImage, setFrontendImage, selectedImage, setSelectedImage,getGeminiResponse
  };

  return (
    <userDataContext.Provider value={value}>
      {children}
    </userDataContext.Provider>
  );
}

export default UserContext;