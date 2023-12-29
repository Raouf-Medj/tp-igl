import ProtectedComponent from '../../components/protected';
import React, { useState } from 'react';
import SearchBar from '../../components/search';
import ArticleList from '../../components/articleList';
import { AiOutlineCaretUp, AiOutlineCaretDown } from "react-icons/ai";

const ModHome = () => {
  const [nbArticles, setNbArticles] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedOption, setSelectedOption] = useState("Articles à réctifier");

  const searchHandler = () => {
    setQuery("");
  }

  const HandleDropDownOption = () => {
    setSelectedOption(prevOption => (
      prevOption === "Articles à réctifier" ? "Tous les articles" : "Articles à réctifier"
    ));
    setIsOpen(false);
  };

  return (
    <ProtectedComponent role="MOD">
      <div className='sm:px-4 md:px-8 lg:px-[10%] xl:px-[15%] pt-16 pb-10 relative'>
        <SearchBar query={query} setQuery={setQuery} placeholder="Rechercher un article" searchHandler={searchHandler} />
        <div className='mt-6 sm:mt-10 flex flex-col sm:flex-row justify-between items-center mb-4'>
          <h1 className='font-bold text-xl sm:text-2xl mb-3 sm:mb-0'>Articles à réctifier ({nbArticles})</h1>
          <div className='relative mt-4 sm:mt-0'>
            <button
              onClick={() => setIsOpen(prev => !prev)}
              className='px-6 py-2 bg-[#21A0A0] text-white font-semibold rounded-md hover:bg-[#21a0a0a4] transition duration-300 ease-in-out flex items-center relative z-10'
            >
              {selectedOption}
              {!isOpen ? (
                <AiOutlineCaretDown className='h-6 ml-2' />
              ) : (
                <AiOutlineCaretUp className='h-6 ml-2' />
              )}
            </button>
            {isOpen && (
              <div className='absolute mt-2 bg-[#21A0A0] text-white rounded-md shadow-md w-full'>
                <button
                  className='block px-6 py-2 hover:bg-[#21a0a0a4] transition duration-300 ease-in-out w-full text-left'
                  onClick={HandleDropDownOption}
                >
                  {selectedOption === "Tous les articles" ? "Articles à réctifier" : "Tous les articles"}
                </button>
              </div>
            )}
          </div>
        </div>
        <ArticleList />
      </div>
    </ProtectedComponent>
  );
}

export default ModHome;
