import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { joinGame, getPlayerGameStatus } from '../../api/game';
import Button from '../common/Button';

const JoinGamePage = () => {
  const { gameId, sessionId } = useParams();
  const navigate = useNavigate();
  const [playerName, setPlayerName] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [gameStatus, setGameStatus] = useState(null);

  useEffect(() => {
    const fetchGameStatus = async () => {
      try {
        const status = await getPlayerGameStatus(sessionId);
        setGameStatus(status);
        if (status?.started) {
          setError('The game has already started, please join another game');
        }
      } catch (error) {
        console.error('Failed to get game status:', error);
        setError('Failed to get game status');
      }
    };
    fetchGameStatus();
  }, [sessionId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!playerName.trim()) {
      setError('Please enter your name');
      return;
    }

    try {
      setIsLoading(true);
      setError('');
      const response = await joinGame(sessionId, playerName);
      console.log('Join game response:', response);
      
      if (!response || typeof response.playerId === 'undefined') {
        console.error('Invalid response format:', response);
        throw new Error('Server response missing playerId');
      }
      
      navigate(`/play/${gameId}/${sessionId}/${response.playerId}`);
    } catch (error) {
      console.error('Error joining game:', error);
      setError(error.message || 'Failed to join game. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Only show error message if game has started
  if (gameStatus?.started) {
    return (
      <div className="max-w-md mx-auto mt-8 p-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>The game has already started, please join another game</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-8 p-4">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-6">Join Game</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="playerName" className="block text-sm font-medium text-gray-700">
              Player Name
            </label>
            <input
              type="text"
              id="playerName"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder="Please enter your name"
              disabled={isLoading}
            />
          </div>

          {error && (
            <div className="text-red-500 text-sm">{error}</div>
          )}

          <Button
            type="submit"
            variant="primary"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? 'Joining...' : 'Join Game'}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default JoinGamePage; 