import { Component } from 'react';
import { Route, Routes,Navigate } from 'react-router-dom';



const Protect = ({ children }) => {
  const isAuth = localStorage.getItem("token");
  return isAuth ? children : <Navigate to="/login" replace />;
};

 
export default Protect;