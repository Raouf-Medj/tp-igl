import React, { useState, useEffect } from 'react';
import Article from './article';

/**
 * Component displaying a list of articles.
 *
 * @param {Object} props - The article list props
 * @param {Array} props.articles - List of articles
 * @param {boolean} props.isRectifier - Indicates if the user is a rectifier
 * @returns {JSX.Element} Component displaying the list of articles
 */
const ArticleList = ({ articles, isRectifier }) => {
  const [sortedArticles, setSortedArticles] = useState([]);

  useEffect(() => {
    // Sort articles by publication date in descending order
    const sorted = [...articles].sort((a, b) => {
      const dateA = new Date(a.publication_date);
      const dateB = new Date(b.publication_date);
      return dateB - dateA; // Sort in descending order (from recent to oldest)
    });

    setSortedArticles(sorted);
  }, [articles]);

  return (
    <div className='max-h-[650px] overflow-y-auto'>
      {/* Render each article */}
      {sortedArticles.map((article) => (
        <Article
          key={article.id}
          id={article.id}
          title={article.title}
          url={article.url}
          abstract={article.abstract}
          isRectifier={isRectifier}
        />
      ))}
    </div>
  );
};

export default ArticleList;
