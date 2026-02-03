import React, { useEffect } from 'react'; // Combined imports
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Register from './components/Register';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Board from './components/Board';
import Profile from './components/Profile';
import Landing from './components/Landing'; // Import the new component

// --- PRIVATE ROUTE COMPONENT ---
// This prevents unauthorized access to app pages
const PrivateRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('token');
  return isAuthenticated ? children : <Navigate to="/login" />;
};

function App() {
  
  useEffect(() => {
    // Apply the saved theme on initial load
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-bs-theme', savedTheme);
  }, []);

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        {/* Protected Routes - Wrapped in PrivateRoute */}
        <Route path="/dashboard" element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        } />
        <Route path="/project/:projectId" element={
          <PrivateRoute>
            <Board />
          </PrivateRoute>
        } />
        <Route path="/profile" element={
          <PrivateRoute>
            <Profile />
          </PrivateRoute>
        } />

        {/* Default redirect to Register */}
        <Route path="/" element={<Landing />} />
      </Routes>
    </Router>
  );
}

export default App;