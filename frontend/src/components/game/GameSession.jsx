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
  const [playerId, setPlayerId] = useState(null);
  const [showCopyLink, setShowCopyLink] = useState(false);

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
    fetchSessionStatus();
  };

  const handleStartGame = async () => {
    try {
      setIsLoading(true);
      setError('');
      
      // 先尝试结束任何可能存在的活跃会话
      try {
        await endGame(gameId);
        console.log('Successfully ended any existing session');
      } catch (error) {
        // 忽略错误，因为可能没有活跃会话
        console.log('No active session to end or failed to end session:', error);
      }

      // 开始新的游戏会话
      const response = await startGame(gameId);
      console.log('Game started:', response);
      
      // 获取会话ID
      const sessionId = response?.data?.sessionId;
      if (!sessionId) {
        throw new Error('No session ID received');
      }

      // 设置会话ID并获取初始状态
      setSessionId(sessionId);
      const initialStatus = await getGameStatus(sessionId);
      setSessionStatus(initialStatus);
      setError(null);
    } catch (err) {
      console.error('Error starting game:', err);
      setError(err.message || '启动游戏时出错');
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