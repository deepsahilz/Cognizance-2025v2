import React, { createContext, useState, useContext, useEffect } from 'react';
const UserContext = createContext();
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export const UserContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async() => {
          try {
          //     const response = await axios.get("/api/auth/me",{
          //       baseURL: "http://localhost:5000",
          //       withCredentials: true,}
          //       );
          //     console.log("From context",response.data)
          //     setUser(response.data);
          //     setIsLoggedIn(true);
          setUser({id: 1,
            username: 'Kaushal',
            email: 'kaushal@example.com',
            role: 'Employer', // or 'Freelancer'
            avatar: '',}
          );

          setIsLoggedIn(true);
        } catch(e){
          console.log(e);
        }finally{
          setLoading(false); 
        }
    };
      checkAuth();
}, [isLoggedIn,navigate]);

  return (
    <UserContext.Provider value={{ user, setUser, loading, isLoggedIn,setIsLoggedIn }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => useContext(UserContext);
