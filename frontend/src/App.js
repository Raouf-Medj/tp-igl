import { Route, Routes } from 'react-router-dom';
import useToken from './utils/useToken';
import LoginForm from './pages/Authentication/login';
import NotFound from './pages/Error/404';
import SignupForm from './pages/Authentication/signup';
import ModHome from './pages/Mod';
import ClientHome from './pages/User';
import Favoris from './pages/User/favoris';
import AdminHome from './pages/Admin';
import AdminUpload from './pages/Admin/upload';
import NavBar from './components/Navbar/NavBar';
import Footer from './components/Footer';

function App() {

  const { token, removeToken, setToken } = useToken();

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
        <NavBar removeToken={removeToken} />
        <div className=' min-h-screen'>
          <Routes>
            <Route path="/" exact element={<ClientHome/>} />
            <Route path="/favorites" exact element={<Favoris/>} />
            <Route path="/mod" exact element={<ModHome/>} />
            <Route path="/admin" exact element={<AdminHome/>} />
            <Route path="/upload" exact element={<AdminUpload/>} />
            <Route path="*" element={<NotFound/>} />
          </Routes>
        </div>
        <Footer/>
      </div>
    )
  );
}

export default App;
