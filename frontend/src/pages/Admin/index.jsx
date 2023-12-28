import React, { useState } from 'react';
import { FaUser, FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import SearchBarMod from '../../components/searchMod';
import AjouterMod from '../../components/popupajout';
import EditMod from '../../components/popupEdit';
// import ProtectedComponent from '../../components/protected';

const AdminHome = () => {
    const [nbMod, setNbMod] = useState(5);
    const [query, setQuery] = useState('');
    const [moderators, setModerators] = useState([
        { id: 1, name: 'Moderateur1' },
        { id: 2, name: 'Moderateur2' },
        { id: 3, name: 'Moderateur3' },
        // ... Autres modérateurs
    ]);

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
        setQuery('');
    };

    return (
        // <ProtectedComponent role="ADMIN">
        <div className='px-4 sm:px-8 md:px-12 lg:px-20 xl:px-32 pt-8 sm:pt-12 lg:pt-16 pb-6 sm:pb-10 lg:pb-16'>
            <SearchBarMod query={query} setQuery={setQuery} placeholder="Rechercher un modérateur" searchHandler={searchHandler} />
            <div className='mt-6 sm:mt-8 lg:mt-10'>
                <h1 className='font-bold text-xl md:text-2xl lg:text-3xl xl:text-4xl mb-3'>Modérateurs : ({moderators.length})</h1>
                <div className="flex flex-wrap ">
                    {moderators.map((moderator) => (
                        <div
                            key={moderator.id}
                            className="m-2 sm:m-4 p-3 sm:p-4 md:p-5 lg:p-6 bg-white border border-gray-300 rounded-md relative flex items-center justify-center w-36 sm:w-44 md:w-52 lg:w-60 h-36 sm:h-44 md:h-52 lg:h-60"
                            onMouseEnter={() => setHoveredModerator(moderator.id)}
                            onMouseLeave={() => setHoveredModerator(null)}
                        >
                            <div className="flex flex-col items-center">
                                <FaUser size={80} className="mb-2 text-gray-700" />
                                <p className='text-sm sm:text-base text-gray-700'>{moderator.name}</p>
                                {hoveredModerator === moderator.id && (
                                    <div className="absolute top-0 right-0 p-2 bg-white rounded-bl-lg opacity-100 transition-opacity flex items-end flex-col">
                                        <div className="cursor-pointer text-gray-700 mb-1" onClick={() => handleEdit(moderator.id)}>
                                            <FaEdit size={22} />
                                        </div>
                                        <div className="cursor-pointer text-red-700" onClick={() => handleDelete(moderator.id)}>
                                            <FaTrash size={22} />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                    <div className="m-2 sm:m-4 p-3 sm:p-4 md:p-5 lg:p-6 bg-white border border-gray-300 rounded-md relative flex items-center justify-center w-36 sm:w-44 md:w-52 lg:w-60 h-36 sm:h-44 md:h-52 lg:h-60 cursor-pointer" onClick={handleAdd}>
                        <div className="flex flex-col items-center">
                            <FaPlus size={80} className="mb-2  text-gray-700" />
                            <p className='text-sm sm:text-base  text-gray-700'>Ajouter</p>
                        </div>
                    </div>
                    {selectedModerator && (
    <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center">
        <div className="bg-white w-80 sm:w-96 p-3 rounded-md">
            <EditMod />
            <button onClick={handleClosePopup}>Quitter</button>
        </div>
    </div>
)}

{showAddPopup && (
    <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center">
        <div className="bg-white w-80 sm:w-96 p-3 rounded-md">
            <AjouterMod />
            <button onClick={handleClosePopup}>Quitter</button>
        </div>
    </div>
)}

                </div>
            </div>
        </div>
        // </ProtectedComponent>
    );
};

export default AdminHome;










