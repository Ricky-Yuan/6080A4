import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { startGame, endGame, getGameStatus } from '../../api/game';
import Button from '../common/Button';
import PlayerList from './PlayerList';
import QuestionDisplay from './QuestionDisplay';
import JoinGame from './JoinGame';
import CopyLink from '../common/CopyLink';

const GameSession = () => {
  const { gameId } = useParams();
  const navigate = useNavigate();
  const [sessionId, setSessionId] = useState(null);
  const [sessionStatus, setSessionStatus] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showCopyLink, setShowCopyLink] = useState(false);

  // 初始化游戏会话
  useEffect(() => {
    const initializeSession = async () => {
      try {
        setIsLoading(true);
        // 尝试获取游戏状态
        const response = await startGame(gameId);
        const newSessionId = response?.data?.sessionId;
        
        if (newSessionId) {
          setSessionId(newSessionId);
          const status = await getGameStatus(newSessionId);
          setSessionStatus(status);
        }
      } catch (error) {
        console.error('Failed to initialize game session:', error);
        setError('Failed to initialize game session');
      } finally {
        setIsLoading(false);
      }
    };

    initializeSession();
  }, [gameId]);

  // 定期更新游戏状态
  useEffect(() => {
    if (!sessionId) return;

    const fetchStatus = async () => {
      try {
        const status = await getGameStatus(sessionId);
        setSessionStatus(status);
      } catch (error) {
        console.error('Failed to fetch game status:', error);
      }
    };

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

  const getJoinGameLink = () => {
    const baseUrl = window.location.origin;
    return `${baseUrl}/game/join/${gameId}/${sessionId}`;
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
                copy link
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