import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import useToken from '../utils/useToken';
import axios from 'axios';

/**
 * Renders detailed information about the article.
 *
 * @param {Object} props - The article details props
 * @param {Object} props.articleData - Information about the article
 * @returns {JSX.Element} Component displaying detailed article information
 */
const ArticleDetails = ({ articleData }) => {
    // Styles
    const customStyle = { color: '#767F8C' };
    const titleStyle = {
        color: '#046865',
        textAlign: 'center',
        fontFamily: 'Poppins',
        fontSize: '3vw',
        fontStyle: 'normal',
        fontWeight: 500,
        marginTop: '2rem',
        marginBottom: '3rem',
    };

    return (
        <div className="article-details mx-8 md:mx-16">
          <h2 style={titleStyle}>
            {articleData.title}
          </h2>
    
          <div className="flex justify-between sm:text-base text-xs">
            <div className='w-[50%]'>
              <p style={customStyle}>Auteurs:</p>
              {articleData.authors.map((author, index) => (
                <p key={index}>{author}</p>
              ))}
            </div>
            <div className="w-[50%] ml-8 md:ml-20">
              <p style={customStyle}>Institutions:</p>
              {articleData.institutions.map((institution, index) => (
                <p key={index}>{institution}</p>
              ))}
            </div>
          </div>
    
          <div className="my-4" />
    
          <div className="flex justify-between sm:text-base text-xs">
            <div className='w-[50%]'>
              <p style={customStyle}>Mots-clés:</p>
              {articleData.keywords.map((keyword, index) => (
                <p key={index}>{keyword}</p>
              ))}
            </div>
            <div className="w-[50%] ml-8 md:ml-20">
              <p style={customStyle}>Date de publication:</p>
              <p>{articleData.publication_date}</p>
            </div>
          </div>
    
          <div className="my-4 h-0.5 bg-gray-300 rounded " />
    
          <p className='sm:text-base text-xs' style={customStyle}>Résumé:</p>
          <p className='sm:text-base text-xs'>{articleData.abstract}</p>
    
          <div className="my-4 h-0.5 bg-gray-300 rounded " />
    
          <p className='sm:text-base text-xs' style={customStyle}>Texte intégral:</p>
          <p className='sm:text-base text-xs'>{articleData.text}</p>
    
          <div className="my-4 h-0.5 bg-gray-300 rounded " />
    
          <div className='sm:text-base text-xs'>
            <p style={customStyle}>Références:</p>
            {articleData.references.map((reference, index) => (
              <p key={index}>{reference}</p>
            ))}
          </div>
        </div>
      );
    };
  

/**
 * Renders the article details centered on the page.
 *
 * @param {Object} props - The centered article details props
 * @param {Object} props.articleData - Information about the article
 * @param {string} props.id - The unique identifier for the article
 * @returns {JSX.Element} Component rendering centered article details
 */
const CenteredArticleDetails = ({ articleData, id }) => {

    const [isAddedToFavorites, setIsAddedToFavorites] = useState(false);
    const [loading, setLoading] = useState(false);
  
    const { userid } = useToken();
    useEffect(() => {
  
      const fetchFavoris = async () => {
        setLoading(true);
        await axios.get(`http://localhost:5000/api/favoris/${userid}`)
        .then(response => {
          setIsAddedToFavorites(response.data.articles.some(article => article.id === id));
        })
        .catch(error => {
          if (error.response && error.response.data) {
              // setErr(error.response.data.error);
          } else {
              // setErr('Une erreur est survenue');
          }
        })
        .finally(() => {
          setLoading(false);
        })
      }
  
      fetchFavoris();
  }, [userid, id]);
  
    const handleAddToFavorites = async () => {
      setLoading(true);
      await axios.post("http://localhost:5000/api/favoris", {
        article_id: id,
        user_id: userid
      })
      .then(() => {
        setIsAddedToFavorites(true);
      })
      .catch(error => {
          if (error.response && error.response.data) {
              // setErr(error.response.data.error);
          } else {
              // setErr('Une erreur est survenue');
          }
      })
      .finally(() => {
        setLoading(false);
      })
    };
  
    const handleRemoveFromFavorites = async () => {
      setLoading(true);
      await axios.delete(`http://localhost:5000/api/favoris/${userid}/${id}`)
      .then(() => {
        setIsAddedToFavorites(false);
      })
      .catch(error => {
          if (error.response && error.response.data) {
              // setErr(error.response.data.error);
          } else {
              // setErr('Une erreur est survenue');
          }
      })
      .finally(() => {
        setLoading(false);
      })
    }
  

    return (
        <div className="flex flex-col items-start min-h-screen sm:p-8">
          {!isAddedToFavorites ? (
            <button
              disabled={loading}
              onClick={handleAddToFavorites}
              className="mb-8 px-4 py-2 mx-auto bg-white text-black rounded-full border border-gray hover:bg-gray-200 flex items-center"
            >
              { loading ? (
                <div className='w-full flex items-center justify-center flex-col'>
                  <img src="/spinner2.gif" alt="spinner" className=" w-[12%] h-auto"/>
                </div>
              ) : (
                <div>
                  <FontAwesomeIcon icon={faHeart} className="mr-2" /> Ajouter aux favoris
                </div>
              )}
            </button>
          ) : (
            <button disabled={loading} onClick={handleRemoveFromFavorites} className='mb-8 px-4 py-2 mx-auto text-red-500 bg-white rounded-full border border-gray hover:bg-gray-200 flex items-center'>
              { loading ? (
                <div className='w-full flex items-center justify-center flex-col'>
                  <img src="/spinner2.gif" alt="spinner" className=" w-[12%] h-auto"/>
                </div>
              ) : (
                <div>
                  <FontAwesomeIcon icon={faHeart} className="mr-2" /> Ajouté aux favoris!
                </div>
              )}
            </button>
          )}
    
          <div className="w-11/12 md:w-2000px h-screen md:h-2000px mx-auto bg-white border border-gray sm:p-8 rounded-md overflow-auto">
            <ArticleDetails articleData={articleData} />
          </div>
        </div>
      );
    
};

export default CenteredArticleDetails;



