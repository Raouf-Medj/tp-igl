import React, { useState } from 'react'
import ProtectedComponent from '../../components/protected';
import SearchBar from '../../components/search';
import ArticleList from '../../components/articleList';
import Filters from '../../components/filters';


const ClientHome = () => {

    const [nbArticles, setNbArticles] = useState(0);
    const [query, setQuery] = useState("");

    
    const [keywords, setKeywords] = useState([]);
    const [authors, setAuthors] = useState([]);
    const [institutions, setInstitutions] = useState([]);
    const [dateDeb, setDateDeb] = useState("");
    const [dateFin, setDateFin] = useState("");

    const searchHandler = () => {
        setQuery("");
    }

    return (
        <ProtectedComponent role="CLIENT">
            <div className='px-72 pt-16 pb-10'>
                <SearchBar query={query} setQuery={setQuery} placeholder="Rechercher un article" searchHandler={searchHandler}/>
                <div className='mt-10'>
                    <h1 className='font-bold text-xl mb-3'>Articles trouvés ({nbArticles})</h1>
                    <div className='flex'>
                        <div className='mr-10'>
                            <Filters keywords={keywords} authors={authors} institutions={institutions} dateDeb={dateDeb} dateFin={dateFin} setKeywords={setKeywords} setAuthors={setAuthors} setInstitutions={setInstitutions} setDateDeb={setDateDeb} setDateFin={setDateFin}/>
                        </div>
                        <ArticleList/>
                    </div>
                </div>
            </div>
        </ProtectedComponent>
    )
}

export default ClientHome;