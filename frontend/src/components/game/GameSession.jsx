import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { startGame, endGame, getGameStatus } from '../../api/game';
import Button from '../common/Button';
import PlayerList from './PlayerList';
import QuestionDisplay from './QuestionDisplay';
import JoinGame from './JoinGame';

const GameSession = () => {
  const { gameId } = useParams();
  const navigate = useNavigate();
  const [sessionId, setSessionId] = useState(null);
  const [sessionStatus, setSessionStatus] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [playerId, setPlayerId] = useState(null);

  const fetchSessionStatus = async () => {
    if (!sessionId) {
      console.log('GameSession - No sessionId available, skipping status fetch');
      return;
    }
    try {
      console.log('GameSession - Fetching status for session:', sessionId);
      const status = await getGameStatus(sessionId);
      console.log('GameSession - Received status:', status);
      setSessionStatus(status);
    } catch (error) {
      console.error('GameSession - Failed to fetch session status:', error);
      setError('Failed to fetch session status');
    }
  };

  useEffect(() => {
    if (sessionId) {
      fetchSessionStatus();
      const interval = setInterval(fetchSessionStatus, 5000);
      return () => clearInterval(interval);
    }
  }, [sessionId]);

  const handlePlayerJoined = (newPlayerId) => {
    setPlayerId(newPlayerId);
    // 刷新会话状态以显示新玩家
    fetchSessionStatus();
  };

  const handleStartGame = async () => {
    try {
      setIsLoading(true);
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
      // Use the sessionId for status updates
      try {
        const initialStatus = await getGameStatus(newSessionId);
        console.log('GameSession - Initial session status:', initialStatus);
        setSessionStatus(initialStatus);
      } catch (error) {
        console.error('GameSession - Failed to fetch initial session status:', error);
        setError('Failed to fetch initial session status');
      }
    } catch (error) {
      console.error('GameSession - Error starting game:', error);
      setError(`Failed to start game: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEndGame = async () => {
    try {
      setIsLoading(true);
      await endGame(gameId);
      setSessionId(null);
      setSessionStatus(null);
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
          <div className="space-y-6">
            {!playerId && sessionStatus?.position === -1 ? (
              <JoinGame 
                sessionId={sessionId} 
                onPlayerJoined={handlePlayerJoined} 
              />
            ) : (
              <>
                <PlayerList players={sessionStatus?.players || []} />
                
                {sessionStatus && (
                  <QuestionDisplay
                    question={sessionStatus.questions?.[sessionStatus.position]}
                    position={sessionStatus.position}
                    totalQuestions={sessionStatus.questions?.length || 0}
                  />
                )}
              </>
            )}

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">Debug Info</h3>
              <pre className="text-sm">
                {JSON.stringify(sessionStatus, null, 2)}
              </pre>
            </div>

            <Button onClick={handleEndGame} variant="danger" className="w-full">
              End Game
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default GameSession; 