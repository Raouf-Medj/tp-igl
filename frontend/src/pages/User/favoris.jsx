import ProtectedComponent from '../../components/protected';
import React, { useState } from 'react';
import SearchBar from '../../components/search';
import ListFav from '../../components/ListFav';

const Favoris = () => {
    const [nbArticles, setNbArticles] = useState(0);
    const [query, setQuery] = useState("");

    const searchHandler = () => {
        setQuery("");
    };

    return (
        <ProtectedComponent role="CLIENT">
            <div className='xl:px-[15%] lg:px-[10%] px-10 pt-16 pb-10'>
                <SearchBar query={query} setQuery={setQuery} placeholder="Rechercher un article" searchHandler={searchHandler}/>
                <div className='mt-10'>
                    <h1 className='font-bold text-xl mb-3'>Articles trouvés ({nbArticles})</h1>
                    <ListFav/>
                </div>
            </div>
        </ProtectedComponent>
    );
}

export default Favoris;
