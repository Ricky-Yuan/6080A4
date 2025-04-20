import React from 'react';

const PlayerList = ({ players = [] }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h3 className="text-lg font-semibold mb-4">Players</h3>
      {players.length === 0 ? (
        <p className="text-gray-500">Waiting for players to join...</p>
      ) : (
        <ul className="space-y-2">
          {players.map((player, index) => (
            <li
              key={index}
              className="flex items-center justify-between p-2 bg-gray-50 rounded"
            >
              <span className="text-gray-800">{player}</span>
              <span className="text-sm text-gray-500">#{index + 1}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default PlayerList; 