import api from '../api';

export const routeHistoryService = {
  // Add a route to history
  addToHistory: async (route) => {
    try {
      if (!route || !route.id) return false;
      await api.addToHistory(route.id);
      return true;
    } catch (error) {
      console.error('Error adding route to history:', error);
      return false;
    }
  },
  
  // Get full route history
  getHistory: async () => {
    try {
      const response = await api.getRouteHistory();
      return response.data;
    } catch (error) {
      console.error('Error getting history:', error);
      return [];
    }
  },
  
  // Get recent history (limited to n entries)
  getRecentHistory: async (limit = 20) => {
    try {
      const response = await api.getRouteHistory(limit);
      return response.data;
    } catch (error) {
      console.error('Error getting recent history:', error);
      return [];
    }
  },
  
  // Clear history
  clearHistory: async () => {
    try {
      await api.clearHistory();
      return true;
    } catch (error) {
      console.error('Error clearing history:', error);
      return false;
    }
  }
};

export default routeHistoryService;