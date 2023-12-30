import ProtectedComponent from '../../components/protected';
import React, { useState, useEffect } from 'react';
import SearchBar from '../../components/search';
import ListFav from '../../components/ListFav';
import axios from 'axios';
import useToken from '../../utils/useToken';

const Favoris = () => {

    const { userid } = useToken();

    const [query, setQuery] = useState("");
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchResult, setSearchResult] = useState([]);
    const [err, setErr] = useState("");

    useEffect(() => {

        const fetchFavoris = async () => {
          setLoading(true);
          await axios.get(`http://localhost:5000/api/favoris/${userid}`)
          .then(response => {
            setArticles(response.data.articles);
          })
          .catch(error => {
              if (error.response && error.response.data) {
                  setErr(error.response.data.error);
              } else {
                  setErr('Une erreur est survenue');
              }
          })
          .finally(() => {
              setLoading(false);
          })
        }
    
        fetchFavoris();
    }, []);

    const searchHandler = () => {
        const filteredArticles = articles.filter(article => article.title.toLowerCase().includes(query.toLowerCase()));
        console.log(query);
        setSearchResult(filteredArticles);
        // setQuery("");
    };

    return (
        <ProtectedComponent role="CLIENT">
            <div className='xl:px-[10%] lg:px-[5%] px-10 pt-16 pb-10'>
                <SearchBar query={query} setQuery={setQuery} placeholder="Rechercher un article par titre" searchHandler={searchHandler}/>
                <div className='mt-10'>
                    <h1 className='font-bold text-xl mb-3'>Articles favoris ({articles.length})</h1>
                    { loading ? (
                        <div className='w-full flex items-center justify-center flex-col'>
                            <img src="/spinner2.gif" alt="spinner" className=" w-[5%] h-auto"/>
                        </div>
                    ) : (
                        searchResult.length > 0 ? (
                            <ListFav articles={searchResult} setArticles={setArticles}/>
                        ) : (
                            <div className='flex justify-center items-center w-full mt-[10%] flex-col'>
                                <img src="/images/img_no_result.png" alt="no_result" className="w-[10%] h-auto"/>
                                <h1 className='font-bold sm:text-2xl mt-5 '>Liste vide...</h1>
                            </div>
                        )
                    )}
                </div>
            </div>
        </ProtectedComponent>
    );
}

export default Favoris;
