import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { startGame, endGame, getGameStatus } from '../../api/game';
import Button from '../common/Button';
import PlayerList from './PlayerList';
import QuestionDisplay from './QuestionDisplay';
import CopyLink from '../common/CopyLink';

const GameSession = () => {
  const { gameId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  // Get session ID from URL query parameters
  const [sessionId, setSessionId] = useState(searchParams.get('session'));
  const [sessionStatus, setSessionStatus] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showCopyLink, setShowCopyLink] = useState(true);
  const [gameStarted, setGameStarted] = useState(false);
  const [errorCount, setErrorCount] = useState(0);

  // Get the join link for players
  const getJoinGameLink = () => {
    const baseUrl = window.location.origin;
    return `${baseUrl}/play/${gameId}/${sessionId}`;
  };

  // Function to fetch game status
  const fetchStatus = useCallback(async () => {
    if (!sessionId) return;

    try {
      const response = await getGameStatus(sessionId);
      console.log('Polling game status:', response);
      
      if (!response || !response.results) {
        throw new Error('Invalid response format');
      }

      // Build updated status object
      const updatedStatus = {
        ...response.results,
        players: response.results.players || [],
        started: response.results.started || gameStarted,
        position: response.results.position ?? -1,
        questions: response.results.questions || []
      };
      
      // Only update when status actually changes
      setSessionStatus(prevStatus => {
        if (JSON.stringify(prevStatus) === JSON.stringify(updatedStatus)) {
          return prevStatus;
        }
        return updatedStatus;
      });

      // Reset error count
      setErrorCount(0);
      setError('');
    } catch (error) {
      console.error('Failed to fetch game status:', error);
      // Only show error after multiple consecutive failures
      setErrorCount(prev => {
        if (prev >= 2) {
          setError('Failed to fetch game status');
        }
        return prev + 1;
      });
    }
  }, [sessionId, gameStarted]);

  // Periodically fetch game status
  useEffect(() => {
    if (!sessionId) return;

    fetchStatus();
    const interval = setInterval(fetchStatus, 2000);
    return () => clearInterval(interval);
  }, [sessionId, fetchStatus]);

  // Handle URL parameter changes
  useEffect(() => {
    const sessionFromUrl = searchParams.get('session');
    if (sessionFromUrl && sessionFromUrl !== sessionId) {
      console.log('URL session ID changed:', sessionFromUrl);
      setSessionId(sessionFromUrl);
    }
  }, [searchParams, sessionId]);

  const handleStartGame = async () => {
    // Prevent multiple starts
    if (gameStarted) return;
    
    try {
      setIsLoading(true);
      setError('');

      // Check if players have already joined
      if (sessionStatus?.players?.length > 0 && sessionId) {
        // Start the game
        const response = await startGame(gameId);
        console.log('Start game response:', response);
        
        setGameStarted(true);
        setShowCopyLink(false);
        
        // Update game status
        await fetchStatus();
        return;
      }

      // Start new game session
      const response = await startGame(gameId);
      console.log('Starting new game session:', response);

      if (!response?.data?.sessionId) {
        throw new Error('Invalid server response format');
      }

      // Update session ID and state
      const newSessionId = response.data.sessionId;
      setSessionId(newSessionId);
      
      // Update URL without triggering navigation
      const newUrl = `/game/${gameId}?session=${newSessionId}`;
      window.history.replaceState(null, '', newUrl);
      
      // Show copy link dialog
      setShowCopyLink(true);
      
      // Get initial game status
      await fetchStatus();
    } catch (error) {
      console.error('Failed to start game:', error);
      setError(error.message || 'Failed to start game. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEndGame = async () => {
    try {
      setIsLoading(true);
      await endGame(gameId);
      setGameStarted(false);
      navigate('/dashboard');
    } catch (error) {
      console.error('Failed to end game:', error);
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
            <div className="text-sm text-gray-600 flex items-center">
              <span>Session ID: {sessionId}</span>
              <Button
                onClick={() => setShowCopyLink(true)}
                variant="link"
                className="ml-2"
              >
                Copy Join Link
              </Button>
            </div>
          )}
        </div>

        {error && (
          <div className="mb-4 text-red-500">{error}</div>
        )}

        <div className="space-y-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-semibold">Players</h3>
              <span className="text-sm text-gray-500">
                {sessionStatus?.players?.length || 0} players joined
              </span>
            </div>
            {sessionStatus?.players && sessionStatus.players.length > 0 ? (
              <PlayerList players={sessionStatus.players} />
            ) : (
              <p className="text-gray-500">No players have joined yet.</p>
            )}
          </div>
          
          {!sessionStatus?.started ? (
            <Button
              onClick={handleStartGame}
              variant="primary"
              className="w-full"
              disabled={!sessionStatus?.players?.length}
            >
              {sessionStatus?.players?.length ? 'Start Game' : 'Waiting for Players...'}
            </Button>
          ) : (
            <>
              {sessionStatus.position >= 0 && (
                <QuestionDisplay
                  question={{
                    number: sessionStatus.position + 1,
                    text: sessionStatus.questions?.[sessionStatus.position]?.text || '',
                    options: sessionStatus.questions?.[sessionStatus.position]?.answers?.map(a => a.text) || []
                  }}
                  onAnswer={() => {}}
                  timeLeft={0}
                  disabled={false}
                  onTimeUp={() => {}}
                />
              )}
              <Button
                onClick={handleEndGame}
                variant="danger"
                className="w-full"
              >
                End Game
              </Button>
            </>
          )}
        </div>

        {showCopyLink && (
          <CopyLink
            link={getJoinGameLink()}
            onClose={() => setShowCopyLink(false)}
          />
        )}
      </div>
    </div>
  );
};

export default GameSession; 