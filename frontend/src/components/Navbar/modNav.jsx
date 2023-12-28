import React from 'react'
import { Link } from 'react-router-dom'


const ModNav = () => {

    return (
        <ul className='flex items-center w-[35%] justify-around'>
            <li>
                <Link to={"/mod"} className='text-[110%] hover:text-[#46aaa7] transition duration-300 ease-in-out transform'>Rectifier articles</Link>
            </li>
        </ul>
    )
}

export default ModNav