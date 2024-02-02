import React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

/**
 * Component for admin navigation.
 * @param {Object} props - Component props.
 * @param {Function} props.setLoading - Function to set loading state.
 * @returns {JSX.Element} Admin navigation component.
 */
const AdminNav = ({ setLoading, setMessage, setIsPopupOpenInfo, setIsPopupOpenSuccess, setIsPopupOpenError, setErr }) => {

    /**
     * Handles file change.
     * @param {Object} e - Event object representing the change.
     */
    const handleFileChange = (e) => {
        const fichier = e.target.files[0];
        if (fichier) {
            const confirmation = window.confirm(`Confirmez-vous l'ajout du fichier: ${fichier.name}?`);
            if (confirmation) {
                handleFileUpload(fichier);
            } else {
                setMessage("Upload annulé");
                setIsPopupOpenInfo(true);
                setTimeout(() => {setMessage(""); setIsPopupOpenInfo(false)}, 1500);
            }
        }
    };

    /**
     * Handles file upload.
     * @param {Object} fichier - File to upload.
     */
    const handleFileUpload = async (fichier) => {
        setLoading(true); // Enable loading

        const formData = new FormData();
        formData.append('file', fichier);

        try {
            // Send file to server
            await axios.post('http://localhost:5000/api/uploads', formData);

            console.log('File uploaded successfully!');

            // Create an article with the PDF file name
            await axios.post('http://localhost:5000/api/articles', { pdf_name: fichier.name });

            setMessage("Fichier uploadé avec succès");
            setIsPopupOpenSuccess(true);
            setTimeout(() => {setMessage(""); setIsPopupOpenSuccess(false)}, 3000);
        } catch (error) {
            if (error.response && error.response.data) {
                setErr(error.response.data.error);
                setIsPopupOpenError(true);
            } else {
                setErr('Une erreur est survenue');
                setIsPopupOpenError(true);
            }
        } finally {
            setLoading(false); // Disable loading, regardless of the result
        }
    };

    return (
        <ul className='flex items-center lg:w-[70%] xl:w-[55%] w-[90%] justify-around'>
            <li>
            <Link to={"/admin"} className='hidden sm:block text-sm sm:text-base md:text-[110%] hover:text-[#46aaa7] transition duration-300 ease-in-out transform'>Gérer modérateurs</Link>
            <Link to={"/admin"} className='block sm:hidden text-sm sm:text-base md:text-[110%] hover:text-[#46aaa7] transition duration-300 ease-in-out transform'>Modérateurs</Link>

            </li>
            <li>
                {/* Input to upload a PDF file */}
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

export default AdminNav;
