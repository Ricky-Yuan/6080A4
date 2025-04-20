import React from 'react';

const PlayerList = ({ players }) => {
  if (!players || players.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-4">
        <h3 className="text-lg font-semibold mb-2">Players</h3>
        <p className="text-gray-500">No players have joined yet.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h3 className="text-lg font-semibold mb-2">Players</h3>
      <div className="space-y-2">
        {players.map((player, index) => (
          <div
            key={player.id}
            className="flex justify-between items-center p-2 bg-gray-50 rounded"
          >
            <span className="font-medium">Player {index + 1}</span>
            <span className="text-sm text-gray-600">ID: {player.id}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlayerList; 