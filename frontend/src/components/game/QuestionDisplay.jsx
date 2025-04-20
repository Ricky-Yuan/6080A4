import React from 'react';

const QuestionDisplay = ({ question, position, totalQuestions }) => {
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h3 className="text-lg font-semibold mb-2">Current Question</h3>
      
      {question ? (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">
              Question {position + 1} of {totalQuestions}
            </span>
            <span className="text-sm text-gray-600">
              Points: {question.points || 0}
            </span>
          </div>
          
          <div className="p-4 bg-gray-50 rounded">
            <p className="text-lg">{question.text}</p>
          </div>

          {question.answers && (
            <div className="space-y-2">
              <p className="font-medium">Answers:</p>
              {question.answers.map((answer, index) => (
                <div
                  key={answer.id}
                  className="p-2 bg-white border border-gray-200 rounded flex items-center"
                >
                  <span className="mr-2">{String.fromCharCode(65 + index)}.</span>
                  <span>{answer.text}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <p className="text-gray-500">Waiting for the game to start...</p>
      )}
    </div>
  );
};

export default QuestionDisplay; 