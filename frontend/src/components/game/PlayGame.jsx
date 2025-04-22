import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getPlayerGameStatus, submitAnswer } from '../../api/game';
import Button from '../common/Button';
import QuestionDisplay from './QuestionDisplay';
import ScoreBoard from './ScoreBoard';

const PlayGame = () => {
  const { gameId, sessionId, playerId } = useParams();
  const [gameStatus, setGameStatus] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [timeLeft, setTimeLeft] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [hasAnswered, setHasAnswered] = useState(false);

  useEffect(() => {
    const fetchGameStatus = async () => {
      try {
        const status = await getPlayerGameStatus(sessionId);
        console.log('Player game status:', status, 'Player ID:', playerId);
        
        if (status) {
          setGameStatus(status);
          
          if (status.question) {
            setCurrentQuestion({
              number: status.position + 1,
              text: status.question.text,
              options: status.question.options || []
            });
            setTimeLeft(status.timeLeft);
          }
        }
        
        setError('');
      } catch (error) {
        console.error('Failed to fetch game status:', error);
        setError('Failed to fetch game status');
      } finally {
        setIsLoading(false);
      }
    };

    fetchGameStatus();
    const interval = setInterval(fetchGameStatus, 2000);
    return () => clearInterval(interval);
  }, [sessionId, playerId]);

  const handleAnswer = async (optionIndex) => {
    if (hasAnswered) return;

    try {
      setIsLoading(true);
      await submitAnswer(sessionId, playerId, optionIndex);
      setHasAnswered(true);
    } catch (error) {
      console.error('Failed to submit answer:', error);
      setError('Failed to submit answer. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTimeUp = () => {
    if (!hasAnswered) {
      setHasAnswered(true);
      console.log('Time is up! Moving to next question...');
    }
  };

  useEffect(() => {
    if (currentQuestion) {
      setHasAnswered(false);
    }
  }, [currentQuestion?.number]);

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
    <div className="max-w-6xl mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold mb-6">Game Session</h2>
            {!gameStatus?.started ? (
              <p>Waiting for the game to start...</p>
            ) : (
              <QuestionDisplay
                question={currentQuestion}
                onAnswer={handleAnswer}
                timeLeft={timeLeft}
                disabled={hasAnswered}
                onTimeUp={handleTimeUp}
              />
            )}
            {hasAnswered && gameStatus?.started && (
              <div className="mt-4 p-3 bg-green-50 text-green-700 rounded-md">
                {timeLeft <= 0 
                  ? "Time's up! Waiting for next question..."
                  : "Answer submitted! Waiting for next question..."}
              </div>
            )}
          </div>
        </div>
        
        <div className="md:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">Leaderboard</h2>
            <ScoreBoard
              players={gameStatus?.players || []}
              currentPlayerId={playerId}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayGame; 