import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getGameById, updateGame } from '../../api/game';
import Button from '../common/Button';
import Input from '../common/Input';
import Navbar from '../common/Navbar';

const GameEditor = () => {
  const { gameId } = useParams();
  const navigate = useNavigate();
  const [game, setGame] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadGame();
  }, [gameId]);

  const loadGame = async () => {
    try {
      setIsLoading(true);
      const gameData = await getGameById(gameId);
      setGame(gameData);
      setError('');
    } catch (err) {
      setError('Failed to load game');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setIsLoading(true);
      await updateGame(gameId, game);
      setError('');
      navigate('/dashboard');
    } catch (err) {
      setError('Failed to save game');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/dashboard');
  };

  const handleNameChange = (e) => {
    setGame({ ...game, name: e.target.value });
  };

  const handleThumbnailChange = (e) => {
    setGame({ ...game, thumbnail: e.target.value });
  };

  if (isLoading) {
    return <div className="text-center py-4">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center py-4">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar currentPage="game-editor" />
      
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="bg-white shadow-sm rounded-lg p-6">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Game Details</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Game Name
                </label>
                <Input
                  type="text"
                  value={game?.name || ''}
                  onChange={handleNameChange}
                  placeholder="Enter game name"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Thumbnail URL
                </label>
                <Input
                  type="text"
                  value={game?.thumbnail || ''}
                  onChange={handleThumbnailChange}
                  placeholder="Enter thumbnail URL"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <Button
              onClick={handleCancel}
              variant="secondary"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              variant="success"
            >
              Save Changes
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default GameEditor;