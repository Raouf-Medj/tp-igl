import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import ProtectedComponent from '../../components/protected';
import ArticleDetails from '../../components/articleDetails';

const Affichage = () => {

  const { id } = useParams();
  const [article, setArticle] = useState({});

  return (
    <ProtectedComponent role="CLIENT">
      <div className='px-4 md:px-8 lg:px-16 pt-8 md:pt-12 lg:pt-16 pb-6 md:pb-10'>
        <ArticleDetails articleData={article} />
      </div>
    </ProtectedComponent>
  );
};

export default Affichage;
