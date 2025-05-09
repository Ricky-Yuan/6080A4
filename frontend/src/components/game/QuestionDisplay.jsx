import React from 'react';
import Button from '../common/Button';
import Timer from './Timer';

const QuestionDisplay = ({ question, onAnswer, timeLeft, disabled, onTimeUp }) => {
  if (!question) {
    return (
      <div className="text-center py-4">
        <p className="text-gray-600">Waiting for the game to start...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Question header */}
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">Question {question.number}</h3>
        {timeLeft > 0 && (
          <Timer
            initialTime={timeLeft}
            onTimeUp={onTimeUp}
          />
        )}
      </div>

      {/* Question content */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <p className="text-lg">{question.text}</p>
      </div>

      {/* Answer options */}
      <div className="grid grid-cols-1 gap-4">
        {question.options.map((option, index) => (
          <Button
            key={index}
            onClick={() => onAnswer(index)}
            variant="secondary"
            className={`text-left py-3 px-4 ${
              disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-50'
            }`}
            disabled={disabled}
          >
            {option}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default QuestionDisplay; 