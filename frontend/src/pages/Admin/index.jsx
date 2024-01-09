import React, { useEffect, useState } from 'react';
import { FaUser, FaPlus } from 'react-icons/fa';
import { TbEdit } from "react-icons/tb";
import { FiTrash2 } from "react-icons/fi"
import SearchBar from '../../components/search';
import AjouterMod from '../../components/popupajout';
import EditMod from '../../components/popupEdit';
import ProtectedComponent from '../../components/protected';
import axios from 'axios';

const AdminHome = ({ loading }) => {
    const [query, setQuery] = useState('');
    const [allMods, setAllMods] = useState([]);
    const [moderators, setModerators] = useState([]);
    // const [err, setErr] = useState("");
    const [loading2, setLoading2] = useState(false);
    const [loading3, setLoading3] = useState(false);

    useEffect(() => {
        const fetchMods = async () => {
            setLoading2(true);
            await axios.get('http://localhost:5000/api/mods')
            .then(response => {
                setAllMods(response.data.mods);
                setModerators(response.data.mods);
            })
            .catch(error => {
                if (error.response && error.response.data) {
                    // setErr(error.response.data.error);
                } else {
                    // setErr('Une erreur est survenue');
                }
            })
            .finally(() => {
                setLoading2(false);
            })
        }

        fetchMods();
    }, []);

    const [showAddPopup, setShowAddPopup] = useState(false);
    const [selectedModerator, setSelectedModerator] = useState(null);
    const [hoveredModerator, setHoveredModerator] = useState(null);

    const handleEdit = (id) => {
        setSelectedModerator(id);
    };

    const confirmDeletion = (id, username) => {
        const confirmation = window.confirm(`Confirmez-vous la suppression du modérateur: ${username}?`);
        if (confirmation) {
            handleDelete(id);
        }
        else {
            console.log("Suppression annulée");
        }
    }

    const handleDelete = async (id) => {
        setLoading3(true);
        await axios.delete("http://localhost:5000/api/mods/"+id)
        .then(response => {
            setModerators(prevModerators => prevModerators.filter(moderator => moderator.id !== response.data.id));
        })
        .catch(error => {
            if (error.response && error.response.data) {
                // setErr(error.response.data.error);
            } else {
                // setErr('Une erreur est survenue');
            }
        })
        .finally(() => {
            setLoading3(false);
        });
    };

    const handleAdd = () => {
        setShowAddPopup(true);
    };

    const handleClosePopup = () => {
        setShowAddPopup(false);
        setSelectedModerator(null);
    };

    const searchHandler = () => {
        const filteredMods = allMods.filter(mod => mod.username.toLowerCase().includes(query.toLowerCase()));
        setModerators(filteredMods);
    };

    return (
        <ProtectedComponent role="ADMIN">
            <LoadingOverlay isLoading={loading} waitMessage="Upload en cours, veuillez patienter..."/>
            <div className='px-4 sm:px-8 md:px-12 lg:px-[5%] xl:px-[10%] pt-8 sm:pt-12 lg:pt-16 pb-6 sm:pb-10 lg:pb-16'>
                <SearchBar query={query} setQuery={setQuery} placeholder="Rechercher par pseudo..." searchHandler={searchHandler} isForMod />
                <div className='mt-6 sm:mt-10 lg:mt-16'>
                    <h1 className='font-bold text-xl md:text-2xl lg:text-3xl xl:text-4xl mb-3 sm:mb-5'>Modérateurs ({moderators.length})</h1>
                    {loading2 ? (
                        <div className='flex justify-center items-center'><img src="/spinner2.gif" alt="img_auth_2" className="ml-2 lg:block hidden w-[5%] h-auto"/></div>
                    ) : (
                        <div className="flex flex-wrap">
                            {moderators.map((moderator) => (
                                <div key={moderator.id} onMouseEnter={() => setHoveredModerator(moderator.id)} onMouseLeave={() => setHoveredModerator(null)}>
                                    <div
                                        key={moderator.id}
                                        className="mr-2 mb-2 sm:mr-4 sm:mb-4 p-3 sm:p-4 md:p-5 lg:p-6 bg-white border border-gray-300 rounded-md relative flex items-center justify-center w-36 sm:w-44 md:w-52 lg:w-60 h-36 sm:h-44 md:h-52 lg:h-60 hover:drop-shadow-xl transition duration-300 ease-in-out transform"
                                    >
                                        <div className={`flex flex-col items-center transition duration-300 ease-in-out transform ${
                                            (hoveredModerator === moderator.id || loading3)
                                            ? 'filter blur-md'
                                            : ''
                                        }`}>
                                            <FaUser size={80} className="mb-2 text-gray-700 hover:drop-shadow-lg" />
                                            <p className='text-sm sm:text-base text-gray-700'>{moderator.username}</p>
                                        </div>
                                    </div>
                                    {(hoveredModerator === moderator.id) && (
                                        <div className="relative -top-[50%] right-[2%] p-2 rounded-bl-lg opacity-100 transition-opacity flex items-center justify-center">
                                            { loading3 ? (
                                                <div className='w-full flex items-center justify-center flex-col'>
                                                    <img src="/spinner2.gif" alt="spinner" className=" w-[25%] h-auto"/>
                                                </div>
                                            ) : (
                                                <div className='flex justify-center items-center'>
                                                    <div className="hover:drop-shadow-sm cursor-pointer" onClick={() => handleEdit(moderator.id)}>
                                                        <TbEdit className='mr-2 bg-[#E0B545] hover:bg-[#e0b445e3] text-[#695b27] p-2 rounded-md' size={50} />
                                                    </div>
                                                    <div className="hover:drop-shadow-sm cursor-pointer" onClick={() => confirmDeletion(moderator.id, moderator.username)}>
                                                        <FiTrash2 size={50} className='bg-[#FB5353] hover:bg-[#fb5353de] text-[#6c2c2a] p-2 rounded-md'/>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            ))}
                            <div className="p-3 sm:p-4 md:p-5 lg:p-6 bg-white border border-gray-300 rounded-md relative flex items-center justify-center w-36 sm:w-44 md:w-52 lg:w-60 h-36 sm:h-44 md:h-52 lg:h-60 cursor-pointer hover:drop-shadow-xl transition duration-300 ease-in-out transform" onClick={handleAdd}>
                                <div className="flex flex-col items-center">
                                    <FaPlus size={80} className="mb-2  text-gray-700 hover:drop-shadow-lg" />
                                    <p className='text-sm sm:text-base  text-gray-700'>Ajouter</p>
                                </div>
                            </div>
                            {selectedModerator && (
                                <div className="fixed top-0 left-0 z-50 w-full h-full backdrop-blur-md bg-gray-800 bg-opacity-50 flex items-center justify-center">
                                    <div className="bg-[#FCFFF7] w-[90%] sm:w-[60%] lg:w-[40%] p-3 lg:px-10 rounded-xl border border-gray-400">
                                        <EditMod id={selectedModerator} mods={moderators} setMods={setModerators} allMods={allMods} setAllMods={setAllMods} handleClosePopup={handleClosePopup} />
                                    </div>
                                </div>
                            )}

                            {showAddPopup && (
                                <div className="fixed top-0 z-50 left-0 w-full h-full backdrop-blur-md bg-gray-800 bg-opacity-50 flex items-center justify-center">
                                    <div className="bg-[#FCFFF7] w-[90%] sm:w-[60%] lg:w-[40%] p-3 lg:px-10 rounded-xl border border-gray-400"> 
                                        <AjouterMod mods={moderators} setMods={setModerators} allMods={allMods} setAllMods={setAllMods} handleClosePopup={handleClosePopup} />
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </ProtectedComponent>
    );
};

const LoadingOverlay = ({ isLoading, waitMessage }) => {
    return (
      <div
        className={`fixed top-0 left-0 z-50 w-full h-full flex items-center justify-center backdrop-blur-md bg-gray-800 bg-opacity-50 transition-opacity ${
          isLoading ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className='bg-[#FCFFF7] px-3 py-8 flex items-center justify-center text-[#137575] font-bold text-xl rounded-xl'>
            <img src="/spinner2.gif" alt="spinner" className="mr-2 lg:block hidden w-[8%] h-auto"/>
            {waitMessage}
        </div>
      </div>
    );
};

export default AdminHome;










