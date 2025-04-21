import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginForm from './components/auth/LoginForm';
import RegisterForm from './components/auth/RegisterForm';
import Dashboard from './components/dashboard/Dashboard';
import GameSession from './components/game/GameSession';
import JoinGamePage from './components/game/JoinGamePage';
import { useAuth } from './contexts/AuthContext';

const App = () => {
  const { currentUser } = useAuth();

  const ProtectedRoute = ({ children }) => {
    if (!currentUser) {
      return <Navigate to="/login" replace />;
    }
    return children;
  };

  return (
    <Router>
      <Routes>
        <Route 
          path="/login" 
          element={currentUser ? <Navigate to="/dashboard" /> : <LoginForm />} 
        />
        <Route 
          path="/register" 
          element={currentUser ? <Navigate to="/dashboard" /> : <RegisterForm />} 
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route path="/game/join/:gameId/:sessionId" element={<JoinGamePage />} />
        <Route
          path="/game/:gameId"
          element={
            <ProtectedRoute>
              <GameSession />
            </ProtectedRoute>
          }
        />
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
