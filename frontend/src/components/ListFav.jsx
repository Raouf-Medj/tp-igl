import React from 'react'
import ArticleFav from './articleFav';


const ListFav = ({ articles }) => {

    return (
        <div className='max-h-[650px] overflow-y-auto border border-[#04686516] rounded-xl'>
            {articles.map((article) => (
                <ArticleFav key={article.id} title={article.title} url={article.url} abstract={article.abstract} />
            ))}
        </div>
    )
}

export default ListFav;