import { Route, Routes } from 'react-router-dom';
import useToken from './utils/useToken';
import LoginForm from './pages/Authentication/login';
import NotFound from './pages/Error/404';
import SignupForm from './pages/Authentication/signup';
import ModHome from './pages/Mod';
import ClientHome from './pages/User';
import Favoris from './pages/User/favoris';
import Affichage from './pages/User/affichage';
import AdminHome from './pages/Admin';
import NavBar from './components/Navbar/NavBar';
import Footer from './components/Footer';
import { useState } from 'react';

function App() {

  const { token, removeToken, setToken } = useToken();

  const [loading, setLoading] = useState(false);

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
        <NavBar removeToken={removeToken} loading={loading} setLoading={setLoading} />
        <div className='min-h-screen bg-[#FCFFF7]'>
          <Routes>
            <Route path="/" exact element={<ClientHome/>} />
            <Route path="/favorites" exact element={<Favoris/>} />
            <Route path="/article/:id" exact element={<Affichage/>} />
            <Route path="/mod" exact element={<ModHome/>} />
            <Route path="/admin" exact element={<AdminHome loading={loading} setLoading={setLoading} />} />
           {/* <Route path="/upload" exact element={<AdminUpload/>} /> */}
            <Route path="*" element={<NotFound/>} />
          </Routes>
        </div>
        <Footer/>
      </div>
    )
  );
}

export default App;
