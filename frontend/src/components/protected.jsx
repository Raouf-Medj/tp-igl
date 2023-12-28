import React from 'react';
import NotFound from '../pages/Error/404';
import useToken from '../utils/useToken';

const ProtectedComponent = ({ role, children }) => {

  const { userrole } = useToken();
  
  const isAuthorized = () => {
    const user_role = userrole
    
    const roleHierarchy = {
      ADMIN: ['ADMIN', 'MOD', 'CLIENT'],
      MOD: ['MOD', 'CLIENT'],
      CLIENT: ['CLIENT'],
    };

    // Check if the provided role is present in the role hierarchy
    const allowedRoles = roleHierarchy[user_role] || [];
    return allowedRoles.includes(role);
  };

  return <>{isAuthorized() ? children : <NotFound />}</>;
};

export default ProtectedComponent;