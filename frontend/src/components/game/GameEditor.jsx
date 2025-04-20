import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getGameById, updateGame } from '../../api/game';
import Button from '../common/Button';
import Input from '../common/Input';
import Navbar from '../common/Navbar';

const GameEditor = () => {
  const { gameId } = useParams();
  const navigate = useNavigate();
  const [game, setGame] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadGame();
  }, [gameId]);

  const loadGame = async () => {
    try {
      setIsLoading(true);
      const gameData = await getGameById(gameId);
      setGame(gameData);
      setError('');
    } catch (err) {
      setError('Failed to load game');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setIsLoading(true);
      await updateGame(gameId, game);
      setError('');
      navigate('/dashboard');
    } catch (err) {
      setError('Failed to save game');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/dashboard');
  };

  const handleNameChange = (e) => {
    setGame({ ...game, name: e.target.value });
  };

  const handleThumbnailChange = (e) => {
    setGame({ ...game, thumbnail: e.target.value });
  };

  const handleAddQuestion = () => {
    const newQuestion = {
      id: Date.now(), // Temporary ID for frontend use
      text: '',
      type: 'multiple-choice', // 'multiple-choice' or 'true-false'
      timeLimit: 30,
      points: 10,
      answers: [
        { id: 1, text: '', isCorrect: false },
        { id: 2, text: '', isCorrect: false }
      ]
    };

    setGame({
      ...game,
      questions: [...(game.questions || []), newQuestion]
    });
  };

  const handleAddTrueFalseQuestion = () => {
    const newQuestion = {
      id: Date.now(),
      text: '',
      type: 'true-false',
      timeLimit: 30,
      points: 10,
      answers: [
        { id: 1, text: 'True', isCorrect: false },
        { id: 2, text: 'False', isCorrect: false }
      ]
    };

    setGame({
      ...game,
      questions: [...(game.questions || []), newQuestion]
    });
  };

  const handleDeleteQuestion = (index) => {
    const updatedQuestions = game.questions.filter((_, i) => i !== index);
    setGame({ ...game, questions: updatedQuestions });
  };

  const handleQuestionChange = (index, field, value) => {
    const updatedQuestions = [...game.questions];
    updatedQuestions[index] = {
      ...updatedQuestions[index],
      [field]: value
    };
    setGame({ ...game, questions: updatedQuestions });
  };

  const handleAnswerChange = (questionIndex, answerIndex, field, value) => {
    const updatedQuestions = [...game.questions];
    const answers = [...updatedQuestions[questionIndex].answers];
    answers[answerIndex] = {
      ...answers[answerIndex],
      [field]: value
    };
    updatedQuestions[questionIndex] = {
      ...updatedQuestions[questionIndex],
      answers
    };
    setGame({ ...game, questions: updatedQuestions });
  };

  const handleAddAnswer = (questionIndex) => {
    const updatedQuestions = [...game.questions];
    const newAnswer = {
      id: Date.now(),
      text: '',
      isCorrect: false
    };
    updatedQuestions[questionIndex].answers.push(newAnswer);
    setGame({ ...game, questions: updatedQuestions });
  };

  const handleDeleteAnswer = (questionIndex, answerIndex) => {
    const updatedQuestions = [...game.questions];
    const answers = updatedQuestions[questionIndex].answers.filter((_, i) => i !== answerIndex);
    updatedQuestions[questionIndex] = {
      ...updatedQuestions[questionIndex],
      answers
    };
    setGame({ ...game, questions: updatedQuestions });
  };

  if (isLoading) {
    return <div className="text-center py-4">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center py-4">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar currentPage="game-editor" />
      
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="bg-white shadow-sm rounded-lg p-6">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Game Details</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Game Name
                </label>
                <Input
                  type="text"
                  value={game?.name || ''}
                  onChange={handleNameChange}
                  placeholder="Enter game name"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Thumbnail URL
                </label>
                <Input
                  type="text"
                  value={game?.thumbnail || ''}
                  onChange={handleThumbnailChange}
                  placeholder="Enter thumbnail URL"
                />
              </div>
            </div>
          </div>

          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-900">Questions</h2>
              <div className="flex gap-2">
                <Button
                  onClick={handleAddQuestion}
                  variant="primary"
                  className="text-sm"
                >
                  Add Multiple Choice
                </Button>
                <Button
                  onClick={handleAddTrueFalseQuestion}
                  variant="primary"
                  className="text-sm"
                >
                  Add True/False
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              {game?.questions?.map((question, index) => (
                <div key={question.id} className="border rounded-lg p-4 bg-gray-50">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold">Question {index + 1}</h3>
                      <p className="text-sm text-gray-600">
                        {question.type === 'true-false' ? 'True/False' : 'Multiple Choice'}
                      </p>
                    </div>
                    <Button
                      onClick={() => handleDeleteQuestion(index)}
                      variant="danger"
                      className="text-sm"
                    >
                      Delete
                    </Button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Question Text
                      </label>
                      <Input
                        type="text"
                        value={question.text}
                        onChange={(e) => handleQuestionChange(index, 'text', e.target.value)}
                        placeholder="Enter question text"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Time Limit (seconds)
                        </label>
                        <Input
                          type="number"
                          value={question.timeLimit}
                          onChange={(e) => handleQuestionChange(index, 'timeLimit', parseInt(e.target.value))}
                          min="1"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Points
                        </label>
                        <Input
                          type="number"
                          value={question.points}
                          onChange={(e) => handleQuestionChange(index, 'points', parseInt(e.target.value))}
                          min="0"
                        />
                      </div>
                    </div>

                    <div className="border-t pt-4 mt-4">
                      <div className="flex justify-between items-center mb-4">
                        <label className="block text-lg font-medium text-gray-900">
                          Answers
                        </label>
                        {question.type === 'multiple-choice' && (
                          <Button
                            onClick={() => handleAddAnswer(index)}
                            variant="primary"
                            className="text-sm"
                          >
                            Add Answer
                          </Button>
                        )}
                      </div>
                      <div className="space-y-3">
                        {question.answers.map((answer, answerIndex) => (
                          <div key={answer.id} className="flex items-start gap-3 bg-white p-3 rounded-lg border">
                            <div className="flex-1">
                              {question.type === 'true-false' ? (
                                <div className="text-gray-700 py-2 px-1">{answer.text}</div>
                              ) : (
                                <Input
                                  type="text"
                                  value={answer.text}
                                  onChange={(e) => handleAnswerChange(index, answerIndex, 'text', e.target.value)}
                                  placeholder={`Answer ${answerIndex + 1}`}
                                />
                              )}
                            </div>
                            <div className="flex items-center gap-4">
                              <label className="flex items-center gap-2 whitespace-nowrap">
                                <input
                                  type="radio"
                                  name={`correct-answer-${question.id}`}
                                  checked={answer.isCorrect}
                                  onChange={(e) => {
                                    // 设置当前选项为正确答案，其他选项为错误答案
                                    const updatedQuestions = [...game.questions];
                                    updatedQuestions[index].answers = updatedQuestions[index].answers.map((a, i) => ({
                                      ...a,
                                      isCorrect: i === answerIndex
                                    }));
                                    setGame({ ...game, questions: updatedQuestions });
                                  }}
                                  className="w-4 h-4 border-gray-300 text-blue-600 focus:ring-blue-500"
                                />
                                <span className="text-sm font-medium text-gray-700">Correct Answer</span>
                              </label>
                              {question.type === 'multiple-choice' && (
                                <Button
                                  onClick={() => handleDeleteAnswer(index, answerIndex)}
                                  variant="danger"
                                  className="text-sm"
                                >
                                  Delete
                                </Button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <Button
              onClick={handleCancel}
              variant="secondary"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              variant="success"
            >
              Save Changes
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default GameEditor;