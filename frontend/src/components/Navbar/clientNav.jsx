import React from 'react'
import { Link } from 'react-router-dom'


const ClientNav = () => {

    return (
        <ul className='flex items-center w-[50%] justify-around'>
            <li>
                <Link to={"/"} className='text-[110%] hover:text-[#46aaa7] transition duration-300 ease-in-out transform'>Rechercher articles</Link>
            </li>
            <li>
                <Link to={"/favorites"} className='text-[110%] hover:text-[#46aaa7] transition duration-300 ease-in-out transform'>Favoris</Link>
            </li>
        </ul>
    )
}

export default ClientNav