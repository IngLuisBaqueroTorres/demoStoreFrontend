import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import './App.css';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
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
    </Routes>
  );
}

export default App;
