import React, { useState } from 'react';
import { FaFilePdf } from 'react-icons/fa6';
import { Link } from 'react-router-dom';
import { FaHeart } from 'react-icons/fa';
import axios from 'axios';
import useToken from '../utils/useToken';

/**
 * Component displaying information about a favorite article.
 *
 * @param {Object} props - The article details props
 * @param {string} props.title - The title of the article
 * @param {string} props.url - The URL of the article
 * @param {string} props.abstract - The abstract of the article
 * @param {string} props.id - The unique identifier of the article
 * @param {Array} props.articles - List of articles
 * @param {Function} props.setArticles - Function to set articles
 * @param {Array} props.searchResult - List of search results
 * @param {Function} props.setSearchResult - Function to set search results
 * @returns {JSX.Element} Component displaying favorite article information
 */
const ArticleFav = ({ title, url, abstract, id, articles, setArticles, searchResult, setSearchResult }) => {

  /**
   * Shortens the abstract of the article.
   *
   * @param {string} abstract - The abstract of the article
   * @returns {string} Shortened abstract
   */
  const shortenAbstract = (abstract) => {
    if (abstract !== undefined) {
      const words = abstract.split(' ');
      return words.slice(0, 25).join(' ') + '...';
    }
    return '';
  };

  /**
   * Handles viewing the PDF associated with the article.
   */
  const handleViewPdf = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/uploads/${url}`, {
        responseType: 'arraybuffer',
      });

      // Create a blob from the array buffer
      const blob = new Blob([response.data], { type: 'application/pdf' });

      // Create a URL for the blob
      const pdfUrl = URL.createObjectURL(blob);

      // Open the PDF in a new tab or window
      window.open(pdfUrl, '_blank');
    } catch (error) {
      console.error('Error fetching PDF:', error);
    }
  };

  const { userid } = useToken();
  const [loading, setLoading] = useState(false);

  /**
   * Handles removing the article from favorites.
   */
  const handleFav = async () => {
    setLoading(true);
    await axios.delete(`http://localhost:5000/api/favoris/${userid}/${id}`)
      .then(() => {
        const updatedArticles = articles.filter((article) => article.id !== id);
        setArticles(updatedArticles);
        const updatedSearchResult = searchResult.filter((article) => article.id !== id);
        setSearchResult(updatedSearchResult);
      })
      .catch(error => {
        // Handle error
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className='flex flex-col sm:flex-row items-center justify-between bg-[#FFFFFF] border border-[#E5E5E5] py-4 px-6 rounded-lg mb-5 hover:drop-shadow-lg transition duration-300 ease-in-out transform'>
      {/* Article details */}
    </div>
  );
};

export default ArticleFav;
