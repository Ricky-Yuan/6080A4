import React from 'react';

const PlayerList = ({ players }) => {
  // Remove duplicate players
  const uniquePlayers = [...new Set(players)];

  return (
    <div className="space-y-2">
      {uniquePlayers.map((playerName, index) => (
        <div
          key={`${playerName}-${index}`}
          className="bg-gray-50 p-2 rounded-md"
        >
          <span className="font-medium">{playerName}</span>
        </div>
      ))}
    </div>
  );
};

export default PlayerList; 