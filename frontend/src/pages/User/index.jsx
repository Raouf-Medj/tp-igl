import React, { useState } from 'react'
import ProtectedComponent from '../../components/protected';
import SearchBar from '../../components/search';
import ArticleList from '../../components/articleList';
import Filters from '../../components/filters';


const ClientHome = () => {

    const [query, setQuery] = useState("");

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
            <div className='xl:px-[10%] lg:px-[5%] px-10 pt-16 pb-10'>
                <SearchBar query={query} setQuery={setQuery} placeholder="Rechercher un article" searchHandler={searchHandler}/>
                <div className='mt-10'>
                    <h1 className='font-bold text-xl mb-3'>Articles trouvés ({articles.length})</h1>
                    <div className='flex lg:flex-row flex-col'>
                        <div className='lg:mr-10 lg:mb-0 mb-5'>
                            <Filters keywords={keywords} authors={authors} institutions={institutions} dateDeb={dateDeb} dateFin={dateFin} setKeywords={setKeywords} setAuthors={setAuthors} setInstitutions={setInstitutions} setDateDeb={setDateDeb} setDateFin={setDateFin}/>
                        </div>
                        <ArticleList articles={articles}/>
                    </div>
                </div>
            </div>
        </ProtectedComponent>
    )
}

export default ClientHome;