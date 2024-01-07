import React from 'react';
import ArticleFav from './articleFav';

/**
 * ListFav component to display a list of favorite articles.
 * @param {object[]} articles - List of articles
 * @param {Function} setArticles - Function to set the articles
 * @param {object[]} searchResult - List of articles in search results
 * @param {Function} setSearchResult - Function to set the search results
 * @returns {JSX.Element} ListFav component
 */
const ListFav = ({ articles, setArticles, searchResult, setSearchResult }) => {

    return (
        <div className='max-h-[650px] overflow-y-auto'>
            {searchResult.map((article) => (
                <ArticleFav
                    key={article.id}
                    id={article.id}
                    title={article.title}
                    url={article.url}
                    abstract={article.abstract}
                    articles={articles}
                    setArticles={setArticles}
                    searchResult={searchResult}
                    setSearchResult={setSearchResult}
                />
            ))}
        </div>
    );
};

export default ListFav;
