import React, { useState } from 'react';
import { FaSliders } from "react-icons/fa6";
import FilterElement from './Navbar/filterElement';

/**
 * Component for managing filters like keywords, authors, institutions, and dates.
 *
 * @param {Object} props - The filters props
 * @param {Array} props.keywords - List of keywords
 * @param {Array} props.authors - List of authors
 * @param {Array} props.institutions - List of institutions
 * @param {string} props.dateDeb - Start date
 * @param {string} props.dateFin - End date
 * @param {Function} props.setKeywords - Function to set keywords
 * @param {Function} props.setAuthors - Function to set authors
 * @param {Function} props.setInstitutions - Function to set institutions
 * @param {Function} props.setDateDeb - Function to set start date
 * @param {Function} props.setDateFin - Function to set end date
 * @returns {JSX.Element} Component for managing filters
 */
const Filters = ({ keywords, authors, institutions, dateDeb, dateFin, setKeywords, setAuthors, setInstitutions, setDateDeb, setDateFin }) => {
    const [keyword, setKeyword] = useState("");
    const [author, setAuthor] = useState("");
    const [institution, setInstitution] = useState("");

    const handleDeleteKeyword = (clickedElement) => {
        const updatedKeywords = keywords.filter((keyword) => keyword !== clickedElement);
        setKeywords(updatedKeywords);
    };

    const handleDeleteAuthor = (clickedElement) => {
        const updatedAuthors = authors.filter((author) => author !== clickedElement);
        setAuthors(updatedAuthors);
    };

    const handleDeleteInstitution = (clickedElement) => {
        const updatedInstitutions = institutions.filter((institution) => institution !== clickedElement);
        setInstitutions(updatedInstitutions);
    };

    const handleStartDateChange = (event) => {
        const newStartDate = event.target.value;
        setDateDeb(newStartDate);
        
        // If the end date is set and is before the new start date, reset the end date

        if (dateFin && new Date(dateFin) < new Date(newStartDate)) {
            setDateFin('');
        }
    };

    const handleEndDateChange = (event) => {
        const newEndDate = event.target.value;
        setDateFin(newEndDate);
        // If the start date is set and is after the new end date, reset the start date

        if (dateDeb && new Date(dateDeb) > new Date(newEndDate)) {
            setDateDeb('');
        }
    };

    return (
        <div className='bg-white rounded-2xl border border-[#E5E5E5] p-8 hover:drop-shadow-xl transition duration-300 ease-in-out transform'>
            <div className='flex items-center justify-between'>
                <h1 className='font-bold text-lg'>Filtrer par:</h1>
                <FaSliders className='text-lg'/>
            </div>
            <div className='my-6'>
                <div className="bg-[#21a0a009] p-2 rounded-xl border border-[#21A0A0] flex items-center w-full focus-within:border-[#21a7a7ad]">
                    <input
                        type="text"
                        name="keywords"
                        id="keywords"
                        placeholder="Mots clés"
                        className="bg-[#21a0a000] outline-none px-4 flex-1 placeholder-[#046865ac] font-medium text-[#046865]"
                        value={keyword}
                        onChange={(e) => {
                            setKeyword(e.target.value);
                        }}
                        onKeyDown={(event) => {
                            if (event.key === 'Enter') {
                                if (!keywords.includes(event.target.value)) {
                                    const updatedKeywords = [...keywords, event.target.value];
                                    setKeywords(updatedKeywords);
                                }
                                setKeyword("");
                            }
                        }}
                    />
                </div>
                { keywords && (
                    <div className='flex flex-wrap lg:max-w-[250px]'>
                        {keywords.map((keyword, index) => (
                            <FilterElement key={index} content={keyword} onClick={() => {handleDeleteKeyword(keyword)}} />
                        ))}
                    </div>
                )}
            </div>

            <div className="bg-[#21a0a009] p-2 rounded-xl border border-[#21A0A0] flex items-center w-full focus-within:border-[#21a7a7ad]">
                <input
                    type="text"
                    name="author"
                    id="author"
                    placeholder="Auteur"
                    className="bg-[#21a0a000] outline-none px-4 flex-1 placeholder-[#046865] placeholder-opacity-70 font-medium text-[#046865]"
                    value={author}
                    onChange={(e) => {
                        setAuthor(e.target.value);
                    
                    }}
                    onKeyDown={(event) => {
                        if (event.key === 'Enter') {
                            if (!authors.includes(event.target.value)) {
                                const updatedAuthors = [...authors, event.target.value];
                                setAuthors(updatedAuthors);
                            }
                            setAuthor("");
                        }
                    }}
                />
            </div>
            { authors && (
                <div className='flex flex-wrap lg:max-w-[250px]'>
                    {authors.map((author, index) => (
                        <FilterElement key={index} content={author} onClick={() => {handleDeleteAuthor(author)}} />
                    ))}
                </div>
            )}

            <div className='my-6'>
                <div className="bg-[#21a0a009] p-2 rounded-xl border border-[#21A0A0] flex items-center w-full focus-within:border-[#21a7a7ad]">
                    <input
                        type="text"
                        name="institution"
                        id="institution"
                        placeholder="Institution"
                        className="bg-[#21a0a000] outline-none px-4 flex-1 placeholder-[#046865] placeholder-opacity-70 font-medium text-[#046865]"
                        value={institution}
                        onChange={(e) => {
                            setInstitution(e.target.value);
                        }}
                        onKeyDown={(event) => {
                            if (event.key === 'Enter') {
                                if (!institutions.includes(event.target.value)) {
                                    const updatedInstitutions = [...institutions, event.target.value];
                                    setInstitutions(updatedInstitutions);
                                }
                                setInstitution("");
                            }
                        }}
                    />
                </div>
                { institutions && (
                    <div className='flex flex-wrap lg:max-w-[250px]'>
                        {institutions.map((institution, index) => (
                            <FilterElement key={index} content={institution} onClick={() => {handleDeleteInstitution(institution)}} />
                        ))}
                    </div>
                )}
            </div>
            <div className='mb-4'>
                <h1 className='mb-4 text-[#046865] font-semibold'>Publié entre:</h1>
                <label htmlFor='date_debut' className='text-[#046865] font-semibold text-sm'>Date début</label>
                <div className="mb-4 bg-[#21a0a009] p-2 rounded-xl border border-[#21A0A0] flex items-center w-full focus-within:border-[#21a7a7ad]">
                    <input
                        type="date"
                        name="date_debut"
                        id="date_debut"
                        className={`bg-[#21a0a000] outline-none px-4 flex-1 font-medium ${dateDeb ? "text-[#046865]" : "text-[#046865b1]"} `}
                        value={dateDeb}
                        onChange={handleStartDateChange}
                    />
                </div>

                <label htmlFor='date_fin' className='text-[#046865] font-semibold text-sm'>Date fin</label>
                <div className="bg-[#21a0a009] p-2 rounded-xl border border-[#21A0A0] flex items-center w-full focus-within:border-[#21a7a7ad]">
                    <input
                        type="date"
                        name="date_fin"
                        id="date_fin"
                        className={`bg-[#21a0a000] outline-none px-4 flex-1 font-medium ${dateFin ? "text-[#046865]" : "text-[#046865b1]"} `}
                        value={dateFin}
                        onChange={handleEndDateChange}
                    />
                </div>
            </div>
            <div className='flex flex-col mt-10 items-center justify-center'>
                <button onClick={() => {
                    setKeywords([]);
                    setAuthors([]);
                    setInstitutions([]);
                    setDateDeb("");
                    setDateFin("");
                }} className='bg-[#545454] w-full font-semibold hover:bg-[#4c4c4cda] hover:drop-shadow-md text-white p-3 rounded-xl transition duration-300 ease-in-out transform'>Tout effacer</button>
            </div>
        </div>
    )
}

export default Filters;