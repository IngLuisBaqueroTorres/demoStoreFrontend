import LoginPage from './pages/LoginPage';
import './App.css';

function App() {
  return (
    <LoginPage 
      formSide='left'
      sideContent={{
        type: 'image',
        imageUrl: 'https://source.unsplash.com/random?wallpapers'
      }}
    />
  );
}

export default App;
