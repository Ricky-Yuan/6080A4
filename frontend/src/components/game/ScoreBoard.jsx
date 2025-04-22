import React from 'react';

const ScoreBoard = ({ players, currentPlayerId }) => {
  // Sort players by score in descending order
  const sortedPlayers = [...players].sort((a, b) => b.score - a.score);

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h3 className="text-lg font-semibold mb-4">Leaderboard</h3>
      <div className="space-y-2">
        {sortedPlayers.map((player, index) => (
          <div
            key={player.id}
            className={`flex items-center justify-between p-2 rounded ${
              player.id === currentPlayerId ? 'bg-blue-50' : 'hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center space-x-3">
              <span className="w-6 text-center font-medium">
                #{index + 1}
              </span>
              <span className={`font-medium ${
                player.id === currentPlayerId ? 'text-blue-600' : ''
              }`}>
                {player.name}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">
                Score:
              </span>
              <span className="font-medium">
                {player.score}
              </span>
            </div>
          </div>
        ))}
        {players.length === 0 && (
          <div className="text-center text-gray-500 py-4">
            No players yet
          </div>
        )}
      </div>
    </div>
  );
};

export default ScoreBoard; 