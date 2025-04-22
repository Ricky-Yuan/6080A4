import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getPlayerGameStatus } from '../../api/game';
import Button from '../common/Button';

const PlayGame = () => {
  const { gameId, sessionId, playerId } = useParams();
  const [gameStatus, setGameStatus] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Fetch game status periodically
  useEffect(() => {
    const fetchGameStatus = async () => {
      try {
        const status = await getPlayerGameStatus(sessionId);
        setGameStatus(status);
        setError('');
      } catch (error) {
        console.error('Failed to fetch game status:', error);
        setError('Failed to fetch game status');
      } finally {
        setIsLoading(false);
      }
    };

    // Initial fetch
    fetchGameStatus();

    // Set up polling interval
    const interval = setInterval(fetchGameStatus, 5000);
    return () => clearInterval(interval);
  }, [sessionId]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4">Loading game...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-md mx-auto mt-8 p-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-6">Game Session</h2>
        {/* Game content will be added here */}
      </div>
    </div>
  );
};

export default PlayGame; 