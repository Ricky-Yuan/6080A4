import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { startGame, endGame, getPlayerGameStatus } from '../../api/game';
import Button from '../common/Button';
import PlayerList from './PlayerList';
import QuestionDisplay from './QuestionDisplay';
import JoinGame from './JoinGame';
import CopyLink from '../common/CopyLink';
import { Box, Typography, CircularProgress, Container } from '@mui/material';

const GameSession = () => {
  const { gameId } = useParams();
  const navigate = useNavigate();
  const [sessionId, setSessionId] = useState(null);
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [playerId, setPlayerId] = useState(null);
  const [showCopyLink, setShowCopyLink] = useState(false);

  const fetchGameStatus = async () => {
    try {
      const gameStatus = await getPlayerGameStatus(sessionId);
      setStatus(gameStatus);
      setError(null);
    } catch (err) {
      setError(err.message || 'Error fetching game status');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGameStatus();
    const interval = setInterval(fetchGameStatus, 5000);
    return () => clearInterval(interval);
  }, [sessionId]);

  const handlePlayerJoined = (newPlayerId) => {
    setPlayerId(newPlayerId);
    // Refresh session status to show new player
    fetchGameStatus();
  };

  const handleStartGame = async () => {
    try {
      setLoading(true);
      setError('');
      console.log('GameSession - Starting game with ID:', gameId);
      
      try {
        // Try to end any existing active session first
        await endGame(gameId);
        console.log('Successfully ended any existing session');
      } catch (error) {
        // Ignore error as there might not be an active session
        console.log('No active session to end or failed to end session:', error);
      }

      // Wait a bit to ensure the session is fully ended
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Start a new session
      const response = await startGame(gameId);
      console.log('GameSession - Start game response:', response);
      
      // Extract sessionId from response based on backend API structure
      const newSessionId = response?.data?.sessionId;
      console.log('GameSession - Extracted sessionId:', newSessionId);

      if (!newSessionId) {
        console.error('GameSession - Invalid response structure:', response);
        throw new Error('Failed to get session ID from response');
      }

      setSessionId(newSessionId);
      setShowCopyLink(true);  // Show the copy link modal

      // Use the sessionId for status updates
      try {
        const initialStatus = await getPlayerGameStatus(newSessionId);
        console.log('GameSession - Initial session status:', initialStatus);
        setStatus(initialStatus);
      } catch (error) {
        console.error('GameSession - Failed to fetch initial session status:', error);
        setError('Failed to fetch initial session status');
      }
    } catch (error) {
      console.error('GameSession - Error starting game:', error);
      setError(`Failed to start game: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleEndGame = async () => {
    try {
      setLoading(true);
      await endGame(gameId);
      setSessionId(null);
      setStatus(null);
      navigate('/dashboard');
    } catch (error) {
      setError('Failed to end game');
    } finally {
      setLoading(false);
    }
  };

  const getJoinGameLink = () => {
    const baseUrl = window.location.origin;
    return `${baseUrl}/game/join/${gameId}/${sessionId}`;
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container>
        <Typography color="error" variant="h6">
          {error}
        </Typography>
      </Container>
    );
  }

  return (
    <Container>
      <Box py={4}>
        <Typography variant="h4" gutterBottom>
          Game Session
        </Typography>
        <Typography variant="body1">
          Session ID: {sessionId}
        </Typography>
        <Typography variant="body1">
          Status: {status?.state || 'Unknown'}
        </Typography>
        {status?.questions && (
          <Typography variant="body1">
            Questions: {status.questions.length}
          </Typography>
        )}
        {status?.position !== undefined && (
          <Typography variant="body1">
            Current Question: {status.position + 1}
          </Typography>
        )}
      </Box>
    </Container>
  );
};

export default GameSession; 