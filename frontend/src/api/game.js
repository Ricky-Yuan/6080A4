import apiClient from './index';

// Get all games
export const getGames = async () => {
  const response = await apiClient.get('/admin/games');
  if (Array.isArray(response)) {
    return response;
  }
  // If response is an object, convert to array
  if (response && typeof response === 'object' && response.games) {
    return response.games;
  }
  return [];
};

// Create a new game
export const createGame = async (name) => {
  const email = JSON.parse(localStorage.getItem('currentUser')).email;
  const response = await apiClient.put('/admin/games', {
    games: [{
      name,
      owner: email,
      questions: []
    }]
  });
  // After creating the game, fetch the updated game list and return the newly created game
  const games = await getGames();
  return games[games.length - 1];
};

// Delete a game
export const deleteGame = async (gameId) => {
  const email = JSON.parse(localStorage.getItem('currentUser')).email;
  // First get all games
  const allGames = await getGames();
  // Filter out the game to be deleted
  const remainingGames = allGames.filter(game => game.id.toString() !== gameId.toString());
  // Update the game list
  await apiClient.put('/admin/games', {
    games: remainingGames.map(game => ({
      ...game,
      owner: email
    }))
  });
};

// Get game details
export const getGameById = async (gameId) => {
  const games = await getGames();
  const game = games.find(g => g.id.toString() === gameId.toString());
  if (!game) {
    throw new Error('Game not found');
  }
  return game;
};

// Update game details
export const updateGame = async (gameId, data) => {
  const email = JSON.parse(localStorage.getItem('currentUser')).email;
  const allGames = await getGames();
  const gameIndex = allGames.findIndex(g => g.id.toString() === gameId.toString());
  
  if (gameIndex === -1) {
    throw new Error('Game not found');
  }

  // Update game data
  allGames[gameIndex] = {
    ...allGames[gameIndex],
    ...data,
    owner: email,
    id: gameId
  };

  // Update game list
  await apiClient.put('/admin/games', {
    games: allGames.map(game => ({
      ...game,
      owner: email
    }))
  });

  return allGames[gameIndex];
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