import ProtectedComponent from '../../components/protected';
import React, { useState, useEffect } from 'react';
import EditableField from '../../components/editableField';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const ModModification = () => {

  const { id } = useParams();

  const navigate = useNavigate();

  const [articleTitle, setArticleTitle] = useState('');
  const [authors, setAuthors] = useState([]);
  const [institutions, setInstitutions] = useState([]);
  const [keywords, setKeywords] = useState([]);
  const [publicationDate, setPublicationDate] = useState('');
  const [references, setReferences] = useState([]);
  const [summary, setSummary] = useState('');
  const [fullText, setFullText] = useState('');
  const [loading, setLoading] = useState(false);
  const [url, setUrl] = useState("");

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
        setPublicationDate(article.publication_date);
        setReferences(article.references);
        setSummary(article.abstract);
        setFullText(article.text);
        setUrl(article.url);
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

  const handleValidation = async () => {
    
    setLoading(true);
    await axios.put("http://localhost:5000/api/articles", {
      id: id,
      title: articleTitle,
      abstract: summary,
      authors: authors,
      institutions: institutions,
      keywords: keywords,
      publication_date: publicationDate,
      references: references,
      text: fullText,
      url: url,
      validated: true
    })
    .then(() => {
      navigate("/mod");
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

  const handleSupprimer = async () => {
    setLoading(true);
    await axios.delete(`http://localhost:5000/api/articles/${id}`)
    .then(() => {})
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

    await axios.delete(`http://localhost:5000/api/uploads/${url}`)
    .then(() => {
      navigate("/mod");
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

  return (
  <ProtectedComponent role="MOD">
    <div className="container mx-auto py-10 px-4 overflow-y-auto min-h-screen">
      { loading ? (
        <div className='w-full flex items-center justify-center flex-col mt-10'>
          <img src="/spinner2.gif" alt="spinner" className=" w-[5%] h-auto"/>
        </div>
      ) : (
        <div className="w-full max-w-7xl mx-auto">
          <div className="flex w-full flex-col justify-between items-center mb-5">
            <div className='w-full mb-10'>
              <Link to="/mod" className="font-semibold mb-2 sm:mb-0 mr-2 bg-[#cdcdcd] hover:bg-[#cdcdcde4] py-2 px-4 rounded transition duration-300 ease-in-out transform">
                Annuler
              </Link>
              <button className="font-semibold mb-2 sm:mb-0 mr-2 bg-[#f84040] hover:bg-[#f84040e4] text-white py-2 px-4 rounded transition duration-300 ease-in-out transform" onClick={handleSupprimer}>
                Supprimer
              </button>
              <button className="font-semibold bg-[#108f8b] hover:bg-[#108f8bdf] text-white py-2 px-4 rounded transition duration-300 ease-in-out transform" onClick={handleValidation}>
                Valider
              </button>
            </div>
            <div className="mb-4 w-full sm:mb-0">
              <h1 className="text-2xl font-bold"><span className=' underline'>Article à rectifier :</span> {articleTitle}</h1>
            </div>
          </div>
          <div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <EditableField label="Titre" value={articleTitle} onChange={setArticleTitle} />
                <EditableField label="Auteurs" value={authors} onChange={setAuthors} />
                <EditableField label="Institutions" value={institutions} onChange={setInstitutions} />
              </div>

              <div>
                <EditableField label="Mots clés" value={keywords} onChange={setKeywords} />
                <EditableField label="Date de publication" value={publicationDate} onChange={setPublicationDate} isDateField />
                <EditableField label="Références" value={references} onChange={setReferences} />
              </div>
            </div>

            <EditableField className="w-full sm:w-3/5" label="Résumé de l'article" value={summary} onChange={setSummary} isParagraph />
            <EditableField label="Texte intégral" value={fullText} onChange={setFullText} isParagraph />
          </div>
        </div>
      )}
    </div>
  </ProtectedComponent>
  );
}

export default ModModification;
