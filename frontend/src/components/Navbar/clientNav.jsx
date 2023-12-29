import React from 'react'
import { Link } from 'react-router-dom'


const ClientNav = () => {

    return (
        <ul className='flex items-center lg:w-[70%] xl:w-[55%] w-[90%] justify-around'>
            <li>
                <Link to={"/"} className='hidden sm:block text-sm sm:text-base md:text-[110%] hover:text-[#46aaa7] transition duration-300 ease-in-out transform'>Rechercher articles</Link>
                <Link to={"/"} className='block sm:hidden text-sm sm:text-base md:text-[110%] hover:text-[#46aaa7] transition duration-300 ease-in-out transform'>Rechercher</Link>
            </li>
            <li>
                <Link to={"/favorites"} className='text-sm sm:text-base md:text-[110%] hover:text-[#46aaa7] transition duration-300 ease-in-out transform'>Favoris</Link>
            </li>
        </ul>
    )
}

export default ClientNav