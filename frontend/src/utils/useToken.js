import { useState } from 'react';
 
function useToken() {
 
  function getToken() {
    const userToken = localStorage.getItem('token'); //https://javascript.info/localstorage
    return userToken && userToken
  }

  function getRole() {
    const userRole = localStorage.getItem('role'); //https://javascript.info/localstorage
    return userRole && userRole
  }
 
  const [token, setToken] = useState(getToken());
  const [userrole, setRole] = useState(getRole());
 
  function saveToken(userToken, userRole) {
    localStorage.setItem('token', userToken);
    localStorage.setItem('role', userRole);
    setToken(userToken);
    setRole(userRole);
  };
 
  function removeToken() {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setToken(null);
    setRole(null);
  }
 
  return {
    setToken: saveToken,
    token,
    userrole,
    removeToken
  }
 
}
 
export default useToken;