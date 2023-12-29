import ProtectedComponent from '../../components/protected';
import React, { useState } from 'react';
import SearchBar from '../../components/search';
import ListFav from '../../components/ListFav';

const Favoris = () => {
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

    const searchHandler = () => {
        setQuery("");
    };

    return (
        <ProtectedComponent role="CLIENT">
            <div className='xl:px-[10%] lg:px-[5%] px-10 pt-16 pb-10'>
                <SearchBar query={query} setQuery={setQuery} placeholder="Rechercher un article par titre" searchHandler={searchHandler}/>
                <div className='mt-10'>
                    <h1 className='font-bold text-xl mb-3'>Articles trouvés ({articles.length})</h1>
                    <ListFav articles={articles}/>
                </div>
            </div>
        </ProtectedComponent>
    );
}

export default Favoris;
