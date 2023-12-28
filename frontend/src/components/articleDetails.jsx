import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-solid-svg-icons';

const ArticleDetails = ({ articleData }) => {
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
  
        <div className="flex justify-between">
          <div>
            <p style={customStyle}>Auteurs:</p>
            {articleData.authors.map((author, index) => (
              <p key={index}>{author}</p>
            ))}
          </div>
          <div className="ml-8 md:ml-20">
            <p style={customStyle}>Institutions:</p>
            {articleData.institutions.map((institution, index) => (
              <p key={index}>{institution}</p>
            ))}
          </div>
        </div>
  
        <div className="my-4" />
  
        <div className="flex justify-between">
          <div>
            <p style={customStyle}>Mots-clés:</p>
            {articleData.keywords.map((keyword, index) => (
              <p key={index}>{keyword}</p>
            ))}
          </div>
          <div className="ml-8 md:ml-20">
            <p style={customStyle}>Date de publication:</p>
            <p>{articleData.publicationDate}</p>
          </div>
        </div>
  
        <div className="my-4" />
  
        <p style={customStyle}>Résumé:</p>
        <p>{articleData.abstract}</p>
  
        <div className="my-4" />
  
        <p style={customStyle}>Texte intégral:</p>
        <p>{articleData.fullText}</p>
  
        <div className="my-4" />
  
        <div>
          <p style={customStyle}>Références:</p>
          {articleData.references.map((reference, index) => (
            <p key={index}>{reference}</p>
          ))}
        </div>
      </div>
    );
  };

const CenteredArticleDetails = () => {
  const [isAddedToFavorites, setIsAddedToFavorites] = useState(false);

  const handleAddToFavorites = () => {
    setIsAddedToFavorites(true);
  };

  const articleData = {
    title: 'Titre de l\'article',
    authors: ['Auteur 1', 'Auteur 2'],
    institutions: ['Institution 1', 'Institution 2'],
    keywords: ['Mot-clé 1', 'Mot-clé 2'],
    publicationDate: '01/01/2024',
    abstract: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Bibendum vitae dictumst sit vitae, mi imperdiet sit. Lectus eleifend aliquaor sit ameassa urna felis porta Lorem ipsum dolor sit amet, consectetur adipiscing elit. Bibendum vitae dictumst sit vitae, mi imperdiet sit. Lectus eleifend aliquam nibh mauris, pretium. Lectus magnis lorem massa urna felis portaLorem ipsum dolor sit amet, consectetur adipiscing elit. Bibendum vitae dictumst sit vitae, mi imperdiet sit. Lectus eleifend aliquam nibh mauris, pretium. Lectus magnis lorem massa urna felis porta',
    fullText: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Bibendum vitae dictumst sit vitae, mi imperdiet sit. Lectus eleifend aliquaor sit ameassa urna felis porta Lorem ipsum dolor sit amet, consectetur adipiscing elit. Bibendum vitae dictumst sit vitae, mi imperdiet sit. Lectus eleifend aliquam nibh mauris, pretium. Lectus magnis lorem massa urna felis portaLorem ipsum dolor sit amet, consectetur adipiscing elit. Bibendum vitae dictumst sit vitae, mi imperdiet sit. Lectus eleifend aliquam nibh mauris, pretium. Lectus magnis lorem massa urna felis portaLorem ipsum dolor sit amet, consectetur adipiscing elit. Bibendum vitae dictumst sit vitae, mi imperdiet sit. Lectus eleifend aliquaor sit ameassa urna felis porta Lorem ipsum dolor sit amet, consectetur adipiscing elit. Bibendum vitae dictumst sit vitae, mi imperdiet sit. Lectus eleifend aliquam nibh mauris, pretium. Lectus magnis lorem massa urna felis portaLorem ipsum dolor sit amet, consectetur adipiscing elit. Bibendum vitae dictumst sit vitae, mi imperdiet sit. Lectus Lorem ipsum dolor sit amet, consectetur adipiscing elit. Bibendum vitae dictumst sit vitae, mi imperdiet sit. Lectus eleifend aliquaor sit ameassa urna felis porta Lorem ipsum dolor sit amet, consectetur adipiscing elit. Bibendum vitae dictumst sit vitae, mi imperdiet sit. Lectus eleifend aliquam nibh mauris, pretium. Lectus magnis lorem massa urna felis portaLorem ipsum dolor sit amet, consectetur adipiscing elit. Bibendum vitae dictumst sit vitae, mi imperdiet sit. Lectus eleifend aliquam nibh mauris, pretium. Lectus magnis lorem massa urna felis portaLorem ipsum dolor sit amet, consectetur adipiscing elit. Bibendum vitae dictumst sit vitae, mi imperdiet sit. Lectus eleifend aliquaor sit ameassa urna felis porta Lorem ipsum dolor sit amet, consectetur adipiscing elit. Bibendum vitae dictumst sit vitae, mi imperdiet sit. Lectus eleifend aliquam nibh mauris, pretium. Lectus magnis lorem massa urna felis portaLorem ipsum dolor sit amet, consectetur adipiscing elit. Bibendum vitae dictumst sit vitae, mi imperdiet sit. Lectus eleifend aliquam nibh mauris, pretium. Lectus magnis lorem massa urna felis portaeleifend aliquam nibh mauris, pretium. Lectus magnis lorem massa urna felis porta',
    references: ['Référence 1', 'Référence 2' , 'Référence 3']
  };

  return (
    <div className="flex flex-col items-start min-h-screen p-8">
      {!isAddedToFavorites ? (
        <button
          onClick={handleAddToFavorites}
          className="mb-8 ml-8 px-4 py-2 bg-white text-black rounded-full border border-gray hover:bg-gray-200 flex items-center"
        >
          <FontAwesomeIcon icon={faHeart} className="mr-2" /> Ajouter aux favoris
        </button>
      ) : (
        <p className="mb-8 ml-8 text-red-500">Ajouté aux favoris !</p>
      )}

      <div className="w-11/12 md:w-2000px h-screen md:h-2000px mx-auto bg-white border border-gray p-8 rounded-md overflow-auto">
        <ArticleDetails articleData={articleData} />
      </div>
    </div>
  );
};

export default CenteredArticleDetails;


