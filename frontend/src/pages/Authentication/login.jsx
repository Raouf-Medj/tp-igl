import React from 'react';
import { useState } from 'react';
import axios from 'axios';
import { CgLock } from "react-icons/cg";
import { TiUserOutline } from "react-icons/ti";
import { Link } from 'react-router-dom';

const LoginForm = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
    
        try {
          // Send a request to your server for authentication
          const response = await axios.post('/api/login', {
            username,
            password,
          });
    
          // Handle successful login (e.g., store token in local storage)
          console.log('Login successful:', response.data);
        } catch (error) {
          // Handle login error
          console.error('Login failed:', error.response.data);
        }
    };

    return (
        <div className='flex h-screen'>
            <div className='flex-1 bg-[#FCFFF7]'>
                <div className='flex flex-col w-full h-full bg-[#046865] rounded-br-[8%] justify-center items-center'>
                    <img
                        src="/images/img_auth_1.png"
                        alt="Auth_img_1"
                        className="w-[70%] h-auto"
                    />
                    <img
                        src="/images/img_logo_inverted.png"
                        alt="Logo_inverted"
                        className="w-[40%] h-auto mt-[17%]"
                    />
                </div>
            </div>
            <div className='flex-1 bg-[#046865]'>
                <div className='flex flex-col w-full h-full bg-[#FCFFF7] rounded-tl-[8%] justify-center items-center'>
                    <img
                        src="/images/img_auth_2.png"
                        alt="img_auth_2"
                        className="w-[20%] h-auto"
                    />
                    <h2 className='font-bold text-[170%] mt-[3%] mb-[5%]'>Connectez-vous</h2>
                    <form onSubmit={handleLogin} className='w-full px-[18%] flex flex-col'>
                        
                        <div className="">
                            <label htmlFor="username" className="block pb-1">
                                Nom d'utilisateur
                            </label>
                            <div className="bg-white p-2 rounded-md border border-[#E5E5E5] flex items-center w-full focus-within:border-[#21A0A0]">
                                <TiUserOutline className='text-[#404040] text-xl' />
                                <input
                                type="text"
                                name="username"
                                id="username"
                                placeholder="Entrer votre nom d'utilisateur"
                                className="outline-none px-3 flex-1"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="mt-[5%]">
                            <label htmlFor="password" className="block pb-1">
                                Mot de passe
                            </label>
                            <div className="bg-white p-2 rounded-md border border-[#E5E5E5] flex items-center w-full focus-within:border-[#21A0A0]">
                                <CgLock className='text-[#404040]' />
                                <input
                                type="password"
                                name="password"
                                id="password"
                                placeholder="Entrer votre mot de passe"
                                className="outline-none px-4 flex-1"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className='flex flex-col px-[15%] mt-[7%]'>
                            <button type="submit" className='p-2 bg-[#21A0A0] text-white rounded-md hover:bg-[#21a0a0a4]'>Se connecter</button>
                        </div>
                        <div className='flex justify-center mt-[2%]'>
                            <h3 className='mr-2 font-semibold'>Vous n'avez pas de compte?</h3>
                            <Link to="/signup" className='font-semibold text-[#0891B2] hover:text-[#0890b2b4]'>Inscrivez-vous</Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default LoginForm;