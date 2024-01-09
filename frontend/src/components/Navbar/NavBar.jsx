import React from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { HiOutlineLogout } from "react-icons/hi";
import useToken from '../../utils/useToken';
import ClientNav from './clientNav';
import ModNav from './modNav';
import AdminNav from './adminNav';
import NotFound from '../../pages/Error/404';

/**
 * Functional component representing the navigation bar.
 *
 * @param {Object} props - Props containing removeToken and setLoading functions
 * @returns {JSX.Element} Navigation bar component
 */

const NavBar = ({ removeToken, setLoading }) => {

    const navigate = useNavigate();

    const { userrole } = useToken();

    /**
     * Handles the logout process by sending a request to the server.
     *
     * @param {Object} e - Event object
     * @returns {void}
     */

    const logoutHandler = async (e) => {
        e.preventDefault();
    
        // Send a request to your server for authentication
        await axios.post('http://localhost:5000/api/logout')
        .then(() => {
            removeToken();
            navigate("/");
        })
        .catch(error => {
            // Handle login error
            console.log(error);
        });
    }

    /**
     * Renders different navigation components based on the user's role.
     *
     * @returns {JSX.Element} Rendered navigation component based on user role
     */

    const renderLinks = () => {
          switch (userrole) {
            case 'ADMIN':
              return <AdminNav setLoading={setLoading}/>;
            case 'MOD':
              return <ModNav/>;
            case 'CLIENT':
              return <ClientNav/>;
            default:
              return <NotFound/>;
          }
    } 

    return (
        <div className='bg-[#FCFFF7] py-[5%] sm:py-[1.25%] px-[3%] flex justify-between shadow-md hover:shadow-xl transition duration-300 ease-in-out transform'>
            <div className='md:w-[70%] flex items-center'>
                <Link to="/" className='w-[40%] sm:w-[25%] h-auto sm:mr-[10%]'>
                    <img
                        src="/images/img_logo.png"
                        alt="logo_img"
                    />
                </Link>
                <div className='w-full'>
                    {renderLinks()}
                </div>
            </div>
            <button type="submit" onClick={logoutHandler} className={`p-1 sm:p-2 border border-[#FB5353] text-[#FB5353] hover:text-white font-semibold rounded-md hover:bg-[#fb5353e5] flex items-center transition duration-300 ease-in-out transform`}><HiOutlineLogout className='text-xl md:mr-2'/><h1 className='hidden md:block'>Se déconnecter</h1></button>

        </div>
    );
};

export default NavBar;
