import React from 'react'
import { Link } from 'react-router-dom'


const AdminNav = () => {

    return (
        <ul className='flex items-center w-[60%] justify-around'>
            <li>
                <Link to={"/admin"} className='text-[110%] hover:text-[#46aaa7] transition duration-300 ease-in-out transform'>Gérer modérateurs</Link>
            </li>
            <li>
                <Link to={"/upload"} className='text-[110%] hover:text-[#46aaa7] transition duration-300 ease-in-out transform'>Uploader article</Link>
            </li>
        </ul>
    )
}

export default AdminNav