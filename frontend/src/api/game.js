import apiClient from './index';

// Get all games
export const getGames = async () => {
  const response = await apiClient.get('/admin/games');
  if (Array.isArray(response)) {
    return response;
  }
  // 如果返回的是对象形式，转换为数组
  if (response && typeof response === 'object' && response.games) {
    return response.games;
  }
  return [];
};

// Create a new game
export const createGame = async (name) => {
  const response = await apiClient.post('/admin/games', { name });
  return response;
};

// Delete a game
export const deleteGame = async (gameId) => {
  await apiClient.delete(`/admin/games/${gameId}`);
};

// Get game details
export const getGameById = async (gameId) => {
  const response = await apiClient.get(`/admin/games/${gameId}`);
  return response;
};

// Update game details
export const updateGame = async (gameId, data) => {
  const response = await apiClient.put(`/admin/games/${gameId}`, data);
  return response;
};

// Start game session
export const startGame = async (gameId) => {
  const response = await apiClient.post(`/admin/game/${gameId}/mutate`, { mutationType: 'start' });
  return response;
};

// End game session
export const endGame = async (gameId) => {
  const response = await apiClient.post(`/admin/game/${gameId}/mutate`, { mutationType: 'end' });
  return response;
};

// Get game status
export const getGameStatus = async (gameId) => {
  const response = await apiClient.get(`/admin/game/${gameId}/status`);
  return response;
}; 