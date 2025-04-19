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

  
      </main>
    </div>
  );
};

export default GameEditor;