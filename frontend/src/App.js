import { Route, Routes } from 'react-router-dom';
import useToken from './utils/useToken';
import LoginForm from './pages/Authentication/login';
import NotFound from './pages/Error/404';
import SignupForm from './pages/Authentication/signup';
import ModHome from './pages/Mod';
import ClientHome from './pages/User';
import Favoris from './pages/User/favoris';
import Affichage from './pages/User/affichage';
import ModModification from './pages/Mod/modifierArticle';
import AdminHome from './pages/Admin';
import NavBar from './components/Navbar/NavBar';
import Footer from './components/Footer';
import { useState } from 'react';

function App() {

  const { token, removeToken, setToken } = useToken();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isPopupOpenInfo, setIsPopupOpenInfo] = useState(false);
  const [err, setErr] = useState("");
  const [isPopupOpenError, setIsPopupOpenError] = useState(false);
  const [isPopupOpenSuccess, setIsPopupOpenSuccess] = useState(false);
  const [updateArticles, setUpdateArticles] = useState("");

  return (
    !token && token!=="" && token!==undefined ? 
      <Routes>
        <Route path="/" exact element={<LoginForm setToken={setToken}/>} />
        <Route path="/login" exact element={<LoginForm setToken={setToken}/>} />
        <Route path="/signup" exact element={<SignupForm setToken={setToken}/>} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    : (
      <div>
        <NavBar removeToken={removeToken} setLoading={setLoading} setMessage={setMessage} setIsPopupOpenInfo={setIsPopupOpenInfo} setErr={setErr} setIsPopupOpenError={setIsPopupOpenError} setIsPopupOpenSuccess={setIsPopupOpenSuccess} />
        <div className='min-h-screen bg-[#FCFFF7]'>
          <Routes>
            <Route path="/" exact element={<ClientHome err={err} setErr={setErr} isPopupOpenError={isPopupOpenError} setIsPopupOpenError={setIsPopupOpenError}/>} />
            <Route path="/favorites" exact element={<Favoris/>} />
            <Route path="/article/:id" exact element={<Affichage/>} />
            <Route path="/mod" exact element={<ModHome updateArticles={updateArticles} err={err} setErr={setErr} isPopupOpenError={isPopupOpenError} setIsPopupOpenError={setIsPopupOpenError}/>} />
            <Route path="/mod/article/:id" exact element={<ModModification setUpdateArticles={setUpdateArticles} />} />
            <Route path="/admin" exact element={<AdminHome loading={loading} setLoading={setLoading} message={message} setMessage={setMessage} isPopupOpenInfo={isPopupOpenInfo} setIsPopupOpenInfo={setIsPopupOpenInfo} isPopupOpenSuccess={isPopupOpenSuccess} setIsPopupOpenSuccess={setIsPopupOpenSuccess} err={err} setErr={setErr} isPopupOpenError={isPopupOpenError} setIsPopupOpenError={setIsPopupOpenError} />} />
            <Route path="*" element={<NotFound/>} />
          </Routes>
        </div>
        <Footer/>
      </div>
    )
  );
}

export default App;
