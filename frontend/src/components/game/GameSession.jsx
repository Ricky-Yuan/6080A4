import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { startGame, endGame } from '../../api/game';
import Button from '../common/Button';

const GameSession = () => {
  const { gameId } = useParams();
  const navigate = useNavigate();
  const [sessionId, setSessionId] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleStartGame = async () => {
    try {
      setIsLoading(true);
      const response = await startGame(gameId);
      setSessionId(response.sessionId);
    } catch (error) {
      setError('Failed to start game');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEndGame = async () => {
    try {
      setIsLoading(true);
      await endGame(gameId);
      setSessionId(null);
      navigate('/dashboard');
    } catch (error) {
      setError('Failed to end game');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div className="text-center py-4">Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Game Session</h2>
          {sessionId && (
            <div className="text-sm text-gray-600">
              Session ID: {sessionId}
            </div>
          )}
        </div>

        {error && (
          <div className="mb-4 text-red-500">{error}</div>
        )}

        {!sessionId ? (
          <Button onClick={handleStartGame} variant="primary" className="w-full">
            Start Game
          </Button>
        ) : (
          <Button onClick={handleEndGame} variant="danger" className="w-full">
            End Game
          </Button>
        )}
      </div>
    </div>
  );
};

export default GameSession; 