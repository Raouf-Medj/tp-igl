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
            {/* Content */}
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
    // State
    const [isAddedToFavorites, setIsAddedToFavorites] = useState(false);
    const [loading, setLoading] = useState(false);

    // Token
    const { userid } = useToken();

    // Fetch favorites on component load
    useEffect(() => {
        const fetchFavoris = async () => {
            setLoading(true);
            await axios.get(`http://localhost:5000/api/favoris/${userid}`)
                .then(response => {
                    setIsAddedToFavorites(response.data.articles.some(article => article.id === id));
                })
                .catch(error => {
                    // Handle error
                })
                .finally(() => {
                    setLoading(false);
                });
        };
        fetchFavoris();
    }, [userid, id]);

    // Add article to favorites
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
                // Handle error
            })
            .finally(() => {
                setLoading(false);
            });
    };

    // Remove article from favorites
    const handleRemoveFromFavorites = async () => {
        setLoading(true);
        await axios.delete(`http://localhost:5000/api/favoris/${userid}/${id}`)
            .then(() => {
                setIsAddedToFavorites(false);
            })
            .catch(error => {
                // Handle error
            })
            .finally(() => {
                setLoading(false);
            });
    }

    return (
        <div className="flex flex-col items-start min-h-screen sm:p-8">
            {/* Favorites button */}
            {/* Article details */}
        </div>
    );
};

export default CenteredArticleDetails;



