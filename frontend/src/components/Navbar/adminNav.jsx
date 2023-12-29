import React from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios';

const AdminNav = ({ loading, setLoading }) => {

    const handleFileChange = (e) => {
        const fichier = e.target.files[0];
        if (fichier) {
            const confirmation = window.confirm(`Confirmez-vous l'ajout du fichier : ${fichier.name} ?`);
            if (confirmation) {
                handleFileUpload(fichier);
            } else {
                console.log('Ajout annulé');
            }
        }
    };

    const handleFileUpload = async (fichier) => {
        
        setLoading(true);

        const formData = new FormData();
        formData.append('file', fichier);

        try {
            await axios.post('http://localhost:5000/api/upload', formData);

            console.log('File uploaded successfully!');

            await axios.post('http://localhost:5000/api/articles', {pdf_name: fichier.name});

            console.log("done");
        } catch (error) {
            console.error('Error uploading file:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <ul className='flex items-center lg:w-[70%] xl:w-[55%] w-[90%] justify-around'>
            <li>
                <Link to={"/admin"} className='hidden sm:block text-sm sm:text-base md:text-[110%] hover:text-[#46aaa7] transition duration-300 ease-in-out transform'>Gérer modérateurs</Link>
                <Link to={"/admin"} className='block sm:hidden text-sm sm:text-base md:text-[110%] hover:text-[#46aaa7] transition duration-300 ease-in-out transform'>Modérateurs</Link>
            </li>
            <li>
                
                <div>
                    <label htmlFor="fileInput" className='hidden sm:block text-sm sm:text-base md:text-[110%] hover:text-[#46aaa7] transition duration-300 ease-in-out transform cursor-pointer'>Uploader article</label>
                    <input type="file" accept=".pdf" id="fileInput" onChange={handleFileChange} style={{ display: 'none' }} /> 
                </div>
                <div>
                    <label htmlFor="fileInput" className='block sm:hidden text-sm sm:text-base md:text-[110%] hover:text-[#46aaa7] transition duration-300 ease-in-out transform cursor-pointer'>Uploader</label>
                    <input type="file" accept=".pdf" id="fileInput" onChange={handleFileChange} style={{ display: 'none' }} /> 
                </div>
                
            </li>
        </ul>
    )
}

export default AdminNav