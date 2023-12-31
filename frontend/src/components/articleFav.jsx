import React, { useState } from 'react';
import { FaFilePdf } from 'react-icons/fa6';
import { Link } from 'react-router-dom';
import { FaHeart } from 'react-icons/fa';
import axios from 'axios';
import useToken from '../utils/useToken';

const ArticleFav = ({ title, url, abstract, id, articles, setArticles, searchResult, setSearchResult }) => {

  const shortenAbstract = (abstract) => {
    if (abstract !== undefined) {
      const words = abstract.split(' ');
      return words.slice(0, 25).join(' ') + '...';
    }
    return '';
  };

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

  const {userid} = useToken();
  // const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFav = async () => {
    setLoading(true);
    await axios.delete(`http://localhost:5000/api/favoris/${userid}/${id}`)
    .then(() => {
      const updatedArticles = articles.filter((article) => article.id !== id);
      setArticles(updatedArticles);
      const updatedSearchResult = searchResult.filter((article) => article.id !== id);
      setSearchResult(updatedSearchResult);
    })
    .catch(error => {
        if (error.response && error.response.data) {
            // setErr(error.response.data.error);
        } else {
            // setErr('Une erreur est survenue');
        }
    })
    .finally(() => {
      setLoading(false);
    });
  };

  return (
    <div className='flex flex-col sm:flex-row items-center justify-between bg-[#FFFFFF] border border-[#E5E5E5] py-4 px-6 rounded-lg mb-5 hover:drop-shadow-lg transition duration-300 ease-in-out transform'>
      <div className='mb-4 sm:mb-0 sm:mr-6'>
        <Link  to={`/article/${id}`} rel='noopener noreferrer'>
          <h1 className='font-bold text-[#046865] hover:text-[#21a0a0e4] text-xl sm:text-2xl transition duration-300 ease-in-out transform'>
            {title}
          </h1>
        </Link>
        <p className='mt-2 sm:mt-0'>
          {shortenAbstract(abstract)}{' '}
          <Link
            className='ml-2 text-[#21A0A0] hover:text-[#21a0a0b5] font-bold transition duration-300 ease-in-out transform'
            to={`/article/${id}`}
            rel='noopener noreferrer'
          >
            Lire plus
          </Link>
        </p>
      </div>
      <div className='flex items-center justify-end'>
        <div onClick={handleViewPdf} className='hover:cursor-pointer'>
          <FaFilePdf className='text-3xl sm:text-4xl text-[#FE5B5B] hover:text-[#fe5b5bd3] transition duration-300 ease-in-out transform' />
        </div>
        { loading ? (
            <img src="/spinner2.gif" alt="spinner" className="ml-2 w-[25%] h-auto"/>
       
        ) : (
          <FaHeart
            className={`ml-4 cursor-pointer text-[#fd4949] hover:text-[#FF6262] text-3xl sm:text-4xl transition duration-300 ease-in-out transform`}
            onClick={handleFav}
          />
        )}
      </div>
    </div>
  );
};

export default ArticleFav;
