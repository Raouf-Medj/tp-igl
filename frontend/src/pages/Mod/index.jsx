import ProtectedComponent from '../../components/protected';
import React, { useState } from 'react';
import SearchBar from '../../components/search';
import ArticleList from '../../components/articleList';
import { AiOutlineCaretUp, AiOutlineCaretDown } from "react-icons/ai";

const ModHome = () => {

  const temp_abstract = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Bibendum vitae dictumst sit vitae, mi imperdiet sit. Lectus eleifend aliquam nibh mauris, pretium. Lectus magnis lorem massa urna felis ipsum dolor sit amet, consectetur adipiscing elit. Bibendum vitae dictumst sit vitae, mi imperdiet sit. Lectus eleifend aliquam nibh mauris, pretium. Lectus magnis lorem massa urna felis"

  const [articles, setArticles] = useState([
    { id: "article1", title: "Title 1", abstract: temp_abstract, url: "", validated: true},
    { id: "article2", title: "Title 2", abstract: temp_abstract, url: "", validated: true},
    { id: "article3", title: "Title 3", abstract: temp_abstract, url: "", validated: false},
    { id: "article4", title: "Title 4", abstract: temp_abstract, url: "", validated: true},
    { id: "article5", title: "Title 5", abstract: temp_abstract, url: "", validated: true},
    { id: "article6", title: "Title 6", abstract: temp_abstract, url: "", validated: false},
    { id: "article7", title: "Title 7", abstract: temp_abstract, url: "", validated: false},
    { id: "article8", title: "Title 8", abstract: temp_abstract, url: "", validated: true},
    { id: "article9", title: "Title 9", abstract: temp_abstract, url: "", validated: true},
    { id: "article10", title: "Title 10", abstract: temp_abstract, url: "", validated: true}
  ]);

  const [articlesToShow, setArticlesToShow] = useState(articles.filter((article) => !article.validated));
  const [searchResult, setSearchResult] = useState(articlesToShow);

  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedOption, setSelectedOption] = useState("Articles à réctifier");

  const searchHandler = () => {
    const filteredArticles = articlesToShow.filter(article => article.title.toLowerCase().includes(query.toLowerCase()));
    setSearchResult(filteredArticles);
    // setQuery("");
  }

  const HandleDropDownOption = () => {
    if (selectedOption === "Articles à réctifier") {
      setArticlesToShow(articles);
      setSearchResult(articles);
    }
    else {
      setArticlesToShow(articles.filter((article) => !article.validated));
      setSearchResult(articles.filter((article) => !article.validated));
    }
    setSelectedOption(prevOption => (
      prevOption === "Articles à réctifier" ? "Tous les articles" : "Articles à réctifier"
    ));
    setIsOpen(false);
  };

  return (
    <ProtectedComponent role="MOD">
      <div className='sm:px-4 md:px-8 lg:px-[5%] xl:px-[10%] pt-16 pb-10 relative'>
        <SearchBar query={query} setQuery={setQuery} placeholder="Rechercher un article par titre" searchHandler={searchHandler} />
        <div className='mt-6 sm:mt-10 flex flex-col sm:flex-row justify-between items-center mb-4'>
          { selectedOption === "Tous les articles" ? (
            <h1 className='font-bold text-xl sm:text-2xl mb-3 sm:mb-0'>Tous les articles ({articles.length})</h1>
          ) :
            <h1 className='font-bold text-xl sm:text-2xl mb-3 sm:mb-0'>Articles à réctifier ({articles.filter((article) => !article.validated).length})</h1>
          }
          <div className='relative mt-4 sm:mt-0'>
            <button
              onClick={() => setIsOpen(prev => !prev)}
              className='px-6 w-56 py-2 bg-[#21A0A0] text-white font-semibold rounded-md hover:bg-[#21a0a0a4] transition duration-300 ease-in-out flex items-center relative z-10'
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
        <ArticleList articles={searchResult} />
      </div>
    </ProtectedComponent>
  );
}

export default ModHome;
