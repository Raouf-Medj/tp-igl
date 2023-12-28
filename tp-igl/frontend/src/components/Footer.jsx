import React from 'react';
import { Link } from 'react-router-dom';
import { IoArrowUp, IoLogoInstagram } from "react-icons/io5";
import { FaLinkedinIn } from "react-icons/fa";
import { FaXTwitter, FaFacebookF } from "react-icons/fa6";
import { MdAlternateEmail } from "react-icons/md";


const Footer = () => {

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <div className='py-12 px-16 bg-[#FCFFF7] rounded-b-3xl shadow-md hover:shadow-xl rotate-180 transition duration-300 ease-in-out transform'>
      <div className='rotate-180'>
        <div className='flex justify-between items-center'>
          <Link to="/" className='w-[12%] h-auto'>
            <img
              src="/images/img_logo.png"
              alt="logo_img"
            />
          </Link>

          <Link to="#" onClick={scrollToTop} className='flex items-center bg-[#046865] hover:bg-[#046865d4] hover:shadow-lg text-white font-semibold rounded-full py-3 px-5 transition duration-300 ease-in-out transform'>
            <h1 className='mr-1'>Haut de page</h1>
            <IoArrowUp className='text-lg'/>
          </Link>

          <div className='flex text-3xl text-[#046865]'>
            <Link to="https://www.instagram.com" target="_blank"><IoLogoInstagram/></Link>
            <Link to="https://www.linkedin.com" target="_blank" className='mx-4'><FaLinkedinIn/></Link>
            <Link to="https://www.twitter.com" target="_blank"><FaXTwitter/></Link>
            <Link to="https://www.facebook.com" target="_blank"><FaFacebookF className='mx-4'/></Link>
            <Link to="mailto:contact@scifetch.dz" target="_blank"><MdAlternateEmail/></Link>
          </div>
        </div>
        <div className='bg-[#04686588] rounded h-0.5 my-10'/>
        <div className='flex justify-center items-center text-[#03514ec5] text-xl'>
          ©<span className='font-medium mx-1'>2023</span><span className='font-semibold'>SciFetch</span>
        </div>
      </div>
    </div>
  );
};

export default Footer;