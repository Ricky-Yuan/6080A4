import React, { useState, useEffect } from 'react';
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

  // Get the join link for players
  const getJoinGameLink = () => {
    const baseUrl = window.location.origin;
    return `${baseUrl}/play/${gameId}/${sessionId}`;
  };

  // Fetch game status periodically
  useEffect(() => {
    if (!sessionId) return;

    const fetchStatus = async () => {
      try {
        const response = await getGameStatus(sessionId);
        console.log('Game session status:', response);
        
        if (!response || !response.results) {
          throw new Error('Invalid response format');
        }

        // Ensure we have a valid status object with players array
        const updatedStatus = {
          ...response.results,
          players: response.results.players || [],
          started: response.results.started || false,
          position: response.results.position || -1,
          questions: response.results.questions || []
        };
        
        setSessionStatus(updatedStatus);
        setError('');
      } catch (error) {
        console.error('Failed to fetch game status:', error);
        setError('Failed to fetch game status');
      }
    };

    fetchStatus();
    const interval = setInterval(fetchStatus, 2000);
    return () => clearInterval(interval);
  }, [sessionId]);

  const handleStartGame = async () => {
    try {
      setIsLoading(true);
      setError('');

      // Check if we're already in a session with players
      if (sessionStatus?.players?.length > 0 && sessionId) {
        // We're advancing the game to the first question
        const response = await startGame(gameId);
        console.log('Advancing game to first question:', response);
        
        // Don't show the copy link modal when advancing
        setShowCopyLink(false);
        
        // Update game status
        const updatedStatus = await getGameStatus(sessionId);
        if (updatedStatus?.results) {
          setSessionStatus({
            ...updatedStatus.results,
            players: updatedStatus.results.players || [],
            started: true,
            position: 0,
            questions: updatedStatus.results.questions || []
          });
        }
        return;
      }

      // Starting a new game session
      let maxRetries = 3;
      let retryCount = 0;
      let response = null;
      let lastError = null;

      while (retryCount < maxRetries) {
        try {
          response = await startGame(gameId);
          if (response?.data?.sessionId) {
            break;
          }
          await new Promise(resolve => setTimeout(resolve, 1000));
        } catch (error) {
          lastError = error;
          console.log(`Start game attempt ${retryCount + 1}/${maxRetries} failed:`, error);
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
        retryCount++;
      }

      if (!response?.data?.sessionId) {
        throw new Error(lastError?.message || 'Failed to start game after multiple attempts');
      }

      // Update session ID and state
      const newSessionId = response.data.sessionId;
      setSessionId(newSessionId);
      
      // Update URL without triggering navigation
      const newUrl = `/game/${gameId}?session=${newSessionId}`;
      window.history.replaceState(null, '', newUrl);
      
      // Only show copy link dialog when initially starting the game
      setShowCopyLink(true);
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
                  question={sessionStatus.questions?.[sessionStatus.position]}
                  position={sessionStatus.position}
                  totalQuestions={sessionStatus.questions?.length || 0}
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