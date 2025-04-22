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
  
  // First try to end any existing session
  try {
    await endGame(gameId);
    // Wait for session to properly end
    await new Promise(resolve => setTimeout(resolve, 500));
  } catch (error) {
    console.log('Error ending current session (may not exist):', error);
  }

  // Start new game
  const response = await apiClient.post(`/admin/game/${gameId}/mutate`, { 
    mutationType: 'start' 
  });
  
  console.log('Start game response:', response);
  
  if (!response?.data?.status || response.data.status !== 'started' || !response.data.sessionId) {
    throw new Error('Invalid server response format');
  }
  
  return {
    data: {
      sessionId: response.data.sessionId
    }
  };
};

// End game session
export const endGame = async (gameId) => {
  try {
    const response = await apiClient.post(`/admin/game/${gameId}/mutate`, { 
      mutationType: 'end' 
    });
    console.log('End game response:', response);
    return response;
  } catch (error) {
    console.error('Error ending game:', error);
    throw error;
  }
};

// Get game status (admin only)
export const getGameStatus = async (sessionId) => {
  try {
    const response = await apiClient.get(`/admin/session/${sessionId}/status`);
    console.log('Admin game status response:', response);
    
    // Ensure we return a valid status object
    if (!response || !response.results) {
      return {
        results: {
          active: false,
          players: [],
          started: false,
          position: -1,
          questions: [],
          answerAvailable: false,
          isoTimeLastQuestionStarted: null
        }
      };
    }
    
    // Ensure all required fields are present
    const status = {
      ...response.results,
      players: response.results.players || [],
      started: response.results.started || false,
      position: response.results.position || -1,
      questions: response.results.questions || [],
      answerAvailable: response.results.answerAvailable || false,
      isoTimeLastQuestionStarted: response.results.isoTimeLastQuestionStarted || null
    };
    
    return { results: status };
  } catch (error) {
    console.error('Error fetching game status:', error);
    throw error;
  }
};

// Get game status (for players)
export const getPlayerGameStatus = async (sessionId) => {
  const response = await apiClient.get(`/play/session/${sessionId}/status`);
  console.log('Player status response:', response);
  return response;  // apiClient already returns the parsed response
};

// Join game session
export const joinGame = async (sessionId, playerName) => {
  try {
    const response = await apiClient.post(`/play/join/${sessionId}`, {
      name: playerName
    });
    console.log('Raw API response:', response);
    return response;  // Return the response directly since apiClient already processes it
  } catch (error) {
    console.error('Join game error:', error);
    throw error;
  }
};

// Submit answer for a question
export const submitAnswer = async (sessionId, playerId, answerIds) => {
  const response = await apiClient.put(`/play/${sessionId}/${playerId}/answer`, {
    answerIds: [answerIds]  // Backend expects an array of answer IDs
  });
  return response.data;
}; 