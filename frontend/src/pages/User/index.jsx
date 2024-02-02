import React, { useState, useEffect } from 'react'
import axios from 'axios';
import ProtectedComponent from '../../components/protected';
import SearchBar from '../../components/search';
import ArticleList from '../../components/articleList';
import Filters from '../../components/filters';
import Popup from '../../components/popup';

const ClientHome = ({ err, setErr, isPopupOpenError, setIsPopupOpenError }) => {
        
    const [query, setQuery] = useState("");
    const [loading, setLoading] = useState(false);
    const [articles, setArticles] = useState([]);
    const [keywords, setKeywords] = useState([]);
    const [authors, setAuthors] = useState([]);
    const [institutions, setInstitutions] = useState([]);
    const [dateDeb, setDateDeb] = useState("");
    const [dateFin, setDateFin] = useState("");
    // const [err, setErr] = useState("");

    useEffect(() => {
        const fetchArticles = async () => {
            setLoading(true);
            await axios.post('http://localhost:5000/api/articles/search', {
                query: query, 
                authors: authors,
                institutions: institutions,
                keywords: keywords,
                date_debut: dateDeb,
                date_fin: dateFin
            })
            .then(response => {
                const validatedArticles = response.data.articles.filter(article => article.validated === true)
                setArticles(validatedArticles);
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
    }, [query, keywords, authors, institutions, dateDeb, dateFin, setErr, setIsPopupOpenError]);

    const searchHandler = () => {
        const fetchArticles = async () => {
            setLoading(true);
            await axios.post('http://localhost:5000/api/articles/search', {
                query: query, 
                authors: authors,
                institutions: institutions,
                keywords: keywords,
                date_debut: dateDeb,
                date_fin: dateFin
            })
            .then(response => {
                const validatedArticles = response.data.articles.filter(article => article.validated === true)
                // const validatedArticles = response.data.articles;
                setArticles(validatedArticles);
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
            })
        }

        fetchArticles();
    }

    return (
        <ProtectedComponent role="CLIENT">
            <Popup message={err} isOpen={isPopupOpenError} type={"erreur"} onClose={() => {setIsPopupOpenError(false); setErr("")}} />
            <div className='xl:px-[10%] lg:px-[5%] px-10 pt-16 pb-10'>
                <SearchBar query={query} setQuery={setQuery} placeholder="Rechercher un article" searchHandler={searchHandler}/>
                <div className='mt-10'>
                    <h1 className='font-bold text-xl mb-3'>Articles trouvés ({articles.length})</h1>
                    <div className='flex lg:flex-row flex-col'>
                        <div className='lg:mr-10 lg:mb-0 mb-5'>
                            <Filters keywords={keywords} authors={authors} institutions={institutions} dateDeb={dateDeb} dateFin={dateFin} setKeywords={setKeywords} setAuthors={setAuthors} setInstitutions={setInstitutions} setDateDeb={setDateDeb} setDateFin={setDateFin}/>
                        </div>
                        { loading ? (
                            <div className='flex justify-center items-center flex-col w-full'>
                                <img src="/spinner2.gif" alt="spinner" className=" w-[5%] h-auto"/>
                            </div>
                        ) : (
                            articles.length > 0 ? (
                                <ArticleList articles={articles}/>
                            ) : (
                                <div className='flex justify-center items-center w-full flex-col'>
                                    <img src="/images/img_no_result.png" alt="no_result" className="w-[15%] h-auto"/>
                                    <h1 className='font-bold sm:text-2xl mt-5 '>Pas de résultats</h1>
                                </div>
                            )
                        )}
                    </div>
                </div>
            </div>
        </ProtectedComponent>
    )
}

export default ClientHome;