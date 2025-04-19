import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../common/Button';

const GameCard = ({ game, onDelete, onStart }) => {
  const navigate = useNavigate();

  const handleEdit = () => {
    navigate(`/game/${game.id}`);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 flex flex-col">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-semibold text-gray-900">{game.name}</h3>
        <div className="flex gap-2">
          <Button
            onClick={handleEdit}
            variant="primary"
            className="text-sm"
          >
            Edit
          </Button>
          {onDelete && (
            <Button
              onClick={() => onDelete(game.id)}
              variant="danger"
              className="text-sm"
            >
              Delete
            </Button>
          )}
        </div>
      </div>
      
      <div className="flex-grow">
        <p className="text-gray-600 mb-4">
          Questions: {game.questions?.length || 0}
        </p>
        {game.thumbnail && (
          <img
            src={game.thumbnail}
            alt={game.name}
            className="w-full h-32 object-cover rounded-md mb-4"
          />
        )}
      </div>

      <div className="mt-4">
        <Button
          onClick={() => onStart(game.id)}
          variant="success"
          className="w-full"
        >
          Start Game
        </Button>
      </div>
    </div>
  );
};

export default GameCard; 