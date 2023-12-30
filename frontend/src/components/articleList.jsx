import React from 'react'
import Article from './article';


const ArticleList = ({ articles, isRectifier }) => {

    return (
        <div className='max-h-[650px] overflow-y-auto'>
            {articles.map((article) => (
                <Article key={article.id} id={article.id} title={article.title} url={article.url} abstract={article.abstract} isRectifier={isRectifier} />
            ))}
        </div>
    )
}

export default ArticleList;