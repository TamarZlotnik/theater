import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './components/HomePage';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import MovieOrderPage from './components/MovieOrderPage';
import AdminPage from './components/AdminPage';
import { AuthContext } from './context/AuthContext';

function App() {
  const { user } = React.useContext(AuthContext);

  return (
    <div className="App">
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
  

        <Route path="/movie/:movieId/:id" element={<MovieOrderPage />} />
        {user && user.role == 'admin' && <Route path="/admin" element={<AdminPage />} />}
      </Routes>
    </div>
  );
}

export default App;
