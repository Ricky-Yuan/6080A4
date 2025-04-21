import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { getGames, createGame, deleteGame, startGame, endGame } from '../../api/game';
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
    if (currentUser) {
      loadGames();
    }
  }, [currentUser]);

  const loadGames = async () => {
    try {
      setIsLoading(true);
      setError('');

      let retryCount = 0;
      const maxRetries = 2;
      
      while (retryCount <= maxRetries) {
        try {
          const gamesData = await getGames();
          setGames(gamesData);
          setError('');
          break;
        } catch (error) {
          console.log(`Attempt ${retryCount + 1} failed:`, error);
          if (retryCount === maxRetries) {
            throw error;
          }
          retryCount++;
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }
    } catch (error) {
      console.error('Failed to load games:', error);
      setError('Failed to load games');
      setGames([]); 
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
    if (!newGameName.trim()) {
      setError('Game name is required');
      return;
    }

    try {
      setIsLoading(true);
      await createGame(newGameName);
      await loadGames();
      setIsCreateModalOpen(false);
      setNewGameName('');
      setError('');
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
      setError('');
      
      // First, end any existing active session
      try {
        await endGame(gameId);
        console.log('Successfully ended any existing session');
      } catch (error) {
        // Ignore error as there might not be an active session
        console.log('No active session to end or failed to end session:', error);
      }

      // Wait for the session to fully end
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Start a new game session
      const response = await startGame(gameId);
      console.log('Game started successfully:', response);
      
      // Get the session ID from response
      const sessionId = response?.data?.sessionId;
      if (!sessionId) {
        throw new Error('Failed to get session ID');
      }

      // Navigate to game page with session ID
      navigate(`/game/${gameId}?session=${sessionId}`);
    } catch (error) {
      console.error('Failed to start game:', error);
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

          {isLoading ? (
            <div className="text-center py-4">Loading...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {games.map(game => (
                <GameCard
                  key={game.id}
                  game={game}
                  onDelete={handleDeleteGame}
                  onStart={handleStartGame}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false);
          setNewGameName('');
          setError('');
        }}
        title="Create New Game"
        onConfirm={handleCreateGame}
        confirmText="Create"
      >
        <Input
          type="text"
          placeholder="Game Name"
          value={newGameName}
          onChange={(e) => setNewGameName(e.target.value)}
          required
        />
      </Modal>
    </div>
  );
};

export default Dashboard; 