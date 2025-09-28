import { Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import NotFoundRedirect from './components/NotFoundRedirect';
import RootRedirect from './components/RootRedirect';
import './App.css';

function App() {
  return (
    <Routes>
      <Route path="/" element={<RootRedirect />} />
      <Route 
        path="/login" 
        element={
          <LoginPage 
            formSide='left'
            sideContent={{
              type: 'image',
              imageUrl: 'https://source.unsplash.com/random?wallpapers'
            }}
          />
        }
      />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="*" element={<NotFoundRedirect />} />
    </Routes>
  );
}

export default App;
