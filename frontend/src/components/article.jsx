import React from 'react';
import { FaFilePdf } from "react-icons/fa6";
import { Link } from 'react-router-dom';
import axios from 'axios';

/**
 * Component representing an article.
 *
 * @param {Object} props - The article properties
 * @param {string} props.id - The unique identifier for the article
 * @param {string} props.title - The title of the article
 * @param {string} props.url - The URL of the article
 * @param {string} props.abstract - The abstract of the article
 * @param {boolean} props.isRectifier - Flag indicating if the user is a rectifier
 * @returns {JSX.Element} Article component
 */
const Article = ({ id, title, url, abstract, isRectifier }) => {

    /**
     * Handles the view of the PDF file in a new tab.
     *
     * @returns {void}
     */
    const handleViewPdf = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/api/uploads/${url}`, {
                responseType: 'arraybuffer',
            });

            // Create a blob from the array buffer
            const blob = new Blob([response.data], { type: 'application/pdf' });

            // Create a URL for the blob
            const pdfUrl = URL.createObjectURL(blob);

            // Open the PDF in a new tab or window
            window.open(pdfUrl, '_blank');
        } catch (error) {
            console.error('Error fetching PDF:', error);
        }
    };

    /**
     * Shortens the abstract text of the article.
     *
     * @param {string} abstract - The abstract to shorten
     * @param {number} lengthAbstract - The desired length of the abstract
     * @returns {string} Shortened abstract text
     */
    const shortenAbstract = (abstract, lengthAbstract) => {
        var words, shortened = "";
        if (abstract !== undefined) {
            words = abstract.split(' ');
            shortened = words.slice(0, lengthAbstract).join(' ');
            shortened = shortened + "..."
        }
        return shortened;

    };

    return (
        <div className='flex sm:flex-row flex-col items-center bg-[#FFFFFF] border border-[#E5E5E5] py-4 px-6 rounded-lg mb-5 hover:drop-shadow-lg transition duration-300 ease-in-out transform'>
            <div>
                <Link to={`${ isRectifier ? `/mod/article/${id}` : `/article/${id}`}`}>
                    <h1 className='font-bold text-[#046865] hover:text-[#21a0a0e4] text-2xl transition duration-300 ease-in-out transform'>{title}</h1>
                </Link>
                <p className='lg:block hidden'>{shortenAbstract(abstract, 25)} <Link to={`${ isRectifier ? `/mod/article/${id}` : `/article/${id}`}`} className='ml-2 text-[#21A0A0] hover:text-[#21a0a0b5] font-bold transition duration-300 ease-in-out transform'>Lire plus</Link></p>
                <p className='lg:hidden'>{shortenAbstract(abstract, 15)} <Link to={`${ isRectifier ? `/mod/article/${id}` : `/article/${id}`}`} className='ml-2 text-[#21A0A0] hover:text-[#21a0a0b5] font-bold transition duration-300 ease-in-out transform'>Lire plus</Link></p>

            </div>
            <div className='bg-[#EDEFF5] sm:block hidden rounded w-0.5 h-24 mx-6'/>
            <div className='bg-[#EDEFF5] sm:hidden block rounded w-full h-0.5 my-3'/>
            <div onClick={handleViewPdf} className='hover:cursor-pointer'>
                <FaFilePdf className='text-[40px] text-[#FE5B5B] hover:text-[#fe5b5bd3] transition duration-300 ease-in-out transform' />
            </div>
        </div>
    )
}

export default Article;