import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginForm from './components/auth/LoginForm';
import RegisterForm from './components/auth/RegisterForm';
import Dashboard from './components/dashboard/Dashboard';
import GameSession from './components/game/GameSession';
import GameEditor from './components/game/GameEditor';
import JoinGamePage from './components/game/JoinGamePage';
import PlayGame from './components/game/PlayGame';
import Profile from './components/profile/Profile';
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
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/game/:gameId/edit"
          element={
            <ProtectedRoute>
              <GameEditor />
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
        <Route path="/play/:gameId/:sessionId" element={<JoinGamePage />} />
        <Route path="/play/:gameId/:sessionId/:playerId" element={<PlayGame />} />
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
