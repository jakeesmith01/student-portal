import React from 'react';
import { useContext } from 'react';
import { UserContext } from '../../context/UserContext';

const ProtectedAdminRoute = ({ children }) => {
  const { userData } = useContext(UserContext);
 
  if (!userData.wid || !userData.isAdmin) { 
    return <h1>Access Denied</h1>; 
    // return <Navigate to="/" />;
  } 
  return children;
};

export default ProtectedAdminRoute;