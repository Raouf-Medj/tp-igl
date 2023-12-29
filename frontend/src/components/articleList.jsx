import React from 'react'
import Article from './article';


const ArticleList = ({ articles }) => {

    return (
        <div className='max-h-[650px] overflow-y-auto border border-[#04686516] rounded-xl'>
            {articles.map((article) => (
                <Article key={article.id} id={article.id} title={article.title} url={article.url} abstract={article.abstract} />
            ))}
        </div>
    )
}

export default ArticleList;