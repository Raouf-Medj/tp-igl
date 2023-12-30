import React, { useState, useEffect } from 'react'
import axios from 'axios';
import ProtectedComponent from '../../components/protected';
import SearchBar from '../../components/search';
import ArticleList from '../../components/articleList';
import Filters from '../../components/filters';


const ClientHome = () => {

    // const temp_abstract = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Bibendum vitae dictumst sit vitae, mi imperdiet sit. Lectus eleifend aliquam nibh mauris, pretium. Lectus magnis lorem massa urna felis ipsum dolor sit amet, consectetur adipiscing elit. Bibendum vitae dictumst sit vitae, mi imperdiet sit. Lectus eleifend aliquam nibh mauris, pretium. Lectus magnis lorem massa urna felis"
    
    // const [articles, setArticles] = useState([
    //     { id: "article1", title: "Title 1", abstract: temp_abstract, url: "", validated: true},
    //     { id: "article2", title: "Title 2", abstract: temp_abstract, url: "", validated: true},
    //     { id: "article3", title: "Title 3", abstract: temp_abstract, url: "", validated: false},
    //     { id: "article4", title: "Title 4", abstract: temp_abstract, url: "", validated: true},
    //     { id: "article5", title: "Title 5", abstract: temp_abstract, url: "", validated: true},
    //     { id: "article6", title: "Title 6", abstract: temp_abstract, url: "", validated: false},
    //     { id: "article7", title: "Title 7", abstract: temp_abstract, url: "", validated: false},
    //     { id: "article8", title: "Title 8", abstract: temp_abstract, url: "", validated: true},
    //     { id: "article9", title: "Title 9", abstract: temp_abstract, url: "", validated: true},
    //     { id: "article10", title: "Title 10", abstract: temp_abstract, url: "", validated: true}
    // ]);
        
    const [query, setQuery] = useState("");
    const [loading, setLoading] = useState(false);
    const [articles, setArticles] = useState([]);
    const [keywords, setKeywords] = useState([]);
    const [authors, setAuthors] = useState([]);
    const [institutions, setInstitutions] = useState([]);
    const [dateDeb, setDateDeb] = useState("");
    const [dateFin, setDateFin] = useState("");
    const [err, setErr] = useState("");

    useEffect(() => {
        searchHandler();
    }, [keywords, authors, institutions, dateDeb, dateFin]);

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
                    setErr(error.response.data.error);
                } else {
                    setErr('Une erreur est survenue');
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