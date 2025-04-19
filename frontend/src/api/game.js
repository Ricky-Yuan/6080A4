import apiClient from './index';

// Get all games
export const getGames = async () => {
  const response = await apiClient.get('/admin/quiz');
  return response.quizzes;
};

// Create a new game
export const createGame = async (name) => {
  const response = await apiClient.post('/admin/quiz/new', { name });
  return response;
};

// Delete a game
export const deleteGame = async (gameId) => {
  await apiClient.delete(`/admin/quiz/${gameId}`);
};

// Get game details
export const getGameById = async (gameId) => {
  const response = await apiClient.get(`/admin/quiz/${gameId}`);
  return response;
};

// Update game details
export const updateGame = async (gameId, data) => {
  const response = await apiClient.put(`/admin/quiz/${gameId}`, data);
  return response;
};

// Start game session
export const startGame = async (gameId) => {
  const response = await apiClient.post(`/admin/quiz/${gameId}/start`);
  return response;
};

// End game session
export const endGame = async (gameId) => {
  const response = await apiClient.post(`/admin/quiz/${gameId}/end`);
  return response;
};

// Get game status
export const getGameStatus = async (gameId) => {
  const response = await apiClient.get(`/admin/quiz/${gameId}/status`);
  return response;
}; 