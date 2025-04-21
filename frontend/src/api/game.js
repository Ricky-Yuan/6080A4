import apiClient from './index';
import axios from 'axios';

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
  // First get all existing games
  const existingGames = await getGames();
  
  // Create new game object
  const newGame = {
    name,
    owner: email,
    questions: []
  };

  // Update games list with the new game
  await apiClient.put('/admin/games', {
    games: [...existingGames, newGame].map(game => ({
      ...game,
      owner: email
    }))
  });

  // Get updated games list and return the new game
  const updatedGames = await getGames();
  return updatedGames[updatedGames.length - 1];
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
  console.log('Starting game with ID:', gameId);
  const response = await apiClient.post(`/admin/game/${gameId}/mutate`, { 
    mutationType: 'start' 
  });
  console.log('Start game response:', response);
  return response.data;  // Return the raw response data from backend
};

// End game session
export const endGame = async (gameId) => {
  const response = await apiClient.post(`/admin/game/${gameId}/mutate`, { mutationType: 'end' });
  return response;
};

// Get game status (admin only)
export const getGameStatus = async (sessionId) => {
  const response = await apiClient.get(`/admin/session/${sessionId}/status`);
  return response.data;
};

// Get game status (for players)
export const getPlayerGameStatus = async (sessionId) => {
  const response = await apiClient.get(`/play/session/${sessionId}/status`);
  return response.data;  // Return the entire response data, not just results
};

// Join game session
export const joinGame = async (sessionId, playerName) => {
  const response = await apiClient.post(`/play/join/${sessionId}`, {
    name: playerName
  });
  return response;
}; 