import ProtectedComponent from '../../components/protected';
import React, { useState, useEffect } from 'react';
import EditableField from '../../components/editableField';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const ModModification = () => {

  const { id } = useParams();

  const [articleTitle, setArticleTitle] = useState('');
  const [authors, setAuthors] = useState([]);
  const [institutions, setInstitutions] = useState([]);
  const [keywords, setKeywords] = useState([]);
  const [publicationDate, setPublicationDate] = useState('');
  const [references, setReferences] = useState([]);
  const [summary, setSummary] = useState('');
  const [fullText, setFullText] = useState('');
  const [loading, setLoading] = useEffect(false);

  useEffect(() => {
    const fetchArticle = async () => {
      setLoading(true);
      await axios.get(`http://localhost:5000/api/articles/${id}`)
      .then(response => {
        const article = response.data;
        setArticleTitle(article.title);
        setAuthors(article.authors);
        setInstitutions(article.institutions);
        setKeywords(article.keywords);
        setPublicationDate(article.publicationDate);
        setReferences(article.references);
        setSummary(article.abstract);
        setFullText(article.text);
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

    fetchArticle();
  }, []);

  const handleValidation = () => {
    // update article infos
  };

  const handleAnnuler = () => {
    // Cancel modifications
  };

  const handleSupprimer = () => {
    // Delete article ?
  };

  return (
  <ProtectedComponent role="MOD">
    <div className="container mx-auto mt-8 px-4 overflow-y-auto min-h-screen">
      <div className="w-full max-w-7xl mx-auto">

        <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
          <div className="mb-4 sm:mb-0">
            <h1 className="text-2xl font-bold">Article à rectifier : {articleTitle}</h1>
          </div>
          <div>
            <button className="mb-2 sm:mb-0 mr-2 bg-gray-300 hover:bg-gray-400 py-2 px-4 rounded" onClick={handleAnnuler}>
              Annuler
            </button>
            <button className="mb-2 sm:mb-0 mr-2 bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded" onClick={handleSupprimer}>
              Supprimer
            </button>
            <button className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded" onClick={handleValidation}>
              Valider
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <EditableField label="Titre" value={articleTitle} onChange={setArticleTitle} />
            <EditableField label="Auteurs" value={authors} onChange={setAuthors} multiline />
            <EditableField label="Institutions" value={institutions} onChange={setInstitutions} multiline />
          </div>

          <div>
            <EditableField label="Mots clés" value={keywords} onChange={setKeywords} multiline />
            <EditableField label="Date de publication" value={publicationDate} onChange={(date) => setPublicationDate(date)} isDateField />
            <EditableField label="Références" value={references} onChange={setReferences} multiline />
          </div>
        </div>

        <EditableField className="w-full sm:w-3/5" label="Résumé de l'article" value={summary} onChange={setSummary}  />
        <EditableField label="Texte intégral" value={fullText} onChange={setFullText} />

      </div>
    </div>
  </ProtectedComponent>
  );
}

export default ModModification;
