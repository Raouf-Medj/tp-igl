import React from 'react'
import ArticleFav from './articleFav';


const ListFav = ({ articles, setArticles }) => {

    return (
        <div className='max-h-[650px] overflow-y-auto'>
            {articles.map((article) => (
                <ArticleFav key={article.id} id={article.id} title={article.title} url={article.url} abstract={article.abstract} articles={articles} setArticles={setArticles}/>
            ))}
        </div>
    )
}

export default ListFav;