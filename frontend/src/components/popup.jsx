import React from 'react';
import { FaCircleCheck, FaCircleInfo } from "react-icons/fa6";
import { TiWarning } from "react-icons/ti";
import { MdError, MdOutlineClose } from "react-icons/md";

const Popup = ({ isOpen, onClose, type, message }) => {
  if (!isOpen) return null;

  let bgColor, icon, outline, textColor;

  switch (type) {
    case 'succès':
      bgColor = 'bg-[#bce8cb]';
      icon = 'text-green-700';
      outline = 'outline-700';
      textColor = 'text-[#4e8551]';
      break;
    case 'alerte':
      bgColor = 'bg-[#fceecd]';
      icon = 'text-[#c79833]';
      outline = 'outline-[#c79833]';
      textColor = 'text-[#d7aa47]';
      break;
    case 'erreur':
      bgColor = 'bg-[#f0cdcc]';
      icon = 'text-[#983532]';
      outline = 'outline-[#983532]';
      textColor = 'text-[#a6413d]';
      break;
    default:
      bgColor = 'bg-[#cde8fe]';
      icon = 'text-[#3775a8]';
      outline = 'outline-[#3775a8]';
      textColor = 'text-[#3775a8]';
  }

  return (
    <div className={`fixed right-0 left-0 bottom-10 z-50 flex items-center justify-center transform transition duration-300 ease-in-out ${isOpen ? "translate-y-[-20px]" : "translate-y-full"}`}>
      <div className={`w-1/3 p-5 outline outline-1 ${outline} rounded-lg bg-opacity-95 ${bgColor} ${textColor}`}>
        <div className="flex items-center">
          <div className={`mr-2 ${icon} text-lg flex justify-center items-center`}>
            {type === 'succès' && <FaCircleCheck/>}
            {type === 'alerte' && <TiWarning/>}
            {type === 'erreur' && <MdError/>}
            {type === 'info' && <FaCircleInfo/>}
          </div>
          <h1 className="text-lg font-bold">{type.charAt(0).toUpperCase() + type.slice(1)}</h1>
        </div>
        <p className='font-medium'>{message}</p>
        <button className={`absolute top-4 right-[34%] ${icon}`} onClick={onClose}>
          <MdOutlineClose size={25}/>
        </button>
      </div>
    </div>
  );
};

export default Popup;
