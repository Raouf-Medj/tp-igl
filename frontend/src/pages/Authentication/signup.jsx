import React from 'react';
import { useState } from 'react';
import axios from 'axios';
import { CgLock } from "react-icons/cg";
import { TiUserOutline } from "react-icons/ti";
import { Link, useNavigate } from 'react-router-dom';

const SignupForm = ({ setToken }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState('');

    const navigate = useNavigate();

    const handleSignup = async (e) => {
        setLoading(true);

        e.preventDefault();
    
        if (password !== confirmPassword) {
            setErr("Mots de passe non correspondants")
            setLoading(false);
        }
        else {
            // Send a request to your server for authentication
            await axios.post('http://localhost:5000/api/register', {
                username: username,
                password: password,
                role: "CLIENT"
            })
            .then(response => {
                setToken(response.data.access_token, response.data.role)
                const role = response.data.role
                if (role === 'CLIENT') {
                    navigate("/");
                }
                else if (role === 'MOD') {
                    navigate("/mod");
                }
                else if (role === 'ADMIN'){ 
                    navigate("/admin");
                }
                else {
                    console.log("impossi");
                }
            })
            .catch(error => {
                // Handle login error
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
        <div className='flex h-screen'>
            <div className='flex-1 bg-[#046865]'>
                <div className='flex flex-col w-full h-full bg-[#FCFFF7] lg:rounded-br-[8%] justify-center items-center'>
                    <img
                        src="/images/img_auth_2.png"
                        alt="img_auth_2"
                        className="lg:block hidden w-[20%] h-auto"
                    />
                    <img
                        src="/images/img_logo.png"
                        alt="logo_img"
                        className='lg:hidden block w-[60%] md:w-[40%] h-auto'
                    />
                    <h2 className='font-bold text-[120%] sm:text-[170%] mt-[3%] sm:mb-[5%] mb-[10%]'>Inscrivez-vous</h2>
                    <form onSubmit={handleSignup} className='w-full px-8 sm:px-[18%] flex flex-col'>
                        
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
                                placeholder="Entrer un nom d'utilisateur"
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
                                Mot de passe
                            </label>
                            <div className="bg-white p-2 rounded-md border border-[#E5E5E5] flex items-center w-full focus-within:border-[#21A0A0]">
                                <CgLock className='text-[#404040]' />
                                <input
                                type="password"
                                name="password"
                                id="password"
                                placeholder="Entrer un mot de passe"
                                className="outline-none px-4 flex-1"
                                value={password}
                                onChange={(e) => {
                                    setPassword(e.target.value)
                                    setErr('')
                                }}
                                />
                            </div>
                        </div>
                        <div className="mt-[5%]">
                            <label htmlFor="password_confirm" className="block pb-1">
                                Confirmation du mot de passe
                            </label>
                            <div className="bg-white p-2 rounded-md border border-[#E5E5E5] flex items-center w-full focus-within:border-[#21A0A0]">
                                <CgLock className='text-[#404040]' />
                                <input
                                type="password"
                                name="password_confirm"
                                id="password_confirm"
                                placeholder="Re-entrez votre mot de passe"
                                className="outline-none px-4 flex-1"
                                value={confirmPassword}
                                onChange={(e) => {
                                    setConfirmPassword(e.target.value)
                                    setErr('')
                                }}
                                />
                            </div>
                        </div>
                        <div className='text-red-600 mt-2 h-3'>
                            {err}
                        </div>
                        <div className='flex flex-col px-[15%] mt-[10%] sm:mt-[5%]'>
                            <button type="submit" className={`p-2  ${loading ? "bg-[#21a0a0a4]" : "bg-[#21A0A0]"}  text-white font-semibold rounded-md hover:bg-[#21a0a0a4] transition duration-300 ease-in-out transform`}>{loading ? <div className='flex justify-center items-center'>Inscription en cours...<img src="/spinner1.gif" alt="img_auth_2" className="ml-2 lg:block hidden w-[5%] h-auto"/></div> : "S'inscrire"}</button>
                        </div>
                        <div className='flex justify-center mt-[2%]'>
                            <h3 className='mr-2 font-semibold text-xs md:text-sm xl:text-base'>Vous avez déjà un compte?</h3>
                            <Link to="/login" className='font-semibold text-xs md:text-sm xl:text-base text-[#0891B2] hover:text-[#0890b2b4] transition duration-300 ease-in-out transform'>Connectez-vous</Link>
                        </div>
                    </form>
                </div>
            </div>
            <div className='flex-1 bg-[#FCFFF7] lg:block hidden'>
                <div className='flex flex-col w-full h-full bg-[#046865] rounded-tl-[8%] justify-center items-center'>
                    <img
                        src="/images/img_auth_3.png"
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
        </div>
    )
}

export default SignupForm;