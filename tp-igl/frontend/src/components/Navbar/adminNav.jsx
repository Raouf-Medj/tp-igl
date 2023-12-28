import React from 'react'
import { Link } from 'react-router-dom'


const AdminNav = () => {

    const handleFileSelect = () => {
        document.getElementById('fileInput').click();
    };

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
        <ul className='flex items-center w-[60%] justify-around'>
            <li>
                <Link to={"/admin"} className='text-[110%] hover:text-[#46aaa7] transition duration-300 ease-in-out transform'>Gérer modérateurs</Link>
            </li>
            <li>
                <label htmlFor="fileInput" className='text-[110%] hover:text-[#46aaa7] transition duration-300 ease-in-out transform cursor-pointer'>Uploader articles</label>
                <input type="file" id="fileInput" onChange={handleFileChange} style={{ display: 'none' }} />
            </li>
        </ul>
    )
}

export default AdminNav