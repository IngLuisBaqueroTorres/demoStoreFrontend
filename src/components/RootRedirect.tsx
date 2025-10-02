import { Navigate } from 'react-router-dom';

const RootRedirect = () => {
  const rawToken = sessionStorage.getItem('token');
  const token = rawToken && rawToken !== 'null' && rawToken !== 'undefined' && rawToken.trim() !== '' ? rawToken : null;

  if (token) {
    console.log("Token found2:", token); // Debugging line
    return <Navigate to="/dashboard" replace />;
  }

  return <Navigate to="/login" replace />;
};

export default RootRedirect;
