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
import ModifierArticle from './pages/Mod/modifierArticle';

function App() {
  const authorsArray = ['Author 1', 'Author 2', 'Author 2', 'Author 2', 'Author 2'];
  const currentDate = new Date();
  const texte = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
  

  return (
    <div>
      <NavBar/>
      <ModifierArticle
        articleTitleParam="Your Article Title"
        authorsParam={authorsArray}
        institutionsParam="Your Institutions"
        keywordsParam="Your Keywords"
        publicationDateParam={currentDate}
        referencesParam="Your References"
        summaryParam={texte}
        fullTextParam="Your Full Text"
       />
      <Footer/>
    </div>
);
}

export default App;
