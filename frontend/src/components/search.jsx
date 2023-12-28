import React from 'react'
import { RiSearchFill } from "react-icons/ri";


const SearchBar = ({ query, setQuery, placeholder, searchHandler, hideButton }) => {

    return (
        <div className="bg-white py-1 px-4 rounded-md border border-[#E5E5E5] flex items-center w-full focus-within:border-[#21A0A0]">
            <RiSearchFill className='text-[#21A0A0] text-xl' />
            <input
                type="text"
                name="search"
                id="search"
                placeholder={placeholder}
                className="outline-none px-3 flex-1"
                value={query}
                onChange={(e) => {
                    setQuery(e.target.value);
                }}
            />
            <div className='bg-[#EDEFF5] rounded w-0.5 h-14 mx-4'/>
            <button onClick={searchHandler} className='px-6 py-2 bg-[#21A0A0] text-white font-semibold rounded-md hover:bg-[#21a0a0a4] transition duration-300 ease-in-out transform'>
                Trouver Article
            </button>
        </div>
    )
}

export default SearchBar;