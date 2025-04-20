import React from 'react';

const QuestionDisplay = ({ question, position, totalQuestions }) => {
  if (!question) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <p className="text-gray-500 text-center">
          {position === -1 ? 'Game not started' : 'Game ended'}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold">Question {position + 1}</h3>
        <span className="text-sm text-gray-500">
          {position + 1} / {totalQuestions}
        </span>
      </div>

      <div className="mb-6">
        <p className="text-lg mb-2">{question.text}</p>
        {question.image && (
          <img
            src={question.image}
            alt="Question"
            className="w-full h-48 object-cover rounded-lg mb-4"
          />
        )}
        <div className="text-sm text-gray-500">
          Time limit: {question.duration} seconds
        </div>
      </div>

      <div className="space-y-3">
        {question.answers.map((answer, index) => (
          <div
            key={index}
            className="p-3 bg-gray-50 rounded-lg flex items-center"
          >
            <span className="w-8 h-8 flex items-center justify-center bg-blue-100 text-blue-800 rounded-full mr-3">
              {String.fromCharCode(65 + index)}
            </span>
            <span>{answer.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuestionDisplay; 