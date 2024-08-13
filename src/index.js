import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import SkillsPage from './components/SkillsPage';
import { AuthProvider } from './AuthContext';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Signup from './components/Signup';
import PrivateRoute from './components/PrivateRoute';

ReactDOM.render(
  <React.StrictMode>
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/" element={<SkillsPage />} />

          {/* Protect the /app route with PrivateRoute */}
          <Route element={<PrivateRoute />}>
            <Route path="/app" element={<App />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  </React.StrictMode>,
  document.getElementById('root')
);