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

  function getID() {
    const userID = localStorage.getItem('id'); //https://javascript.info/localstorage
    return userID && userID
  }
 
  const [token, setToken] = useState(getToken());
  const [userrole, setRole] = useState(getRole());
  const [userid, setUserid] = useState(getID());
 
  function saveToken(userToken, userRole, userID) {
    localStorage.setItem('token', userToken);
    localStorage.setItem('role', userRole);
    localStorage.setItem('id', userID);
    setToken(userToken);
    setRole(userRole);
    setUserid(userID);
  };
 
  function removeToken() {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("id");
    setToken(null);
    setRole(null);
    setUserid(null);
  }
 
  return {
    setToken: saveToken,
    token,
    userrole,
    userid,
    removeToken
  }
 
}
 
export default useToken;