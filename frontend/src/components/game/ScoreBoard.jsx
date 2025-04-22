import React from 'react';

const ScoreBoard = ({ players, currentPlayerId }) => {
  // Sort players by score in descending order
  const sortedPlayers = [...players].sort((a, b) => (b.score || 0) - (a.score || 0));

  if (!players || players.length === 0) {
    return (
      <div className="text-gray-500 text-center">
        No players yet
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {sortedPlayers.map((player) => (
        <div
          key={player.id || player.playerId}
          className={`p-2 rounded ${
            player.id === currentPlayerId ? 'bg-blue-100' : 'bg-gray-50'
          }`}
        >
          <div className="flex justify-between items-center">
            <span className="font-medium">{player.name}</span>
            <span className="text-gray-600">{player.score || 0}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ScoreBoard; 