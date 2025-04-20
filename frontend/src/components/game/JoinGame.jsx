import React, { useState } from 'react';
import { joinGame } from '../../api/game';
import Button from '../common/Button';

const JoinGame = ({ sessionId, onPlayerJoined }) => {
  const [playerName, setPlayerName] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!playerName.trim()) {
      setError('请输入玩家名称');
      return;
    }

    try {
      setIsLoading(true);
      setError('');
      const response = await joinGame(sessionId, playerName.trim());
      if (response.playerId) {
        onPlayerJoined(response.playerId);
      }
    } catch (error) {
      setError(error.response?.data?.message || '加入游戏失败');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="playerName" className="block text-sm font-medium text-gray-700">
            玩家名称
          </label>
          <input
            type="text"
            id="playerName"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="请输入你的名字"
            disabled={isLoading}
          />
        </div>

        {error && (
          <div className="text-red-500 text-sm">{error}</div>
        )}

        <Button
          type="submit"
          variant="primary"
          className="w-full"
          disabled={isLoading}
        >
          {isLoading ? '加入中...' : '加入游戏'}
        </Button>
      </form>
    </div>
  );
};

export default JoinGame; 