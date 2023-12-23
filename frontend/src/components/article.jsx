import React from 'react'
import { FaFilePdf } from "react-icons/fa6";
import { Link } from 'react-router-dom';


const Article = ({ title, url, abstract }) => {

    const shortenAbstract = (abstract) => {
        var words, shortened = "";
        if (abstract != undefined) {
            words = abstract.split(' ');
            shortened = words.slice(0, 25).join(' ');
            shortened = shortened + "..."
        }
        return shortened;
    }

    return (
        <div className='flex items-center bg-[#FFFFFF] border border-[#E5E5E5] py-4 px-6 rounded-lg mb-5'>
            <div>
                <Link>
                    <h1 className='font-bold text-[#046865] hover:text-[#21a0a0e4] text-2xl transition duration-300 ease-in-out transform'>{title}</h1>
                </Link>
                <p>{shortenAbstract(abstract)} <Link className='ml-2 text-[#21A0A0] hover:text-[#21a0a0b5] font-bold transition duration-300 ease-in-out transform'>Lire plus</Link></p>
            </div>
            <div className='bg-[#EDEFF5] rounded w-0.5 h-16 mx-6'/>
            <Link to={url} target="_blank" rel="noopener noreferrer">
                <FaFilePdf className='text-[40px] text-[#FE5B5B] hover:text-[#fe5b5bd3] transition duration-300 ease-in-out transform' />
            </Link>
        </div>
    )
}

export default Article;