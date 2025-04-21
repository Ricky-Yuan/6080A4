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
        const status = await getGameStatus(sessionId);
        setSessionStatus(status);
        setError('');
      } catch (error) {
        console.error('Failed to fetch game status:', error);
        setError('Failed to fetch game status');
      }
    };

    // Initial fetch
    fetchStatus();

    // Set up polling interval
    const interval = setInterval(fetchStatus, 5000);
    return () => clearInterval(interval);
  }, [sessionId]);

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
            <div className="text-sm text-gray-600">
              Session ID: {sessionId}
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
          <PlayerList players={sessionStatus?.players || []} />
          
          {sessionStatus && sessionStatus.position >= 0 && (
            <QuestionDisplay
              question={sessionStatus.questions?.[sessionStatus.position]}
              position={sessionStatus.position}
              totalQuestions={sessionStatus.questions?.length || 0}
            />
          )}

          <div className="mt-4">
            <Button
              onClick={handleEndGame}
              variant="danger"
              className="w-full"
            >
              End Game
            </Button>
          </div>
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