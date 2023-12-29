import React from 'react'
import { Link } from 'react-router-dom'


const AdminNav = () => {

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const confirmation = window.confirm(`Confirmez-vous l'ajout du fichier : ${file.name} ?`);
            if (confirmation) {
                console.log('Fichier sélectionné:', file);
            } else {
                console.log('Ajout annulé.');
            }
        }
    };

    return (
        <ul className='flex items-center lg:w-[70%] xl:w-[55%] w-[90%] justify-around'>
            <li>
                <Link to={"/admin"} className='hidden sm:block text-sm sm:text-base md:text-[110%] hover:text-[#46aaa7] transition duration-300 ease-in-out transform'>Gérer modérateurs</Link>
                <Link to={"/admin"} className='block sm:hidden text-sm sm:text-base md:text-[110%] hover:text-[#46aaa7] transition duration-300 ease-in-out transform'>Modérateurs</Link>
            </li>
            <li>
                <Link to={"/upload"} className='hidden sm:block text-sm sm:text-base md:text-[110%] hover:text-[#46aaa7] transition duration-300 ease-in-out transform'>Uploader article</Link>
                <Link to={"/upload"} className='block sm:hidden text-sm sm:text-base md:text-[110%] hover:text-[#46aaa7] transition duration-300 ease-in-out transform'>Uploader</Link>
                {/* <label htmlFor="fileInput" className='text-[110%] hover:text-[#46aaa7] transition duration-300 ease-in-out transform cursor-pointer'>Uploader articles</label>
                <input type="file" id="fileInput" onChange={handleFileChange} style={{ display: 'none' }} /> */} 
            </li>
        </ul>
    )
}

export default AdminNav