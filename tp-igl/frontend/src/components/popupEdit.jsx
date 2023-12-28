import React, { useState } from 'react';
import { CgLock } from "react-icons/cg";
import { TiUserOutline } from "react-icons/ti";
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; 

const EditMod = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErr(''); 

        try {
   
            const response = await axios.post('URL_DE_VOTRE_API', { username, password });
            
     
            console.log(response.data); 
            navigate('/nouvelle_page'); 
        } catch (error) {
            setLoading(false);
            if (error.response) {
      
                setErr(error.response.data.message);
            } else if (error.request) {
          
                setErr('Erreur de connexion. Veuillez réessayer.'); 
            } else {
              
                setErr('Une erreur s\'est produite. Veuillez réessayer plus tard.'); 
            }
        }
    };

    return (
        <div className='container-fluid d-flex justify-content-center align-items-center h-100'>
        <div className='row'>
            <div className='col-lg-6 col-md-8 col-sm-10 col-12'>
                <div className='bg-[#FCFFF7] rounded-tl-[8%] p-4'>
                    <h2 className='font-bold text-2xl mt-4 mb-5'>Modifier le modérateur :</h2>
                    <form onSubmit={handleLogin} className='w-full'>

      
                        
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

                            <div className='text-red-600 mt-2 h-3'>
                                {err}
                            </div>
                            <div className='flex flex-col px-[15%] mt-[5%]'>
                                <button type="submit" className={`p-2  ${loading ? "bg-[#21a0a0a4]" : "bg-[#21A0A0]"}  text-white font-semibold rounded-md hover:bg-[#21a0a0a4] transition duration-300 ease-in-out transform`}>{loading ? "Connexion en cours..." : "Confirmer"}</button>
                            </div>
                        </form>

                        <div className='flex justify-center items-center mt-7'>
                            <img
                                src="/images/img_logo.png"
                                alt="Logo"
                                className="w-[50%] md:w-[40%] h-auto mx-auto"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditMod;