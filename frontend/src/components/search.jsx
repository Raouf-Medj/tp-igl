import React from 'react'
import { RiSearchFill } from "react-icons/ri";


const SearchBar = ({ query, setQuery, placeholder, searchHandler, isForMod }) => {

    return (
        <div className="bg-white py-1 sm:px-4 px-2 rounded-md border border-[#E5E5E5] flex items-center w-full focus-within:border-[#21A0A0]">
            <RiSearchFill className='text-[#21A0A0] text-xl sm:block hidden' />
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
                onKeyDown={(event) => {if (event.key === 'Enter') {searchHandler()}}}
            />
            <div className='bg-[#EDEFF5] rounded w-0.5 h-14 sm:mx-4 sm:block hidden'/>
            <button id="search" onClick={searchHandler} className='sm:px-6 sm:py-2 p-3 bg-[#21A0A0] text-white font-semibold rounded-md hover:bg-[#21a0a0a4] transition duration-300 ease-in-out transform'>
                {!isForMod ? (
                    <div>
                        <h1 className='sm:block hidden'>Trouver article</h1>
                        <RiSearchFill className='sm:hidden text-white text-xl' />
                    </div>
                ) : (
                    <div>
                        <h1 className='sm:block hidden'>Trouver modérateur</h1>
                        <RiSearchFill className='sm:hidden text-white text-xl' />
                    </div>
                )}
            </button>
        </div>
    )
}

export default SearchBar;