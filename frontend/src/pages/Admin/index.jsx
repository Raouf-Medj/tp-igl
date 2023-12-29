import React, { useState } from 'react';
import { FaUser, FaEdit, FaPlus, FaTrashAlt } from 'react-icons/fa';
import SearchBar from '../../components/search';
import AjouterMod from '../../components/popupajout';
import EditMod from '../../components/popupEdit';
import ProtectedComponent from '../../components/protected';

const AdminHome = () => {
    const [query, setQuery] = useState('');
    const [allMods, setAllMods] = useState([
        { id: 1, username: 'Moderateur1' },
        { id: 2, username: 'Moderateur2' },
        { id: 3, username: 'Moderateur3' },
        // ... Autres modérateurs
    ]);
    const [moderators, setModerators] = useState(allMods);


    const [showAddPopup, setShowAddPopup] = useState(false);
    const [selectedModerator, setSelectedModerator] = useState(null);
    const [hoveredModerator, setHoveredModerator] = useState(null);

    const handleEdit = (id) => {
        setSelectedModerator(id);
    };

    const handleDelete = (id) => {
        setModerators(prevModerators => prevModerators.filter(moderator => moderator.id !== id));
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
            <div className='px-4 sm:px-8 md:px-12 lg:px-[5%] xl:px-[10%] pt-8 sm:pt-12 lg:pt-16 pb-6 sm:pb-10 lg:pb-16'>
                <SearchBar query={query} setQuery={setQuery} placeholder="Rechercher par pseudo..." searchHandler={searchHandler} isForMod />
                <div className='mt-6 sm:mt-10 lg:mt-16'>
                    <h1 className='font-bold text-xl md:text-2xl lg:text-3xl xl:text-4xl mb-3 sm:mb-5'>Modérateurs ({moderators.length})</h1>
                    <div className="flex flex-wrap">
                        {moderators.map((moderator) => (
                            <div
                                key={moderator.id}
                                className="mr-2 mb-2 sm:mr-4 sm:mb-4 p-3 sm:p-4 md:p-5 lg:p-6 bg-white border border-gray-300 rounded-md relative flex items-center justify-center w-36 sm:w-44 md:w-52 lg:w-60 h-36 sm:h-44 md:h-52 lg:h-60"
                                onMouseEnter={() => setHoveredModerator(moderator.id)}
                                onMouseLeave={() => setHoveredModerator(null)}
                            >
                                <div className="flex flex-col items-center">
                                    <FaUser size={80} className="mb-2 text-gray-700 hover:drop-shadow-lg" />
                                    <p className='text-sm sm:text-base text-gray-700'>{moderator.username}</p>
                                    {hoveredModerator === moderator.id && (
                                        <div className="absolute top-0 right-0 p-2 bg-white rounded-bl-lg opacity-100 transition-opacity flex items-end">
                                            <div className='flex justify-center items-center'>
                                                <div className="hover:drop-shadow-sm cursor-pointer text-orange-500 mb-1" onClick={() => handleEdit(moderator.id)}>
                                                    <FaEdit className='mr-2' size={30} />
                                                </div>
                                                <div className=" hover:drop-shadow-sm cursor-pointer text-red-600" onClick={() => handleDelete(moderator.id)}>
                                                    <FaTrashAlt size={25} />
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                        <div className="p-3 sm:p-4 md:p-5 lg:p-6 bg-white border border-gray-300 rounded-md relative flex items-center justify-center w-36 sm:w-44 md:w-52 lg:w-60 h-36 sm:h-44 md:h-52 lg:h-60 cursor-pointer" onClick={handleAdd}>
                            <div className="flex flex-col items-center">
                                <FaPlus size={80} className="mb-2  text-gray-700 hover:drop-shadow-lg" />
                                <p className='text-sm sm:text-base  text-gray-700'>Ajouter</p>
                            </div>
                        </div>
                        {selectedModerator && (
                            <div className="fixed top-0 left-0 w-full h-full backdrop-blur-md bg-gray-700 bg-opacity-50 flex items-center justify-center">
                                <div className="bg-[#FCFFF7] w-80 lg:w-[30%] p-3 lg:px-10 rounded-xl border border-gray-400">
                                    <EditMod handleClosePopup={handleClosePopup} />
                                </div>
                            </div>
                        )}

                        {showAddPopup && (
                            <div className="fixed top-0 left-0 w-full h-full backdrop-blur-md bg-gray-700 bg-opacity-50 flex items-center justify-center">
                                <div className="bg-[#FCFFF7] w-80 lg:w-[30%] p-3 lg:px-10 rounded-xl border border-gray-400"> 
                                    <AjouterMod handleClosePopup={handleClosePopup} />
                                </div>
                            </div>
                        )}

                    </div>
                </div>
            </div>
        </ProtectedComponent>
    );
};

export default AdminHome;










