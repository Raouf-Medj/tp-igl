import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ProtectedComponent from '../../components/protected';
import CenteredArticleDetails from '../../components/articleDetails';
import axios from 'axios';


const Affichage = () => {

  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  useEffect(() => {

    const fetchArticle = async () => {
      setLoading(true);
      await axios.get(`http://localhost:5000/api/articles/${id}`)
      .then(response => {
        setArticle(response.data);
      })
      .catch(error => {
          if (error.response && error.response.data) {
              setErr(error.response.data.error);
          } else {
              setErr('Une erreur est survenue');
          }
      })
      .finally(() => {
          setLoading(false);
      })
    }

    fetchArticle();
  }, []);

  

  return (
    <ProtectedComponent role="CLIENT">
      <div className='px-4 md:px-8 lg:px-16 pt-8 md:pt-12 lg:pt-16 pb-6 md:pb-10'>
        { !article || loading ? (
          <div className='w-full flex items-center justify-center flex-col'>
            <img src="/spinner2.gif" alt="spinner" className=" w-[5%] h-auto"/>
          </div>
        ) : (
          <CenteredArticleDetails articleData={article} id={id}/>
        )}
      </div>
    </ProtectedComponent>
  );
};

export default Affichage;
