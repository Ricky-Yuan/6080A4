import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { getGames, createGame, deleteGame, startGame } from '../../api/game';
import Button from '../common/Button';
import Modal from '../common/Modal';
import Input from '../common/Input';
import GameCard from '../game/GameCard';
import Navbar from '../common/Navbar';

const Dashboard = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [games, setGames] = useState([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newGameName, setNewGameName] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Load games when component mounts
  useEffect(() => {
    loadGames();
  }, []);

  const loadGames = async () => {
    try {
      setIsLoading(true);
      const gamesData = await getGames();
      setGames(gamesData);
    } catch (error) {
      setError('Failed to load games');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleCreateGame = async () => {
    try {
      setIsLoading(true);
      const newGame = await createGame(newGameName);
      setGames([...games, newGame]);
      setIsCreateModalOpen(false);
      setNewGameName('');
    } catch (error) {
      setError('Failed to create game');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteGame = async (gameId) => {
    try {
      setIsLoading(true);
      await deleteGame(gameId);
      setGames(games.filter(game => game.id !== gameId));
    } catch (error) {
      setError('Failed to delete game');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartGame = async (gameId) => {
    try {
      setIsLoading(true);
      const response = await startGame(gameId);
      // Show session ID in a modal or alert
      alert(`Game started! Session ID: ${response.sessionId}`);
    } catch (error) {
      setError('Failed to start game');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar currentPage="dashboard" onLogout={handleLogout} />

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">
              Your Games
            </h1>
            <Button
              onClick={() => setIsCreateModalOpen(true)}
              variant="primary"
            >
              Create New Game
            </Button>
          </div>

          {error && (
            <div className="mb-4 text-red-500">
              {error}
            </div>
          )}


        </div>
      </main>

    </div>
  );
};

export default Dashboard; 