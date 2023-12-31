import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { CgLock } from "react-icons/cg";
import { TiUserOutline } from "react-icons/ti";

const EditMod = ({ handleClosePopup, id }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPass, setConfirmPass] = useState('');
    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState('');

    useEffect(() => {
        const fetchMod = async () => {
            console.log(id);
            await axios.get(`http://localhost:5000/api/mods/${id}`)
            .then(response => {
                setUsername(response.data.username);
            })
            .catch(error => {
                if (error.response && error.response.data) {
                    setErr(error.response.data.error);
                } else {
                    setErr('Une erreur est survenue');
                }
            });
        }

        fetchMod();
    }, [id]);

    const handleUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);
    
        if (password !== confirmPass) {
            setErr("Mots de passe non correspondants")
            setLoading(false);
        }
        else {
            await axios.put('http://localhost:5000/api/mods', {
                id: id,
                username: username,
                password: password
            })
            .then((response) => {
                window.location.reload();
                handleClosePopup();
            })
            .catch(error => {
                if (error.response && error.response.data) {
                  setErr(error.response.data.error);
                } else {
                  setErr('Une erreur est survenue');
                }
            }).finally(() => {
                setLoading(false);
            });
        }
    };



    return (
        <div className=' container-fluid d-flex justify-content-center align-items-center h-100'>
        <div className='row'>
            <div className='col-lg-6 col-md-8 col-sm-10 col-12'>
                <div className='bg-[#FCFFF7] rounded-tl-[8%] p-4'>
                    <h2 className='font-bold text-2xl mt-4 mb-5 flex justify-center'>Modifier modérateur</h2>
                    <form onSubmit={handleUpdate} className='w-full'>
                        <div className="">
                            <label htmlFor="username" className="block pb-1">
                                Le pseudo :
                            </label>
                            <div className="bg-white p-2 rounded-md border border-[#E5E5E5] flex items-center w-full focus-within:border-[#21A0A0]">
                                <TiUserOutline className='text-[#404040] text-xl' />
                                <input
                                type="text"
                                name="username"
                                id="username"
                                placeholder="Changer le pseudo"
                                className="outline-none px-3 flex-1"
                                value={username}
                                onChange={(e) => {
                                    setUsername(e.target.value)
                                    setErr('')
                                }}
                                />
                            </div>
                        </div>
                        <div className="mt-[5%]">
                            <label htmlFor="password" className="block pb-1">
                               Le mot de passe : 
                            </label>
                            <div className="bg-white p-2 rounded-md border border-[#E5E5E5] flex items-center w-full focus-within:border-[#21A0A0]">
                                <CgLock className='text-[#404040]' />
                                <input
                                type="password"
                                name="password"
                                id="password"
                                placeholder="Changer le mot de passe"
                                className="outline-none px-4 flex-1"
                                value={password}
                                onChange={(e) => {
                                    setPassword(e.target.value)
                                    setErr('')
                                }}
                                />
                            </div>
                        </div>

                        <div className="mt-5">
                            <label htmlFor="confirmPassword" className="block pb-1">
                                Confirmation du mot de passe :
                            </label>
                            <div className="bg-white p-2 rounded-md border border-[#E5E5E5] flex items-center w-full focus-within:border-[#21A0A0]">
                                <CgLock className='text-[#404040]' />
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    id="confirmPassword"
                                    placeholder="Confirmer le mot de passe"
                                    className="outline-none px-4 flex-1"
                                    value={confirmPass}
                                    onChange={(e) => {
                                        setConfirmPass(e.target.value)
                                        setErr('')
                                    }}
                                />
                            </div>
                        </div>

                        <div className='text-red-600 mt-2 h-3'>
                            {err}
                        </div>
                        <div className='flex px-[15%] mt-[20%] sm:mt-[10%] w-full'>
                            <button onClick={handleClosePopup} className={`p-2 w-[45%] mr-[10%] ${loading ? "bg-[#21a0a0a4]" : "bg-[#21A0A0]"}  text-white font-semibold rounded-md hover:bg-[#21a0a0a4] transition duration-300 ease-in-out transform`}>Annuler</button>
                            <button type="submit" className={`p-2 w-[45%] ${loading ? "bg-[#21a0a0a4]" : "bg-[#21A0A0]"}  text-white font-semibold rounded-md hover:bg-[#21a0a0a4] transition duration-300 ease-in-out transform`}>{loading ? <div className='flex justify-center items-center'><img src="/spinner1.gif" alt="img_auth_2" className="ml-2 lg:block hidden w-[10%] h-auto"/></div> : "Confirmer"}</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
    );
};

export default EditMod;