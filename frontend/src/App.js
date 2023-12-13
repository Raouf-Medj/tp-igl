import { Route, Routes } from 'react-router-dom';
import LoginForm from './pages/Authentication/login';
import LandingPage from './pages/Landing';
import NotFound from './pages/Error/404';

function App() {
  return (
    <Routes>
      <Route path="/" exact element={<LandingPage/>} />
      <Route path="/login" exact element={<LoginForm/>} />
      <Route path="*" element={<NotFound/>} />
    </Routes>
  );
}

export default App;
