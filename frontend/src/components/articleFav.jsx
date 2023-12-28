import React from 'react';
import { FaFilePdf } from 'react-icons/fa6';
import { Link } from 'react-router-dom';
import { FaHeart } from 'react-icons/fa';

const ArticleFav = ({ title, url, abstract }) => {
  const shortenAbstract = (abstract) => {
    if (abstract != undefined) {
      const words = abstract.split(' ');
      return words.slice(0, 25).join(' ') + '...';
    }
    return '';
  };

  const handleFav = () => {
    // Delete article from favoris
  };

  return (
    <div className='flex flex-col sm:flex-row items-center justify-between bg-[#FFFFFF] border border-[#E5E5E5] py-4 px-6 rounded-lg mb-5'>
      <div className='mb-4 sm:mb-0 sm:mr-6'>
        <Link to={url} target='_blank' rel='noopener noreferrer'>
          <h1 className='font-bold text-[#046865] hover:text-[#21a0a0e4] text-xl sm:text-2xl transition duration-300 ease-in-out transform'>
            {title}
          </h1>
        </Link>
        <p className='mt-2 sm:mt-0'>
          {shortenAbstract(abstract)}{' '}
          <Link
            className='ml-2 text-[#21A0A0] hover:text-[#21a0a0b5] font-bold transition duration-300 ease-in-out transform'
            to={url}
            target='_blank'
            rel='noopener noreferrer'
          >
            Lire plus
          </Link>
        </p>
      </div>
      <div className='flex items-center'>
        <Link to={url} target='_blank' rel='noopener noreferrer'>
          <FaFilePdf className='text-3xl sm:text-4xl text-[#FE5B5B] hover:text-[#fe5b5bd3] transition duration-300 ease-in-out transform' />
        </Link>
        <FaHeart
          className={`ml-4 cursor-pointer text-[#FF0000] hover:text-[#FF6262] text-3xl sm:text-4xl transition duration-300 ease-in-out transform`}
          onClick={handleFav}
        />
      </div>
    </div>
  );
};

export default ArticleFav;
