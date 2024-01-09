import React from 'react';
import NotFound from '../pages/Error/404';
import useToken from '../utils/useToken';

/**
 * ProtectedComponent component to control access based on user roles.
 * @param {Object} props - Component properties.
 * @param {string} props.role - Role required for accessing the component.
 * @param {ReactNode} props.children - Child components to render.
 * @returns {JSX.Element} ProtectedComponent
 */
const ProtectedComponent = ({ role, children }) => {

  const { userrole } = useToken();
  
  /**
   * Checks if the user is authorized based on the provided role.
   * @returns {boolean} Returns true if the user is authorized, otherwise false.
   */
  const isAuthorized = () => {
    const user_role = userrole;
    
    const roleHierarchy = {
      ADMIN: ['ADMIN', 'MOD', 'CLIENT'],
      MOD: ['MOD', 'CLIENT'],
      CLIENT: ['CLIENT'],
    };

    // Check if the provided role is present in the role hierarchy
    const allowedRoles = roleHierarchy[user_role] || [];
    return allowedRoles.includes(role);
  };

  // Renders children if authorized, else renders NotFound component
  return <>{isAuthorized() ? children : <NotFound />}</>;
};

export default ProtectedComponent;
