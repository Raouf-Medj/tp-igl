import ProtectedComponent from '../../components/protected';
import React, { useState, useEffect } from 'react';
import SearchBar from '../../components/search';
import ArticleList from '../../components/articleList';
import { AiOutlineCaretUp, AiOutlineCaretDown } from "react-icons/ai";
import axios from 'axios';
import Popup from '../../components/popup';

const ModHome = ({ err, setErr, isPopupOpenError, setIsPopupOpenError, updateArticles }) => {

  const [articles, setArticles] = useState([]);
  const [articlesToShow, setArticlesToShow] = useState(articles.filter((article) => !article.validated));
  const [searchResult, setSearchResult] = useState(articlesToShow);
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedOption, setSelectedOption] = useState("Articles à réctifier");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchArticles = async () => {
      setLoading(true);
      await axios.post('http://localhost:5000/api/articles/search', {
          query: "", 
          authors: [],
          institutions: [],
          keywords: [],
          date_debut: "",
          date_fin: ""
      })
      .then(response => {
          const allArticles = response.data.articles;
          setArticles(allArticles);
          setArticlesToShow(allArticles.filter((article) => !article.validated));
          setSearchResult(allArticles.filter((article) => !article.validated));
      })
      .catch(error => {
        if (error.response && error.response.data) {
          setErr(error.response.data.error);
          setIsPopupOpenError(true);
        } else {
          setErr('Une erreur est survenue');
          setIsPopupOpenError(true);
        }
      })
      .finally(() => {
          setLoading(false);
      })
    }

    fetchArticles();
  }, [setErr, setIsPopupOpenError, updateArticles]);

  const searchHandler = () => {
    const filteredArticles = articlesToShow.filter(article => article.title.toLowerCase().includes(query.toLowerCase()));
    setSearchResult(filteredArticles);
    // setQuery("");
  }

  const HandleDropDownOption = () => {
    if (selectedOption === "Articles à réctifier") {
      setArticlesToShow(articles);
      setSearchResult(articles.filter(article => article.title.toLowerCase().includes(query.toLowerCase())));
    }
    else {
      setArticlesToShow(articles.filter((article) => !article.validated));
      setSearchResult(articles.filter((article) => !article.validated).filter(article => article.title.toLowerCase().includes(query.toLowerCase())));
    }
    setSelectedOption(prevOption => (
      prevOption === "Articles à réctifier" ? "Tous les articles" : "Articles à réctifier"
    ));
    setIsOpen(false);
  };

  return (
    <ProtectedComponent role="MOD">
      <Popup message={err} isOpen={isPopupOpenError} type={"erreur"} onClose={() => {setIsPopupOpenError(false); setErr("")}} />
      <div className='sm:px-4 md:px-8 lg:px-[5%] xl:px-[10%] pt-16 pb-10 relative'>
        <SearchBar query={query} setQuery={setQuery} placeholder="Rechercher un article par titre" searchHandler={searchHandler} />
        <div className='mt-6 sm:mt-10 flex flex-col sm:flex-row justify-between items-center mb-4'>
          { selectedOption === "Tous les articles" ? (
            <h1 className='font-bold text-xl sm:text-2xl mb-3 sm:mb-0'>Tous les articles ({articlesToShow.length})</h1>
          ) :
            <h1 className='font-bold text-xl sm:text-2xl mb-3 sm:mb-0'>Articles à réctifier ({articlesToShow.filter((article) => !article.validated).length})</h1>
          }
          <div className='relative mt-4 sm:mt-0 z-10'>
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
        { loading ? (
            <div className='w-full flex items-center justify-center flex-col'>
                <img src="/spinner2.gif" alt="spinner" className=" w-[5%] h-auto"/>
            </div>
        ) : (
            searchResult.length > 0 ? (
              <ArticleList articles={searchResult} isRectifier={true}/>
            ) : (
                <div className='flex justify-center items-center w-full mt-[10%] flex-col'>
                    <img src="/images/img_no_result.png" alt="no_result" className="w-[10%] h-auto"/>
                    <h1 className='font-bold sm:text-2xl mt-5 '>Liste vide...</h1>
                </div>
            )
        )}
      </div>
    </ProtectedComponent>
  );
}

export default ModHome;
