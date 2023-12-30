import React, { useState, useEffect } from 'react'
import Article from './article';


const ArticleList = ({ articles, isRectifier }) => {

    const [sortedArticles, setSortedArticles] = useState([]);

    useEffect(() => {
        console.log(articles);
        const sorted = [...articles].sort((a, b) => {
            const dateA = new Date(a.publication_date);
            const dateB = new Date(b.publication_date);
            return dateB - dateA; // Sort in descending order (from recent to oldest)
        });
    
        console.log(sorted);
        setSortedArticles(sorted);
    }, []);

    return (
        <div className='max-h-[650px] overflow-y-auto'>
            {sortedArticles.map((article) => (
                <Article key={article.id} id={article.id} title={article.title} url={article.url} abstract={article.abstract} isRectifier={isRectifier} />
            ))}
        </div>
    )
}

export default ArticleList;