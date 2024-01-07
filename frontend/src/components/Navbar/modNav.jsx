import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Functional component representing the navigation for moderators.
 *
 * @returns {JSX.Element} Navigation component for moderators
 */
const ModNav = () => {
    return (
        <ul className='flex items-center lg:w-[40%] xl:w-[35%] w-[60%]'>
            <li>
            <Link to={"/mod"} className='text-sm sm:text-base md:text-[110%] sm:ml-0 ml-5 hover:text-[#46aaa7] transition duration-300 ease-in-out transform'>Rectifier articles</Link>

            </li>
        </ul>
    );
};

export default ModNav;
